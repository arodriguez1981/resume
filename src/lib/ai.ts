import { supabase } from './supabase';
import { Language } from '../types/language';

// Add language parameter to AI functions
export async function getSkillSuggestions(resumeText: string, language: Language = 'EN'): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-skills', {
      body: { text: resumeText, language }
    });

    if (error) throw new Error('Failed to analyze skills. Please try again.');
    return data.suggestions || [];
  } catch (error: any) {
    console.error('Error getting skill suggestions:', error);
    throw error;
  }
}

async function improveText(
  text: string, 
  type: 'summary' | 'experience' | 'skills',
  language: Language = 'EN'
): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('improve-text', {
      body: { text, type, language }
    });

    if (error) throw new Error('Failed to generate improvements. Please try again.');
    return data.suggestions || [];
  } catch (error: any) {
    console.error('Error improving text:', error);
    throw error;
  }
}

async function getSuggestions(
  type: 'summary' | 'experience' | 'skills',
  context: string,
  language: Language = 'EN'
): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-suggestions', {
      body: { type, context, language }
    });

    if (error) throw new Error('Failed to generate suggestions. Please try again.');
    return data.suggestions || [];
  } catch (error: any) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
}

export async function getJobMatches(resumeData: any, language: Language = 'EN'): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('job-matching', {
      body: { resume: resumeData, language }
    });

    if (error) throw new Error('Failed to analyze jobs. Please try again.');
    return data.matches || [];
  } catch (error: any) {
    console.error('Error getting job matches:', error);
    throw error;
  }
}