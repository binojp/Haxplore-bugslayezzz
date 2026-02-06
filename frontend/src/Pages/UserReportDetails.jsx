import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  MessageCircle
} from "lucide-react";

export default function UserReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, token]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "reported":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
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
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Incident Report #{report._id.slice(-6)}</p>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 line-clamp-1">
                {report.title}
              </h1>
           </div>
           <div className="flex gap-2">
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border flex items-center gap-2 ${getStatusColor(report.status)}`}>
                 {getStatusIcon(report.status)} {report.status}
              </span>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border flex items-center gap-2 ${getPriorityColor(report.severity)}`}>
                 {report.severity} Priority
              </span>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Main Details */}
         <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <AlertCircle className="text-emerald-400" size={20}/> Description
               </h3>
               <p className="text-gray-300 leading-relaxed text-sm">
                  {report.description}
               </p>
               
               <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Type</p>
                     <p className="text-white font-bold">{report.type}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date Reported</p>
                     <p className="text-white font-bold flex items-center gap-2">
                       <Calendar size={14} className="text-gray-400"/>
                       {new Date(report.createdAt).toLocaleDateString()}
                     </p>
                  </div>
                  <div className="col-span-2 p-3 bg-white/5 rounded-xl">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Location</p>
                     <p className="text-white font-bold flex items-center gap-2">
                       <MapPin size={14} className="text-emerald-400"/>
                       {report.location || `${report.latitude}, ${report.longitude}`}
                     </p>
                  </div>
               </div>
            </div>

            {/* Evidence Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <ImageIcon className="text-blue-400" size={20}/> Evidence
               </h3>
               <div className="grid grid-cols-2 gap-3">
                 {report.mediaUrls.map((url, index) => (
                   <div key={index} className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${url}`}
                        alt="Evidence"
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Sidebar / Replies */}
         <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <MessageCircle className="text-amber-400" size={20}/> Updates
               </h3>
               <div className="space-y-6 relative ml-2">
                  <div className="absolute left-[-5px] top-2 bottom-2 w-[2px] bg-white/10" />
                  
                  {report.replies?.length ? (
                    report.replies.map((reply, index) => (
                      <div key={index} className="relative pl-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                         <div className="absolute left-[-9px] top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                         
                         <div className="mb-2">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mb-1">
                               {reply.type} Update
                            </span>
                            <p className="text-[10px] text-gray-500">
                               {new Date(reply.uploadedAt).toLocaleString()}
                            </p>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-2 mt-2">
                            {reply.mediaUrls.map((url, idx) => (
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
                    <div className="pl-6 text-gray-500 text-sm italic">
                       No updates from admin yet. We are reviewing your report.
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
