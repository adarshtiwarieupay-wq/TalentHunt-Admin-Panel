"use client";

import { useState, useEffect } from "react";
import leaderboardData from "../data/leaderboard.json";
import qualifiersData from "../data/qualifiers.json";

function formatDuration(timeTakenStr?: string) {
  if (!timeTakenStr) return "-";
  return timeTakenStr;
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "-";
  return dateStr;
}

export default function AdminLeaderboard() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "qualifiers">("leaderboard");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentData = activeTab === "leaderboard" ? leaderboardData : qualifiersData;


  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">

      <div className="max-w-[1400px] w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="/comapnyLogo/FullLogo.png" alt="Company Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">European Pay <span className="text-[#0055A4]">Talent</span> Hunt</h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#EF4135] uppercase tracking-widest">Results Dashboard</h2>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setActiveTab("leaderboard")}
              className={`font-bold py-2 px-6 rounded-full shadow-sm transition-colors flex items-center gap-2 border-2 
                ${activeTab === "leaderboard" ? 'bg-[#0055A4] text-white border-[#0055A4]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              Overall Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab("qualifiers")}
              className={`font-bold py-2 px-6 rounded-full shadow-sm transition-colors flex items-center gap-2 border-2
                ${activeTab === "qualifiers" ? 'bg-[#EF4135] text-white border-[#EF4135]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              Round 1 Qualifiers
            </button>
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] xl:text-xs tracking-wider">
                  <th className="px-3 py-4 font-bold">Rank</th>
                  <th className="px-3 py-4 font-bold">Name</th>
                  <th className="px-3 py-4 font-bold">Country</th>
                  <th className="px-3 py-4 font-bold">Start Time</th>
                  <th className="px-3 py-4 font-bold">End Time</th>
                  <th className="px-3 py-4 font-bold">Time</th>
                  <th className="px-3 py-4 font-bold">Status</th>
                  <th className="px-3 py-4 font-bold">Fields/Niche</th>
                  <th className="px-3 py-4 font-bold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 font-bold text-lg">
                      No data available.
                    </td>
                  </tr>
                ) : (
                  currentData.map((candidate: any, idx: number) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-blue-50/30 transition-colors ${idx < 3 ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''}`}
                    >
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 
                            idx === 1 ? 'bg-gray-100 text-gray-700 border border-gray-300' : 
                            idx === 2 ? 'bg-orange-100 text-orange-800 border border-orange-300' : 
                            'text-gray-500'}
                        `}>
                          #{candidate.Rank || idx + 1}
                        </div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className="font-bold text-gray-900">{candidate.Name}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className="text-gray-500 text-sm">{candidate.Country || '-'}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className="text-gray-500 text-xs">{formatDateTime(candidate['Start Time'])}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className="text-gray-500 text-xs">{formatDateTime(candidate['End Time'])}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <div className="text-gray-500 text-sm font-medium">{formatDuration(candidate['Time Taken'])}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                          ${candidate.Status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                            candidate.Status === 'In Progress' ? 'bg-blue-50 text-[#0055A4] border-blue-200' : 
                            'bg-gray-100 text-gray-600 border-gray-200'}
                        `}>
                          {candidate.Status}
                        </span>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base max-w-[200px] break-words" title={candidate['Fields/Niche']}>
                        <div className="text-gray-500 text-sm break-words">{candidate['Fields/Niche'] || '-'}</div>
                      </td>
                      <td className="px-3 py-4 break-words whitespace-normal text-sm sm:text-base text-right">
                        <div className="font-black text-xl text-[#0055A4]">
                          {candidate.Score}
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
    </main>
  );
}
