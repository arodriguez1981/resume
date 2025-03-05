import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications = [], onChange }) => {
  const addCertification = () => {
    onChange([
      ...certifications,
      { name: '', issuer: '', date: '' }
    ]);
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange(updatedCertifications);
  };

  return (
    <div className="space-y-6">
      {certifications.map((cert, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeCertification(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuing Organization
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCertification}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;