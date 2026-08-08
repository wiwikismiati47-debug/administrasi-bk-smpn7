const fs = require('fs');
let content = fs.readFileSync('src/components/FormUndangan.tsx', 'utf8');

if (!content.includes('PRESET_GURU_BK')) {
  content = content.replace("import { getActiveGuruBK } from '../lib/guruBk';", "import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';");
}

const inputNama = `<input
                  type="text"
                  value={namaGuruBk}
                  onChange={(e) => setNamaGuruBk(e.target.value)}
                  placeholder="WIWIK ISMIATI, S.Pd"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                />`;

const selectNama = `<select
                  value={namaGuruBk}
                  onChange={(e) => {
                    setNamaGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                    if (preset) setNipGuruBk(preset.nip);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold appearance-none cursor-pointer"
                >
                  {PRESET_GURU_BK.map(g => (
                    <option key={g.nip} value={g.nama}>{g.nama}</option>
                  ))}
                  {!PRESET_GURU_BK.some(g => g.nama === namaGuruBk) && (
                    <option value={namaGuruBk}>{namaGuruBk}</option>
                  )}
                </select>`;

content = content.replace(inputNama, selectNama);
fs.writeFileSync('src/components/FormUndangan.tsx', content);
