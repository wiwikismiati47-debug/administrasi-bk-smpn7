import React, { useState, useEffect } from 'react';
import { SupabaseConfig } from '../types';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfigToStorage,
  getSupabaseClient,
  getSupabaseSqlSetup,
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
  ExternalLink,
  Sparkles,
  Terminal
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
      const client = getSupabaseClient(config);
      if (!client) {
        throw new Error('Gagal inisialisasi client Supabase.');
      }

      // Test simple select on table
      const { data, error } = await client
        .from(config.tableName)
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          setTestStatus({
            tested: true,
            success: false,
            message: `Koneksi berhasil! Namun tabel "${config.tableName}" belum dibuat di Supabase. Silakan jalankan script SQL di bawah ini pada SQL Editor Supabase Anda.`,
          });
        } else {
          setTestStatus({
            tested: true,
            success: false,
            message: `Error Supabase: ${error.message}`,
          });
        }
      } else {
        setTestStatus({
          tested: true,
          success: true,
          message: `Koneksi ke Supabase & Tabel "${config.tableName}" berhasil terhubung!`,
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
              <p className="text-xs text-slate-500">
                ADMINISTRASI BK SMPN 7 PASURAN
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
              Akses Publik Tanpa Login (Sesuai Permintaan)
            </p>
            <p className="leading-relaxed">
              Aplikasi ini dikonfigurasi agar siapapun dapat membuka form, menyimpan, dan memperbarui data tanpa harus registrasi/login terlebih dahulu.
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
              NAMA TABEL DATABASE
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
            <div className="leading-relaxed">{testStatus.message}</div>
          </div>
        )}

        {/* SQL Setup Script Helper */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Terminal className="w-4 h-4" />
              Script SQL Pembuatan Tabel Supabase
            </span>

            <button
              onClick={copySqlToClipboard}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Script'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Salin script SQL ini lalu jalankan di Supabase Studio menu <strong>SQL Editor</strong> untuk membuat tabel dan membuka akses publik.
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
              {isTesting ? 'Menguji...' : 'Uji Koneksi'}
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
