"use client";

import { useEffect, useState } from "react";

interface CandidateResult {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  country: string;
  score: number;
  status: string;
}

export default function AdminLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Add Email Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addingEmail, setAddingEmail] = useState(false);
  const [addEmailError, setAddEmailError] = useState("");
  const [addEmailSuccess, setAddEmailSuccess] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingEmail(true);
    setAddEmailError("");
    setAddEmailSuccess(false);

    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to add email");
      }
      
      setAddEmailSuccess(true);
      setNewEmail("");
      
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        setShowAddModal(false);
        setAddEmailSuccess(false);
      }, 1500);
      
    } catch (err: any) {
      setAddEmailError(err.message);
    } finally {
      setAddingEmail(false);
    }
  };

  const exportToCSV = () => {
    if (leaderboard.length === 0) return;

    // Sort by score descending
    const sortedData = [...leaderboard].sort((a, b) => b.score - a.score);
    
    const headers = ["Rank,Name,Email,Contact No,Country,Status,Score"];
    const rows = sortedData.map((candidate, index) => 
      `${index + 1},"${candidate.name}","${candidate.email}","${candidate.contactNo || ''}","${candidate.country || ''}","${candidate.status}",${candidate.score}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leaderboard_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">


      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="/comapnyLogo/FullLogo.png" alt="Company Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">European Pay <span className="text-[#0055A4]">Talent</span> Hunt</h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#EF4135] uppercase tracking-widest">Admin Leaderboard</h2>
          <p className="text-gray-500 mt-4 text-sm font-mono">
            Auto-refreshing every 10s • Last updated: {isMounted ? lastUpdated.toLocaleTimeString() : "Loading..."}
          </p>
          
          <div className="mt-6 flex justify-center gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white border-2 border-[#0055A4] text-[#0055A4] hover:bg-blue-50 font-bold py-2 px-6 rounded-full shadow transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Authorized Email
            </button>
            <button 
              onClick={exportToCSV}
              disabled={leaderboard.length === 0}
              className="bg-[#0055A4] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full shadow transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#EF4135] px-4 py-3 rounded-xl mb-6 text-center font-bold shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-5 font-bold">Rank</th>
                  <th className="px-6 py-5 font-bold">Candidate Name</th>
                  <th className="px-6 py-5 font-bold">Email Address</th>
                  <th className="px-6 py-5 font-bold">Contact No</th>
                  <th className="px-6 py-5 font-bold">Country</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                  <th className="px-6 py-5 font-bold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-bold text-lg">
                      Loading Leaderboard...
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-bold text-lg">
                      No candidates have started the test yet.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((candidate, idx) => (
                    <tr 
                      key={candidate.id} 
                      className={`hover:bg-blue-50/30 transition-colors ${idx < 3 ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''}`}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 
                            idx === 1 ? 'bg-gray-100 text-gray-700 border border-gray-300' : 
                            idx === 2 ? 'bg-orange-100 text-orange-800 border border-orange-300' : 
                            'text-gray-500'}
                        `}>
                          #{idx + 1}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-gray-500 text-sm">{candidate.email}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-gray-500 text-sm">{candidate.contactNo || '-'}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-gray-500 text-sm">{candidate.country || '-'}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                          ${candidate.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                            candidate.status === 'In Progress' ? 'bg-blue-50 text-[#0055A4] border-blue-200' : 
                            'bg-gray-100 text-gray-600 border-gray-200'}
                        `}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="font-black text-xl text-[#0055A4]">
                          {candidate.score} <span className="text-sm font-normal text-gray-400">/ 40</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Email Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Authorized Email</h3>
            
            <form onSubmit={handleAddEmail} className="space-y-4">
              <div>
                <label htmlFor="newEmail" className="block text-sm font-bold text-gray-700 mb-2">Student Email Address</label>
                <input
                  id="newEmail"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/20 outline-none transition-all text-gray-900"
                  placeholder="student@example.com"
                />
              </div>

              {addEmailError && (
                <div className="text-[#EF4135] text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                  {addEmailError}
                </div>
              )}

              {addEmailSuccess && (
                <div className="text-green-700 text-sm font-bold bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email authorized successfully!
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingEmail}
                  className="flex-1 py-3 bg-[#0055A4] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  {addingEmail ? "Adding..." : "Add Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
