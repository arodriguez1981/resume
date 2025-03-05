import React from 'react';

interface Availability {
  relocation: boolean;
  remote: boolean;
  startDate: string;
  notice: string;
  preferences: string;
}

interface AvailabilityFormProps {
  availability: Availability;
  onChange: (availability: Availability) => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ 
  availability = {
    relocation: false,
    remote: false,
    startDate: '',
    notice: '',
    preferences: ''
  }, 
  onChange 
}) => {
  const handleChange = (field: keyof Availability, value: string | boolean) => {
    onChange({
      ...availability,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={availability.relocation}
              onChange={(e) => handleChange('relocation', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Open to Relocation</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={availability.remote}
              onChange={(e) => handleChange('remote', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Available for Remote Work</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Start Date
          </label>
          <input
            type="month"
            value={availability.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notice Period
          </label>
          <select
            value={availability.notice}
            onChange={(e) => handleChange('notice', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select notice period</option>
            <option value="immediate">Immediate</option>
            <option value="1week">1 Week</option>
            <option value="2weeks">2 Weeks</option>
            <option value="1month">1 Month</option>
            <option value="2months">2 Months</option>
            <option value="3months">3 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Preferences
          </label>
          <textarea
            value={availability.preferences}
            onChange={(e) => handleChange('preferences', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe your location preferences, e.g., specific cities, regions, or countries..."
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;