import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { fetchSignature, saveSignature } from '../lib/signatures';
import { X, Save, Edit3, Trash2 } from 'lucide-react';

interface SignatureBoxProps {
  recordId: string;
  role: string;
  className?: string;
  placeholder?: string;
}

export const SignatureBox: React.FC<SignatureBoxProps> = ({ recordId, role, className = '', placeholder = "Klik untuk TTD" }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    let mounted = true;
    if (!recordId) {
       setIsLoading(false);
       return;
    }
    
    setIsLoading(true);
    fetchSignature(recordId, role).then((data) => {
      if (mounted) {
        setSignature(data);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [recordId, role]);

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  const handleSave = async () => {
    try {
      if (sigCanvas.current) {
        if (sigCanvas.current.isEmpty()) {
          console.warn('Silakan tanda tangan terlebih dahulu.');
          return;
        }
        
        // Use getTrimmedCanvas, fallback to getCanvas if it fails
        let dataUrl = '';
        try {
          dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        } catch (e) {
          console.warn("Trim failed", e);
          dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png');
        }
        
        setSignature(dataUrl);
        setIsModalOpen(false);
        await saveSignature(recordId || 'default', role, dataUrl);
      }
    } catch (err) {
      console.error('Save signature error:', err);
      console.error('Gagal menyimpan tanda tangan.');
    }
  };
  
  const handleDelete = async () => {
    // Removed window.confirm because it is blocked in iframe
    if (true) {
       setSignature(null);
       await saveSignature(recordId || 'default', role, ''); // save empty string to remove
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div 
        className="w-full h-full min-h-[4rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative group print:border-none"
        onClick={() => !signature && setIsModalOpen(true)}
      >
        {isLoading ? (
          <div className="text-[10px] text-slate-300 print:hidden">Loading...</div>
        ) : signature ? (
          <>
            <img src={signature} alt="Tanda Tangan" className="max-w-full max-h-full object-contain pointer-events-none" />
            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity print:hidden">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                title="Edit Tanda Tangan"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                title="Hapus Tanda Tangan"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-[10px] text-slate-300 print:hidden flex flex-col items-center justify-center opacity-50 group-hover:opacity-100 border border-dashed border-slate-300 w-full h-full rounded">
            <Edit3 className="w-3 h-3 mb-0.5" />
            <span>{placeholder}</span>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Tanda Tangan Digital</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-slate-100 flex flex-col items-center">
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden w-full h-64 touch-none shadow-inner">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ className: 'w-full h-full' }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Gunakan jari (HP/Tablet) atau mouse (Laptop) untuk tanda tangan.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Ulangi
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
