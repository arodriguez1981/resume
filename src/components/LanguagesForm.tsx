import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface LanguagesFormProps {
  languages: string[];
  onChange: (languages: string[]) => void;
}

// Comprehensive list of world languages
const languageOptions = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
  'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian',
  'Catalan', 'Cebuano', 'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Croatian', 'Czech',
  'Danish', 'Dutch',
  'English', 'Estonian',
  'Filipino', 'Finnish', 'French',
  'Galician', 'Georgian', 'German', 'Greek', 'Gujarati',
  'Haitian Creole', 'Hausa', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian',
  'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian',
  'Japanese', 'Javanese',
  'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kurdish',
  'Lao', 'Latin', 'Latvian', 'Lithuanian',
  'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)',
  'Nepali', 'Norwegian',
  'Persian', 'Polish', 'Portuguese', 'Punjabi',
  'Romanian', 'Russian',
  'Serbian', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Tamil', 'Telugu', 'Thai', 'Turkish',
  'Ukrainian', 'Urdu', 'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish', 'Yoruba',
  'Zulu'
].sort();

// Language proficiency levels from basic to native
const proficiencyLevels = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' }
];

interface LanguageEntry {
  language: string;
  proficiency: string;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages = [], onChange }) => {
  // Parse existing languages into structured format
  const parseLanguageString = (str: string): LanguageEntry => {
    const parts = str.split(' - ');
    return {
      language: parts[0] || '',
      proficiency: parts[1] || ''
    };
  };

  const formatLanguageEntry = (entry: LanguageEntry): string => {
    return `${entry.language} - ${entry.proficiency}`;
  };

  const parsedLanguages = languages.map(parseLanguageString);

  const [selectedLanguage, setSelectedLanguage] = React.useState('');
  const [selectedProficiency, setSelectedProficiency] = React.useState('');

  const addLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLanguage && selectedProficiency) {
      const newEntry = formatLanguageEntry({ language: selectedLanguage, proficiency: selectedProficiency });
      if (!languages.includes(newEntry)) {
        onChange([...languages, newEntry]);
        setSelectedLanguage('');
        setSelectedProficiency('');
      }
    }
  };

  const removeLanguage = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addLanguage} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency Level
            </label>
            <select
              id="proficiency"
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select proficiency</option>
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.label}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedLanguage || !selectedProficiency}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </button>
      </form>

      <div className="space-y-2">
        {parsedLanguages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div>
              <span className="font-medium">{lang.language}</span>
              <span className="text-gray-500"> - {lang.proficiency}</span>
            </div>
            <button
              onClick={() => removeLanguage(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesForm;