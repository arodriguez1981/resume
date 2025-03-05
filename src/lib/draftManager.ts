import { supabase } from './supabase';

interface DraftSaveOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export async function saveDraft(
  userId: string,
  data: any,
  options: DraftSaveOptions = {}
): Promise<void> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const { error } = await supabase
        .from('resume_drafts')
        .upsert(
          {
            user_id: userId,
            data,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        throw error;
      }

      return;
    } catch (error: any) {
      attempts++;
      console.warn(`Draft save attempt ${attempts} failed:`, error);

      if (attempts === maxRetries) {
        throw new Error('Failed to save draft after multiple attempts. Please check your connection and try again.');
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

export async function loadDraft(userId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('resume_drafts')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.data || null;
  } catch (error: any) {
    console.error('Error loading draft:', error);
    throw new Error('Failed to load draft. Please try again later.');
  }
}