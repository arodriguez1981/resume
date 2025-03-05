import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  name: string;
  institution: string;
  date: string;
  description: string;
}

interface AdditionalCoursesFormProps {
  courses: Course[];
  onChange: (courses: Course[]) => void;
}

const AdditionalCoursesForm: React.FC<AdditionalCoursesFormProps> = ({ courses = [], onChange }) => {
  const addCourse = () => {
    onChange([
      ...courses,
      { name: '', institution: '', date: '', description: '' }
    ]);
  };

  const removeCourse = (index: number) => {
    onChange(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updatedCourses = courses.map((course, i) => {
      if (i === index) {
        return { ...course, [field]: value };
      }
      return course;
    });
    onChange(updatedCourses);
  };

  return (
    <div className="space-y-6">
      {courses.map((course, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeCourse(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Advanced Project Management"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <input
                type="text"
                value={course.institution}
                onChange={(e) => updateCourse(index, 'institution', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Coursera"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Completion Date
              </label>
              <input
                type="month"
                value={course.date}
                onChange={(e) => updateCourse(index, 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={course.description}
                onChange={(e) => updateCourse(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe what you learned in this course..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCourse}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Course
      </button>
    </div>
  );
};

export default AdditionalCoursesForm;