import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { useToast } from "../context/Toast.context.jsx";
import { chatService } from "../services/chat.service.js";
import { sessionService } from "../services/session.service.js";
import { reviewService } from "../services/review.service.js";

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function LearningRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const { toast } = useToast();

  // Session info
  const [session, setSession] = useState(null);
  const isTeacher = session?.teacher?._id === user?._id;

  // Chat
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  // WebRTC & Media
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const ignoreOffer = useRef(false);
  const makingOffer = useRef(false);
  const isTeacherRef = useRef(false);

  useEffect(() => {
    isTeacherRef.current = isTeacher;
  }, [isTeacher]);

  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  // Call states: "idle", "waiting" (for partner), "active"
  const [callStatus, setCallStatus] = useState("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [totalCallMinutes, setTotalCallMinutes] = useState(0);
  const callTimerRef = useRef(null);

  // Session completion
  const [completing, setCompleting] = useState(false);

  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (session && user) {
      const currentUserId = user._id?.toString();
      const hasRev = session.reviewedBy?.some(id => id.toString() === currentUserId);
      setHasReviewed(hasRev || false);
    }
  }, [session, user]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // ---- Load session info & chat history ----
  useEffect(() => {
    sessionService
      .getById(id)
      .then((r) => {
        setSession(r.data.session);
        setTotalCallMinutes(r.data.session.actualCallMinutes || 0);
      })
      .catch((e) => {
        console.error(e);
        toast({ message: "Failed to load session info.", type: "error" });
      });

    chatService
      .getHistory(id)
      .then((r) => setMessages(r.data.messages || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [id]);

  // ---- Socket + WebRTC setup ----
  useEffect(() => {
    if (socket && connected) {
      socket.emit("join_room", id);

      const handleReceiveMsg = (msg) => {
        setMessages((prev) => [...prev, msg]);
      };
      socket.on("receive_message", handleReceiveMsg);

      // --- Call State Handlers ---
      socket.on("call_waiting", () => {
        setCallStatus("waiting");
        toast({ message: "Waiting for partner to join the call...", type: "info" });
      });

      socket.on("call_active", () => {
        setCallStatus("active");
        setCallSeconds(0);
        toast({ message: "Call active! Both users joined.", type: "success" });
      });

      socket.on("call_paused", (data) => {
        setCallStatus("idle");
        setTotalCallMinutes(data.actualCallMinutes);
        // Clear local media when partner leaves to reset state
        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => t.stop());
        }
        setCameraActive(false);
        setMicActive(false);
        toast({ message: "Partner left the call. Timer paused.", type: "warning" });
      });

      socket.on("call_duration_update", (data) => {
        setTotalCallMinutes(data.actualCallMinutes);
      });

      socket.on("session_completed", () => {
        setSession((prev) => prev ? { ...prev, status: "Completed" } : prev);
        toast({ message: "Session marked as complete!", type: "info" });
        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => t.stop());
        }
        setCameraActive(false);
        setMicActive(false);
        setCallStatus("idle");
      });

      // --- WebRTC Setup ---
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // When the peer connection needs to negotiate (e.g., track added)
      peerConnection.current.onnegotiationneeded = async () => {
        try {
          makingOffer.current = true;
          const offer = await peerConnection.current.createOffer();
          if (peerConnection.current.signalingState !== "stable") return; // Prevent setting local offer if interrupted by remote offer
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("webrtc_signal", { roomId: id, signal: peerConnection.current.localDescription });
        } catch (err) {
          if (err.name === "InvalidStateError") return; // Harmless collision
          console.error("Negotiation error:", err);
        } finally {
          makingOffer.current = false;
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_signal", { roomId: id, signal: { type: "candidate", candidate: event.candidate } });
        }
      };

      socket.on("webrtc_signal", async (data) => {
        const { signal } = data;
        if (!peerConnection.current) return;

        try {
          if (signal.type === "offer" || signal.type === "answer") {
            const offerCollision = signal.type === "offer" && (makingOffer.current || peerConnection.current.signalingState !== "stable");
            const polite = !isTeacherRef.current; // teacher is impolite, learner is polite
            ignoreOffer.current = !polite && offerCollision;

            if (ignoreOffer.current) return;

            if (offerCollision) {
              await peerConnection.current.setLocalDescription({ type: "rollback" });
            }

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
            
            if (signal.type === "offer") {
              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);
              socket.emit("webrtc_signal", { roomId: id, signal: peerConnection.current.localDescription });
            }
          } else if (signal.type === "candidate") {
            try {
              if (signal.candidate) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
              }
            } catch (e) {
              if (!ignoreOffer.current) console.error("Error adding ice candidate", e);
            }
          }
        } catch (err) {
          console.error("WebRTC Signaling Error:", err);
        }
      });

      return () => {
        socket.off("receive_message", handleReceiveMsg);
        socket.off("call_waiting");
        socket.off("call_active");
        socket.off("call_paused");
        socket.off("call_duration_update");
        socket.off("session_completed");
        socket.off("webrtc_signal");
        
        if (peerConnection.current) {
          peerConnection.current.close();
        }
        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => t.stop());
        }
      };
    }
  }, [socket, connected, id]);

  // Handle auto-leave on unmount if we were waiting/active
  const callStatusRef = useRef(callStatus);
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  useEffect(() => {
    return () => {
      if ((callStatusRef.current === "active" || callStatusRef.current === "waiting") && socket) {
        socket.emit("call_leave", { sessionId: id });
      }
    };
  }, [socket, id]);

  // ---- Auto scroll chat ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Call timer tick ----
  useEffect(() => {
    if (callStatus === "active") {
      callTimerRef.current = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callStatus]);

  // ---- Send message ----
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      roomId: id,
      message: inputMessage,
      senderId: user._id,
      senderName: user.name,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMsg);
    setInputMessage("");
  };

  // ---- Media helpers ----
  const getMediaStream = async () => {
    if (localStream.current) return localStream.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      
      // Ensure we clear existing tracks before adding
      const senders = peerConnection.current.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find(s => s.track?.kind === track.kind);
        if (sender) sender.replaceTrack(track);
        else peerConnection.current.addTrack(track, stream);
      });
      return stream;
    } catch (err) {
      toast({ message: "Camera/Mic access denied or unavailable.", type: "error",err });
      return null;
    }
  };

  const joinCall = useCallback(async () => {
    const stream = await getMediaStream();
    if (!stream) return;
    
    stream.getVideoTracks().forEach((t) => (t.enabled = true));
    stream.getAudioTracks().forEach((t) => (t.enabled = true));
    setCameraActive(true);
    setMicActive(true);
    
    // Signal readiness to the server
    socket?.emit("call_ready", { sessionId: id });
  }, [socket, id]);

  const leaveCall = useCallback(() => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
    }
    setCameraActive(false);
    setMicActive(false);
    setCallStatus("idle");
    socket?.emit("call_leave", { sessionId: id });
    if (callStatus === "active") {
      toast({ message: `Call ended. Duration: ${formatTimer(callSeconds)}`, type: "info" });
    }
  }, [socket, id, callStatus, callSeconds]);

  const toggleCamera = async () => {
    const stream = localStream.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !cameraActive;
      setCameraActive(!cameraActive);
    }
  };

  const toggleMic = async () => {
    const stream = localStream.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !micActive;
      setMicActive(!micActive);
    }
  };

  // ---- Complete session ----
  const handleComplete = async () => {
    if (!confirm("Mark this session as complete? Credits will be calculated based on call duration.")) return;
    setCompleting(true);
    try {
      const r = await sessionService.complete(id);
      toast({ message: `Session complete! Teacher earned ${r.data.earned} credits (${r.data.actualMinutes} min call).`, type: "success" });
      setSession((prev) => ({ ...prev, status: "Completed" }));
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to complete session.", type: "error" });
    } finally {
      setCompleting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ message: "Please select a rating.", type: "error" });
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.create({
        sessionId: id,
        rating,
        comment: reviewComment,
      });
      toast({ message: "Review submitted successfully!", type: "success" });
      setHasReviewed(true);
    } catch (err) {
      if (err.response?.status === 409) {
        toast({ message: "You have already reviewed this session.", type: "warning" });
        setHasReviewed(true);
      } else {

        toast({ message: err.response?.data?.message || "Failed to submit review.", type: "error" });
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const partner = isTeacher ? session?.learner : session?.teacher;

  return (
    <div className="bg-[#0A0A0A] h-screen w-full flex flex-col font-mono text-gray-100 overflow-hidden">
      <NavBar />
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 lg:pl-28 gap-6 h-[calc(100vh-80px)]">

        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          <header className="flex justify-between items-center bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
            <div>
              <p className="text-[10px] text-[#4F86C6] uppercase font-black tracking-widest">
                Learning Room {session?.requestedSkill ? `· ${session.requestedSkill}` : ""}
              </p>
              <h2 className="text-xl font-black">
                {partner?.name ? `with ${partner.name}` : `Session: ${id.slice(-6).toUpperCase()}`}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Call states */}
              {callStatus === "waiting" && (
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl animate-pulse">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-amber-400 text-xs font-black">Waiting for partner...</span>
                </div>
              )}
              {callStatus === "active" && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-xl animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-400 text-sm font-black tabular-nums">{formatTimer(callSeconds)}</span>
                </div>
              )}
              {totalCallMinutes > 0 && callStatus !== "active" && (
                <span className="text-[10px] text-gray-500 font-bold">{totalCallMinutes} min logged</span>
              )}

              {/* Complete button (teacher only) */}
              {isTeacher && session?.status === "Confirmed" && (
                <button
                  onClick={handleComplete}
                  disabled={completing || callStatus !== "idle"}
                  className="text-[10px] font-black bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-all disabled:opacity-50"
                  title={callStatus !== "idle" ? "End call first" : ""}
                >
                  {completing ? "..." : "✓ Mark Complete"}
                </button>
              )}
              <Link to="/sessions" className="px-4 py-2 bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl text-xs font-black transition-all">
                Leave Room
              </Link>
            </div>
          </header>

          {session?.status === "Completed" ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#111] border border-[#4F86C6]/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F86C6]/10 to-[#FF7849]/10 z-0" />
              <div className="z-10 w-full max-w-md bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-md text-center shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-2">Session Completed!</h2>
                <p className="text-sm text-gray-400 mb-6">How was your session with {partner?.name}?</p>
                
                {hasReviewed ? (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 flex items-center justify-center rounded-full text-3xl mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">✓</div>
                    <p className="text-gray-200 font-bold text-lg">Thank you for your feedback!</p>
                    <Link to="/sessions" className="mt-4 px-6 py-3 bg-[#4F86C6] text-white rounded-xl font-black hover:bg-[#6a9fd4] transition-all shadow-lg shadow-[#4F86C6]/20 w-full">
                      Return to Sessions
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-4xl transition-all focus:outline-none focus:scale-110 active:scale-95"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <span className={star <= (hoverRating || rating) ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "text-gray-600 hover:text-gray-500"}>★</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write a brief review (optional)..."
                      className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#4F86C6]/50 transition-all outline-none resize-none h-28 placeholder:text-gray-600"
                      maxLength={500}
                    />
                    <div className="flex gap-3">
                      <Link to="/sessions" className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-black hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
                        Skip
                      </Link>
                      <button
                        type="submit"
                        disabled={submittingReview || rating === 0}
                        className="flex-1 py-3 bg-[#4F86C6] text-white rounded-xl font-black hover:bg-[#6a9fd4] transition-all disabled:opacity-50 shadow-lg shadow-[#4F86C6]/20 flex items-center justify-center"
                      >
                        {submittingReview ? "..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Local Video */}
            <div className={`relative bg-[#161616] border transition-all duration-500 rounded-3xl overflow-hidden flex flex-col items-center justify-center ${callStatus === 'active' ? 'border-[#4F86C6]/50 shadow-[0_0_30px_rgba(79,134,198,0.15)]' : 'border-white/10'}`}>
              <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${cameraActive ? "opacity-100" : "opacity-0 absolute"}`} />
              {!cameraActive && (
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl text-gray-600 font-black uppercase">
                  {user?.name?.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold shadow-lg">You ({user?.name})</span>
                <div className="flex gap-2">
                  {callStatus === "idle" ? (
                    <button
                      onClick={joinCall}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black hover:bg-green-400 transition-all flex items-center gap-1 shadow-lg shadow-green-500/20"
                    >
                      📞 Join Call
                    </button>
                  ) : (
                    <>
                      <button onClick={toggleMic} className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${micActive ? "bg-white/20 text-white hover:bg-white/30" : "bg-red-500/80 text-white hover:bg-red-500/90"}`}>
                        {micActive ? "🎙️" : "🔇"}
                      </button>
                      <button onClick={toggleCamera} className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${cameraActive ? "bg-white/20 text-white hover:bg-white/30" : "bg-red-500/80 text-white hover:bg-red-500/90"}`}>
                        {cameraActive ? "📷" : "🚫"}
                      </button>
                      <button
                        onClick={leaveCall}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"
                      >
                        Leave
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Remote Video */}
            <div className={`relative bg-[#111] border transition-all duration-500 rounded-3xl overflow-hidden flex flex-col items-center justify-center ${callStatus === 'active' ? 'border-[#4F86C6]/50 shadow-[0_0_30px_rgba(79,134,198,0.15)]' : 'border-white/5'}`}>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1] absolute inset-0 z-20 bg-[#111]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F86C6]/5 to-[#FF7849]/5 z-0" />
              
              <div className="text-center z-10 pointer-events-none relative">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-black mb-4 transition-colors ${callStatus === 'active' ? 'bg-[#4F86C6]/20 text-[#4F86C6]' : 'bg-white/5 text-gray-700'}`}>
                  {partner?.name?.charAt(0) || "?"}
                </div>
                {callStatus === "idle" && (
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    Partner is offline
                  </p>
                )}
                {callStatus === "waiting" && (
                   <div className="flex flex-col items-center gap-2">
                     <div className="flex gap-1">
                       <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: "0ms"}}/>
                       <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: "150ms"}}/>
                       <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: "300ms"}}/>
                     </div>
                     <p className="text-xs text-[#4F86C6] uppercase tracking-widest font-bold">
                       Waiting for {partner?.name || "partner"}...
                     </p>
                   </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 z-30">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-400">
                  {partner?.name || "Partner"} {callStatus === "active" && <span className="text-green-400 ml-1">•</span>}
                </span>
              </div>
            </div>

            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="w-full lg:w-[380px] bg-white/5 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 bg-black/20">
            <h3 className="text-sm font-black uppercase tracking-widest">Room Chat</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              <p className="text-[10px] text-gray-500 uppercase">{connected ? "Connected" : "Reconnecting..."}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-600 text-xs italic py-8">No messages yet. Say hello!</p>
            ) : (
              messages.map((m, i) => {
                const isMe = m.senderId === user?._id || m.sender === user?._id;
                return (
                  <div key={m._id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] text-gray-500 mb-1">{m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${isMe ? "bg-[#4F86C6] text-white rounded-tr-sm" : "bg-white/10 text-gray-200 rounded-tl-sm"}`}>
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-[#4F86C6]/50 placeholder:text-gray-600"
              />
              <button type="submit" disabled={!inputMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#4F86C6] text-white rounded-lg disabled:opacity-30 hover:bg-[#6a9fd4] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}

