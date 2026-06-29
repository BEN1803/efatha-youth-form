"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      fetchData();
    };

    checkUser();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setData(data || []);

    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const total = data.length;
  const me = data.filter((d) => d.jinsia === "ME").length;
  const ke = data.filter((d) => d.jinsia === "KE").length;

  const avgAge =
    data.reduce((sum, d) => sum + (d.umri || 0), 0) / (data.length || 1);

  const ageGroups = [
    { name: "15-25", value: data.filter(d => d.umri >= 15 && d.umri <= 25).length },
    { name: "26-36", value: data.filter(d => d.umri >= 26 && d.umri <= 36).length },
    { name: "37-45", value: data.filter(d => d.umri >= 37 && d.umri <= 45).length },
  ];

  const genderData = [
    { name: "ME (Wanaume)", value: me },
    { name: "KE (Wanawake)", value: ke },
  ];

  const COLORS = ["#3b82f6", "#ec4899"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-indigo-50/50 backdrop-blur-sm"></div>
        </div>
        <p className="text-sm font-semibold text-slate-600 tracking-wide animate-pulse">Inapakia Dashibodi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 selection:bg-indigo-500 selection:text-white animate-fade-in">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="animate-slide-up">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Efatha Youth Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">
              KITUO: EFATHA KIGAMBONI &bull; Ukusanyaji wa Taarifa
            </p>
          </div>
          
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span className="hidden xs:inline">Ondoka</span>
          </button>
        </div>
      </header>

<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Takwimu ya Vijana
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Data zilizokusanywa kutoka waliwasilisha fomu</p>
          </div>
          <a
            href="/api/pdf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.97]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3" />
            </svg>
            Pakua PDF
          </a>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { label: "Jumla ya Vijana", value: total, unit: "waliosajiliwa", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", color: "text-blue-600 bg-blue-50" },
            { label: "Wanaume (ME)", value: me, unit: "vijana", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m18c-2.485 0-4.5-4.03-4.5-9S19.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.738.09-1.454.257-2.147", color: "text-indigo-600 bg-indigo-50" },
            { label: "Wanawake (KE)", value: ke, unit: "vijana", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", color: "text-pink-600 bg-pink-50" },
            { label: "Wastani wa Umri", value: avgAge.toFixed(1), unit: "miaka", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600 bg-emerald-50" },
          ].map((card, i) => (
            <div key={i} className="animate-slide-up-sm bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 truncate">{card.label}</span>
                <div className={`p-2 rounded-lg shrink-0 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">{card.value}</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Pie Chart */}
          <div className="animate-slide-up bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-sm" style={{ animationDelay: "200ms" }}>
            <div>
              <h2 className="text-base font-bold text-slate-900">Mgawanyo wa Jinsia</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ulinganisho kati ya ME na KE</p>
            </div>
            <div className="h-56 sm:h-64 my-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    strokeWidth={0}
                  >
                    {genderData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 border-t border-slate-100 pt-4">
              {genderData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }} />
                  <span>{entry.name.split(" ")[0]}: <strong className="text-slate-900">{entry.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="animate-slide-up bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-sm" style={{ animationDelay: "250ms" }}>
            <div>
              <h2 className="text-base font-bold text-slate-900">Makundi ya Umri</h2>
              <p className="text-xs text-slate-400 mt-0.5">Mtawanyiko wa umri wa vijana waliosajiliwa</p>
            </div>
            <div className="h-56 sm:h-64 my-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroups} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc', radius: 8 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Idadi" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] sm:text-xs text-slate-400 font-medium border-t border-slate-100 pt-4">
              Vikundi vilivyoainishwa ki-umri (Miaka)
            </div>
          </div>
        </div>

        {/* Data Table / List Component */}
        <div className="animate-slide-up bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm" style={{ animationDelay: "300ms" }}>
          <div className="p-4 sm:p-5 lg:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Orodha ya Vijana Waliojisajili</h2>
              <p className="text-xs text-slate-400 mt-0.5">Orodha kamili ya taarifa zilizokusanywa hivi karibuni</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto">
              {data.length} Vijana waliorodheshwa
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-500">Hakuna taarifa bado</p>
              <p className="text-xs text-slate-400 mt-1">Mfumo hauna rekodi zilizopo kwa sasa.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Jina</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Jinsia</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Umri</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4">Kazi</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Simu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((d, idx) => (
                      <tr key={d.id} className="transition-colors duration-150 hover:bg-slate-50/50" style={{ animationDelay: `${idx * 25}ms` }}>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-900">{d.jina}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                            d.jinsia === "ME" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                          }`}>
                            {d.jinsia}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 font-medium">{d.umri}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 font-medium">{d.kazi || "—"}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 font-semibold text-right tracking-tight">{d.simu || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Cards instead of standard wide table */}
              <div className="md:hidden divide-y divide-slate-100">
                {data.map((d, idx) => (
                  <div key={d.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-all duration-200" style={{ animationDelay: `${idx * 25}ms` }}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{d.jina}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                        d.jinsia === "ME" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                      }`}>
                        {d.jinsia}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs text-slate-500 font-medium">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Umri</span>
                        <span className="text-slate-700 mt-0.5 block">{d.umri} miaka</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Kazi</span>
                        <span className="text-slate-700 mt-0.5 block truncate">{d.kazi || "—"}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Simu</span>
                        <span className="text-slate-700 mt-0.5 block font-semibold tracking-tight">{d.simu || "—"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}