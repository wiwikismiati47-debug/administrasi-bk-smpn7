import React, { useMemo } from 'react';
import { AgendaKerja } from '../types';
import { BarChart3, CheckCircle2, Users, Calendar, Sparkles } from 'lucide-react';

interface StatistikRekapProps {
  items: AgendaKerja[];
}

export const StatistikRekap: React.FC<StatistikRekapProps> = ({ items }) => {
  const totalAgenda = items.length;

  const targetStats = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const s = item.sasaran || 'Lainnya';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const monthStats = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const m = item.bulan || 'Tidak Ada';
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts);
  }, [items]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400 text-slate-950 rounded-lg font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">REKAP & STATISTIK AGENDA BK</h3>
            <p className="text-xs text-blue-200">
              Ringkasan Kinerja Bimbingan Konseling • SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold">
          {totalAgenda} Total Laporan
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Metric Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-blue-600 text-white rounded-xl shadow-md">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
              Total Agenda Kerja
            </p>
            <h4 className="text-3xl font-extrabold text-blue-950 mt-0.5">
              {totalAgenda} <span className="text-sm font-normal text-slate-600">kegiatan</span>
            </h4>
            <p className="text-[11px] text-blue-700 mt-1">Tercatat di sistem administrasi BK</p>
          </div>
        </div>

        {/* Sasaran Breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 md:col-span-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Distribusi Sasaran Layanan BK</span>
          </h4>

          {targetStats.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada data sasaran.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {targetStats.slice(0, 6).map(([sasaran, count]) => {
                const percent = totalAgenda > 0 ? Math.round((count / totalAgenda) * 100) : 0;
                return (
                  <div key={sasaran} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate max-w-[180px]">{sasaran}</span>
                      <span className="text-blue-700 font-bold">{count} x ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
