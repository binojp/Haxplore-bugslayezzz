import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  ArrowLeft,
  Briefcase,
  Calendar,
  Image as ImageIcon,
  MessageCircle,
  User,
  Shield,
  Send
} from "lucide-react";

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyType, setReplyType] = useState("before");
  const [files, setFiles] = useState([]);
  const [workers, setWorkers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const [reportRes, workersRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/collections/workers/all`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setReport(reportRes.data);
        setWorkers(workersRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleStatusUpdate = async (status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(response.data);
      alert(`Status updated to ${status}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAssignWorker = async (workerId) => {
    if (!workerId) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
        { assignedWorker: workerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(response.data);
      alert("Worker assigned successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign worker");
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      alert("Please select at least one file");
      return;
    }
    const formData = new FormData();
    formData.append("type", replyType);
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports/${id}/reply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setReport(response.data);
      setFiles([]);
      e.target.reset(); // Reset form
      alert("Reply images uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload reply");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "reported":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case "review":
        return <Clock className="w-4 h-4 text-purple-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "reported":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "review":
         return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-red-400 p-4">
       <AlertCircle className="mr-2"/> {error}
    </div>
  );

  if (!report) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-gray-400">
      Report not found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 pt-24 pb-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Incident Report #{report._id.slice(-6)}</p>
                 <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border flex items-center gap-1 ${getPriorityColor(report.severity)}`}>
                    {report.severity} Priority
                 </span>
              </div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {report.title}
              </h1>
           </div>
           
           {/* Quick Actions (Status) */}
           <div className="glass-panel p-2 rounded-xl border border-white/10 flex gap-2">
              {["Pending", "Review", "Resolved", "Rejected"].map((status) => (
               <button
                 key={status}
                 onClick={() => handleStatusUpdate(status)}
                 className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                   report.status === status
                     ? getStatusColor(status) + " shadow-lg"
                     : "text-gray-500 hover:bg-white/5"
                 }`}
               >
                 {status}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN - MAIN DETAILS */}
         <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            
            {/* Details Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
               
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                 <AlertCircle className="text-emerald-400" size={24}/> Incident Details
               </h3>
               
               <p className="text-gray-300 leading-relaxed text-lg mb-8">
                  {report.description}
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Type</p>
                     <p className="text-white font-bold text-lg">{report.type}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Waste Category</p>
                     <p className="text-white font-bold text-lg">{report.wasteType || "Mixed"}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Reported On</p>
                     <p className="text-white font-bold flex items-center gap-2">
                       <Calendar size={16} className="text-gray-400"/>
                       {new Date(report.createdAt).toLocaleDateString()}
                     </p>
                  </div>
                  <div className="col-span-2 md:col-span-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Location</p>
                     <p className="text-white font-bold flex items-center gap-2">
                       <MapPin size={18} className="text-emerald-400"/>
                       {report.location || `${report.latitude}, ${report.longitude}`}
                     </p>
                  </div>
               </div>

               {report.user && (
                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/10">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                        {report.user.name?.charAt(0) || "U"}
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Reported By</p>
                        <p className="text-white font-bold">{report.user.name || report.user.email}</p>
                     </div>
                  </div>
               )}
            </div>

            {/* Evidence Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                 <ImageIcon className="text-blue-400" size={24}/> Visual Evidence
               </h3>
               {report.mediaUrls?.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {report.mediaUrls.map((url, index) => (
                     <div key={index} className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/30 aspect-square">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${url}`}
                          alt="Evidence"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                           <a href={`${import.meta.env.VITE_API_URL}${url}`} target="_blank" rel="noreferrer" className="text-xs text-white underline">View Full</a>
                        </div>
                     </div>
                   ))}
                   {report.photoVerified && (
                      <div className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                         <Shield className="w-8 h-8 text-emerald-400 mb-2"/>
                         <p className="text-emerald-400 font-bold text-sm">AI Verified</p>
                         <p className="text-[10px] text-emerald-300/60">Content validated</p>
                      </div>
                   )}
                 </div>
               ) : (
                  <p className="text-gray-500 italic">No media provided.</p>
               )}
            </div>
         </div>

         {/* RIGHT COLUMN - ACTIONS & UPDATES */}
         <div className="space-y-8 animate-fade-in-up delay-100">
            
            {/* Assign Worker Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 group hover:border-emerald-500/30 transition-all">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Briefcase className="text-amber-400" size={20}/> Field Operations
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Assign Worker</label>
                    <div className="relative">
                       <select
                         value={report.assignedWorker?._id || ""}
                         onChange={(e) => handleAssignWorker(e.target.value)}
                         className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none appearance-none"
                       >
                         <option value="">Select Field Agent...</option>
                         {workers.map((worker) => (
                           <option key={worker._id} value={worker._id}>
                             {worker.name || worker.email} {worker.status === 'busy' ? '(Busy)' : '(Available)'}
                           </option>
                         ))}
                       </select>
                       <User size={16} className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {report.assignedWorker ? (
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                          {report.assignedWorker.name?.charAt(0) || "W"}
                       </div>
                       <div>
                          <p className="text-xs text-emerald-400 font-bold uppercase">Currently Assigned</p>
                          <p className="text-white font-bold text-sm">{report.assignedWorker.name || "Worker"}</p>
                       </div>
                    </div>
                  ) : (
                     <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400 text-xs font-bold text-center">
                        ⚠️ No worker assigned yet
                     </div>
                  )}
               </div>
            </div>

            {/* Updates & Replies */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <MessageCircle className="text-pink-400" size={20}/> Status Updates
               </h3>

               {/* Upload Form */}
               <form onSubmit={handleReplySubmit} className="mb-8 space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold text-gray-400 uppercase">Post Update</p>
                  <div className="flex gap-2">
                     <select
                        value={replyType}
                        onChange={(e) => setReplyType(e.target.value)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-2 text-xs text-white focus:outline-none"
                     >
                        <option value="before">Before Fix</option>
                        <option value="after">After Fix</option>
                     </select>
                     <div className="relative flex-1">
                        <input
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full bg-slate-800 border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-400 flex items-center justify-between">
                           <span>{files.length} files selected</span>
                           <Upload size={12}/>
                        </div>
                     </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg text-xs hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={12}/> Upload Update
                  </button>
               </form>

               {/* Timeline */}
               <div className="space-y-6 relative ml-3">
                  <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-white/10" />
                  
                  {report.replies?.length ? (
                    report.replies.map((reply, index) => (
                      <div key={index} className="relative pl-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                         <div className={`absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f172a] ${reply.type === 'after' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                         
                         <div className="mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${reply.type === 'after' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                               {reply.type} Work
                            </span>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                               {new Date(reply.uploadedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                               Uploaded by <span className="text-white font-bold">{reply.uploadedBy?.name || "Admin"}</span>
                            </p>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-2 mt-2">
                            {reply.mediaUrls?.map((url, idx) => (
                              <img
                                key={idx}
                                src={`${import.meta.env.VITE_API_URL}${url}`}
                                alt="Update media"
                                className="w-full h-20 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-emerald-500/50 transition-colors"
                              />
                            ))}
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-6 text-gray-500 text-sm italic py-4">
                       No updates posted yet.
                    </div>
                  )}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
