import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { useToast } from "../context/Toast.context.jsx";

export default function LearningRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const { toast } = useToast();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  // Camera simulation
  const localVideoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    if (socket && connected) {
      socket.emit("join_room", id);

      const handleReceiveMsg = (msg) => {
        setMessages((prev) => [...prev, msg]);
      };

      socket.on("receive_message", handleReceiveMsg);

      return () => {
        socket.off("receive_message", handleReceiveMsg);
      };
    }
  }, [socket, connected, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const toggleCamera = async () => {
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        toast({ message: "Camera access denied or unavailable.", type: "error" });
      }
    } else {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }
  };

  const toggleMic = async () => {
    if (!micActive) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicActive(true);
      } catch (err) {
        toast({ message: "Microphone access denied or unavailable.", type: "error" });
      }
    } else {
      setMicActive(false);
      // Actual mic cutting logic would be applied to the stream tracks
    }
  };

  return (
    <div className="bg-[#0A0A0A] h-screen w-full flex flex-col font-mono text-gray-100 overflow-hidden">
      <NavBar />
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 lg:pl-28 gap-6 h-[calc(100vh-80px)]">
        
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          <header className="flex justify-between items-center bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
            <div>
              <p className="text-[10px] text-[#4F86C6] uppercase font-black tracking-widest">Built-in Learning Room</p>
              <h2 className="text-xl font-black">Session: {id.slice(-6).toUpperCase()}</h2>
            </div>
            <Link to="/dashboard" className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black transition-all">
              Leave Room
            </Link>
          </header>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Local Video */}
            <div className="relative bg-[#161616] border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center">
              {cameraActive ? (
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl text-gray-600 font-black uppercase">
                  {user?.name?.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold shadow-lg">You ({user?.name})</span>
                <div className="flex gap-2">
                  <button onClick={toggleMic} className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${micActive ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}>
                    {micActive ? "🎙️" : "🔇"}
                  </button>
                  <button onClick={toggleCamera} className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${cameraActive ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}>
                    {cameraActive ? "📷" : "🚫"}
                  </button>
                </div>
              </div>
            </div>

            {/* Remote Video (Mock for now since full WebRTC signaling is complex for this prompt) */}
            <div className="relative bg-[#111] border border-white/5 rounded-3xl overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F86C6]/5 to-[#FF7849]/5" />
              <div className="text-center z-10 animate-pulse">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-2xl text-gray-700 font-black mb-4">
                  ?
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Waiting for partner...</p>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-400">Partner</span>
              </div>
            </div>

          </div>
        </div>

        {/* Chat Area */}
        <div className="w-full lg:w-[380px] bg-white/5 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 bg-black/20">
            <h3 className="text-sm font-black uppercase tracking-widest">Room Chat</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-[10px] text-gray-500 uppercase">{connected ? 'Connected' : 'Reconnecting...'}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => {
              const isMe = m.senderId === user?._id;
              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-gray-500 mb-1">{m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${isMe ? 'bg-[#4F86C6] text-white rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm'}`}>
                    {m.message}
                  </div>
                </div>
              );
            })}
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
