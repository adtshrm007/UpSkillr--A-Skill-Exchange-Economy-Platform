import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";
import { coursesService } from "../services/courses.service.js";

export default function CourseCreatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "", creditCost: 50 });
  const [creating, setCreating] = useState(false);

  // Lesson state
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lessonData, setLessonData] = useState({ lessonName: "", videoUrl: "", lessonNotes: "", practiceSheetUrl: "" });
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await coursesService.getMyCreated();
      setCourses(res.data.courses || []);
    } catch (e) {
      toast({ message: "Failed to load courses.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await coursesService.create(formData);
      toast({ message: "Course created successfully!", type: "success" });
      setShowCreateForm(false);
      setFormData({ title: "", description: "", category: "", creditCost: 50 });
      fetchCourses();
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to create.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await coursesService.delete(id);
      toast({ message: "Course deleted.", type: "success" });
      fetchCourses();
    } catch (e) {
      toast({ message: "Failed to delete.", type: "error" });
    }
  };

  const handleAddLesson = async (e, courseId) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      await coursesService.addLesson(courseId, lessonData);
      toast({ message: "Lesson added!", type: "success" });
      setActiveCourseId(null);
      setLessonData({ lessonName: "", videoUrl: "", lessonNotes: "", practiceSheetUrl: "" });
      fetchCourses();
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to add lesson.", type: "error" });
    } finally {
      setAddingLesson(false);
    }
  };

  if (user?.skillCredits < 1000) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6 text-center font-mono">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#FF7849] mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8 max-w-md">You need at least 1,000 credits to become a Course Creator. Keep teaching sessions to earn more credits!</p>
        <Link to="/dashboard" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold uppercase transition-all">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-100 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-6 lg:p-12 lg:pl-36 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] text-[#FF7849] font-black uppercase tracking-[0.3em] mb-1">Creator Hub</p>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight uppercase">Your <span className="text-[#FF7849]">Courses</span></h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-[#FF7849] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#ff8f63] transition-all"
            >
              {showCreateForm ? "Cancel" : "+ New Course"}
            </button>
          </header>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Courses</p>
              <p className="text-4xl font-black mt-2">{courses.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] text-[#4F86C6] font-bold uppercase tracking-widest">Total Enrollments</p>
              <p className="text-4xl font-black mt-2">{courses.reduce((acc, c) => acc + c.enrolledUsers.length, 0)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Total Earnings</p>
              <p className="text-4xl font-black mt-2">{courses.reduce((acc, c) => acc + (c.totalEarnings || 0), 0)} <span className="text-sm font-normal text-gray-500">Credits</span></p>
            </div>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateCourse} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#FF7849]">Create New Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Course Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7849]" />
                <input required placeholder="Category (e.g. React, UX Design)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7849]" />
              </div>
              <textarea required placeholder="Detailed Description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7849]" />
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Credit Cost</label>
                <input type="number" required min="10" value={formData.creditCost} onChange={e => setFormData({...formData, creditCost: e.target.value})} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7849]" />
              </div>
              <button disabled={creating} type="submit" className="px-8 py-3 bg-[#FF7849] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-80 transition-all disabled:opacity-50">
                {creating ? "Creating..." : "Publish Course"}
              </button>
            </form>
          )}

          {/* Courses List */}
          <div className="space-y-6">
            {loading ? (
              <p className="animate-pulse text-gray-500">Loading courses...</p>
            ) : courses.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/2">
                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">You haven't created any courses yet.</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course._id} className="bg-white/2 border border-white/5 hover:border-white/10 transition-all rounded-3xl p-6 lg:p-8 flex flex-col gap-6">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white font-bold uppercase tracking-widest">{course.category}</span>
                      <h3 className="text-2xl font-black mt-3">{course.title}</h3>
                      <p className="text-gray-400 mt-2 max-w-3xl line-clamp-2">{course.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                      <p className="text-xl font-black text-[#FF7849]">{course.creditCost} <span className="text-[10px] text-gray-500 uppercase tracking-widest">Credits</span></p>
                      <button onClick={() => handleDeleteCourse(course._id)} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Delete</button>
                    </div>
                  </div>

                  {/* Lessons section inside card */}
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs text-[#4F86C6] font-black uppercase tracking-widest">Lessons ({course.lessons.length})</h4>
                      <button 
                        onClick={() => setActiveCourseId(activeCourseId === course._id ? null : course._id)}
                        className="text-[10px] border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 uppercase font-bold"
                      >
                        {activeCourseId === course._id ? "Cancel" : "+ Add Lesson"}
                      </button>
                    </div>

                    {activeCourseId === course._id && (
                      <form onSubmit={(e) => handleAddLesson(e, course._id)} className="bg-black/30 p-5 rounded-2xl mb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required placeholder="Lesson Name" value={lessonData.lessonName} onChange={e => setLessonData({...lessonData, lessonName: e.target.value})} className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F86C6]" />
                          <input required placeholder="Video URL (e.g. YouTube/Vimeo)" value={lessonData.videoUrl} onChange={e => setLessonData({...lessonData, videoUrl: e.target.value})} className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F86C6]" />
                        </div>
                        <input placeholder="Practice Sheet/Notes URL (Optional)" value={lessonData.practiceSheetUrl} onChange={e => setLessonData({...lessonData, practiceSheetUrl: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F86C6]" />
                        <button disabled={addingLesson} className="px-6 py-2 bg-[#4F86C6] text-white text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-50">
                          {addingLesson ? "Adding..." : "Save Lesson"}
                        </button>
                      </form>
                    )}

                    {course.lessons.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.lessons.map(l => (
                          <div key={l._id} className="bg-[#111] border border-white/5 p-4 rounded-2xl">
                            <p className="text-sm font-black mb-1 truncate">{l.lessonName}</p>
                            <a href={l.videoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#4F86C6] hover:underline break-all block truncate">Video Link</a>
                            {l.practiceSheetUrl && <a href={l.practiceSheetUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 hover:underline mt-1 block truncate">Resources</a>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
