import React, { useState, useEffect } from 'react';
import { SupabaseConfig } from '../types';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfigToStorage,
  getSupabaseSqlSetup,
  testAllSupabaseTables,
  SupabaseTableTestResult,
  DEFAULT_TABLE_NAME
} from '../lib/supabase';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  RefreshCw,
  Server
} from 'lucide-react';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<SupabaseConfig>({
    url: '',
    anonKey: '',
    tableName: DEFAULT_TABLE_NAME,
  });

  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: SupabaseTableTestResult[];
  }>({ tested: false, success: false, message: '' });

  const [copiedSql, setCopiedSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedSupabaseConfig();
      setConfig(saved);
      setTestStatus({ tested: false, success: false, message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!config.url || !config.anonKey) {
      setTestStatus({
        tested: true,
        success: false,
        message: 'Mohon isi URL Supabase dan Anon Key terlebih dahulu.',
      });
      return;
    }

    setIsTesting(true);
    setTestStatus({ tested: false, success: false, message: '' });

    try {
      const testRes = await testAllSupabaseTables(config);

      if (!testRes.connected && testRes.error) {
        setTestStatus({
          tested: true,
          success: false,
          message: `Gagal terhubung ke Supabase: ${testRes.error}`,
          details: testRes.tables
        });
      } else if (testRes.missingCount === 0) {
        setTestStatus({
          tested: true,
          success: true,
          message: `Sukses! Semua ${testRes.totalTables} tabel database BK terhubung sempurna dan siap digunakan di Supabase.`,
          details: testRes.tables
        });
      } else {
        setTestStatus({
          tested: true,
          success: false,
          message: `Terhubung (${testRes.existingCount}/${testRes.totalTables} tabel), namun ${testRes.missingCount} tabel belum dibuat di Supabase (${testRes.missingTableNames.join(', ')}). Silakan salin & jalankan Script SQL di bawah ini pada SQL Editor Supabase Anda.`,
          details: testRes.tables
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung';
      setTestStatus({
        tested: true,
        success: false,
        message: `Gagal terhubung: ${msg}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveSupabaseConfigToStorage(config);
    onConfigSaved();
    alert('Konfigurasi Supabase berhasil disimpan!');
    onClose();
  };

  const handleClear = () => {
    saveSupabaseConfigToStorage({ url: '', anonKey: '', tableName: DEFAULT_TABLE_NAME });
    setConfig({ url: '', anonKey: '', tableName: DEFAULT_TABLE_NAME });
    onConfigSaved();
    setTestStatus({
      tested: true,
      success: true,
      message: 'Konfigurasi kustom dibersihkan. Kembali menggunakan Database Supabase bawaan (default).',
    });
  };

  const copySqlToClipboard = () => {
    const sql = getSupabaseSqlSetup(config.tableName || DEFAULT_TABLE_NAME);
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-6 my-8 border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Konfigurasi Database Supabase
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                SABDA BK SPANJU - SMPN 7 PASURUAN
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-emerald-950">
              Akses Publik & Real-Time Aktif
            </p>
            <p className="leading-relaxed">
              Aplikasi ini dikonfigurasi agar data tersinkronisasi secara real-time ke Supabase tanpa memerlukan login rumit.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SUPABASE PROJECT URL
            </label>
            <input
              type="text"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SUPABASE ANON KEY (PUBLIC)
            </label>
            <input
              type="password"
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              NAMA TABEL UTAMA AGENDA
            </label>
            <input
              type="text"
              value={config.tableName}
              onChange={(e) => setConfig({ ...config, tableName: e.target.value.trim() })}
              placeholder="agenda_kerja_bk"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Test Result Message */}
        {testStatus.tested && (
          <div className="space-y-3">
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 border ${
                testStatus.success
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed font-medium">{testStatus.message}</div>
            </div>

            {/* Detailed Table Status Matrix */}
            {testStatus.details && testStatus.details.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs">
                <div className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  Status 11 Tabel Database di Supabase:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testStatus.details.map((t) => (
                    <div
                      key={t.tableName}
                      className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                        t.exists
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold">{t.title}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">({t.tableName})</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          t.exists ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {t.exists ? (
                          <>
                            <Check className="w-3 h-3" /> Ada
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Belum
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SQL Setup Script Helper */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Terminal className="w-4 h-4" />
              Script SQL Pembuatan Seluruh Tabel Supabase
            </span>

            <button
              onClick={copySqlToClipboard}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Script'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Jika ada tabel yang berstatus <strong>&quot;Belum&quot;</strong>, klik <strong>Salin SQL Script</strong> di atas, lalu buka <strong>Supabase Dashboard &rarr; SQL Editor &rarr; New Query &rarr; Paste &rarr; Run</strong>.
          </p>

          <pre className="text-[11px] bg-slate-950 p-3 rounded-lg overflow-x-auto text-emerald-400 font-mono border border-slate-800 max-h-40">
            {getSupabaseSqlSetup(config.tableName || DEFAULT_TABLE_NAME)}
          </pre>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <button
            onClick={handleClear}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Bersihkan Konfigurasi
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Menguji 11 Tabel...
                </>
              ) : (
                'Uji Koneksi 11 Tabel'
              )}
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow transition-colors inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

