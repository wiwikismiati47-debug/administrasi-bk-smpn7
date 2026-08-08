import { getSupabaseClient, getSavedSupabaseConfig, DEFAULT_SIGNATURES_TABLE_NAME } from './supabase';

export interface SignatureData {
  record_id: string;
  role: string;
  signature_data: string;
}

const STORAGE_KEY = 'bk_smpn7_signatures_local';

export function getLocalSignatures(): SignatureData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLocalSignatures(data: SignatureData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function fetchSignature(recordId: string, role: string): Promise<string | null> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SIGNATURES_TABLE_NAME)
        .select('signature_data')
        .eq('record_id', recordId)
        .eq('role', role)
        .single();
        
      if (!error && data) {
        return data.signature_data;
      }
    } catch {
      // ignore
    }
  }

  // Fallback to local
  const local = getLocalSignatures();
  const found = local.find((s) => s.record_id === recordId && s.role === role);
  return found ? found.signature_data : null;
}

export async function fetchAllSignaturesForRecord(recordId: string): Promise<SignatureData[]> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SIGNATURES_TABLE_NAME)
        .select('*')
        .eq('record_id', recordId);
        
      if (!error && data) {
        return data as SignatureData[];
      }
    } catch {
      // ignore
    }
  }

  const local = getLocalSignatures();
  return local.filter((s) => s.record_id === recordId);
}

export async function saveSignature(recordId: string, role: string, signatureData: string): Promise<boolean> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  // Update local
  let local = getLocalSignatures();
  const index = local.findIndex((s) => s.record_id === recordId && s.role === role);
  if (index >= 0) {
    local[index].signature_data = signatureData;
  } else {
    local.push({ record_id: recordId, role, signature_data: signatureData });
  }
  saveLocalSignatures(local);

  if (client) {
    try {
      const now = new Date().toISOString();
      const payload = {
        record_id: recordId,
        role,
        signature_data: signatureData,
        updated_at: now
      };
      
      const { error } = await client
        .from(DEFAULT_SIGNATURES_TABLE_NAME)
        .upsert(payload, { onConflict: 'record_id,role' });
        
      if (!error) return true;
    } catch {
      // ignore
    }
  }
  return true;
}
