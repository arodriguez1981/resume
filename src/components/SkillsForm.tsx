import React, { useState, useCallback } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AIDialog from './AIDialog';
import { getSkillSuggestions } from '../lib/ai';

interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills = [], onChange }) => {
  const { isProUser } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSkill = useCallback((skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onChange([...skills, skill.trim()]);
      setNewSkill('');
    }
  }, [skills, onChange]);

  const removeSkill = useCallback((index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  }, [skills, onChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from bubbling
    addSkill(newSkill);
  }, [newSkill, addSkill]);

  const handleGetSuggestions = useCallback(async () => {
    if (!isProUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const suggestions = await getSkillSuggestions(skills.join(', '));
      setAISuggestions(suggestions);
      setShowAIDialog(true);
    } catch (error: any) {
      setError(error.message);
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [isProUser, skills]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2" autoComplete="off">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 200)}
              placeholder="Add a skill..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoComplete="off"
            />
            {isProUser && inputFocused && (
              <button
                type="button"
                onClick={handleGetSuggestions}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Get Suggestions'}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>

      <AIDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        title="Suggested Skills"
        suggestions={aiSuggestions}
        onApply={addSkill}
      />
    </div>
  );
};

export default SkillsForm;