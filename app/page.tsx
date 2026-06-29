"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [form, setForm] = useState({
    jina: "",
    jinsia: "ME",
    umri: "",
    kazi: "",
    simu: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error: insertError } = await supabase.from("candidates").insert([
      {
        jina: form.jina,
        jinsia: form.jinsia,
        umri: Number(form.umri),
        kazi: form.kazi,
        simu: form.simu,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
    setForm({ jina: "", jinsia: "ME", umri: "", kazi: "", simu: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-4 text-center shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Zoezi la Ukusanyaji Taarifa za Vijana
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base">
            KANISA LA EFATHA &mdash; KITUO: EFATHA KIGAMBONI
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-200/50 border border-white/60 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Fomu ya Usajili
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Jaza taarifa zako hapa chini
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jina kamili
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  placeholder="Mfano: Juma Mohamed"
                  value={form.jina}
                  onChange={(e) => update("jina", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jinsia
                </label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  value={form.jinsia}
                  onChange={(e) => update("jinsia", e.target.value)}
                >
                  <option value="ME">ME (Mwanaume)</option>
                  <option value="KE">KE (Mwanamke)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Umri
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    placeholder="Mfano: 20"
                    value={form.umri}
                    onChange={(e) => update("umri", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kazi
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    placeholder="Mfano: Mwanafunzi"
                    value={form.kazi}
                    onChange={(e) => update("kazi", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Namba ya simu
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  placeholder="Mfano: 07XX XXX XXX"
                  value={form.simu}
                  onChange={(e) => update("simu", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 text-sm transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300/40 active:scale-[0.98]"
              >
                Tuma
              </button>
            </form>

{submitted && (
               <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium animate-slide-up-sm">
                 ✓ Usajili umefanikiwa!
               </div>
             )}

             {error && (
               <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm font-medium animate-slide-up-sm">
                 ✗ Hitilafu: {error}
               </div>
             )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-white/30">
        Kanisa la Efatha &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
