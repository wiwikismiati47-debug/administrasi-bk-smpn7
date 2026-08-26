import { getSupabaseClient, getSavedSupabaseConfig, DEFAULT_SIGNATURES_TABLE_NAME } from './supabase';

export interface SignatureData {
  record_id: string;
  role: string;
  signature_data: string;
}

export async function fetchSignature(recordId: string, role: string): Promise<string | null> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return null;

  try {
    const { data, error } = await client
      .from(DEFAULT_SIGNATURES_TABLE_NAME)
      .select('signature_data')
      .eq('record_id', recordId)
      .eq('role', role)
      .maybeSingle();
      
    if (!error && data) {
      return data.signature_data;
    }
  } catch (err) {
    console.warn('Gagal memuat tanda tangan dari Supabase:', err);
  }

  return null;
}

export async function fetchAllSignaturesForRecord(recordId: string): Promise<SignatureData[]> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return [];

  try {
    const { data, error } = await client
      .from(DEFAULT_SIGNATURES_TABLE_NAME)
      .select('*')
      .eq('record_id', recordId);
      
    if (!error && data) {
      return data as SignatureData[];
    }
  } catch (err) {
    console.warn('Gagal memuat daftar tanda tangan dari Supabase:', err);
  }

  return [];
}

export async function saveSignature(recordId: string, role: string, signatureData: string): Promise<{ success: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, error: 'Database Supabase tidak terhubung.' };
  }

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
      
    if (error) {
      console.error('Supabase saveSignature error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan tanda tangan ke database';
    return { success: false, error: msg };
  }
}

