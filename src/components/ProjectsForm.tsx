import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  url?: string;
}

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects = [], onChange }) => {
  const addProject = () => {
    onChange([
      ...projects,
      { name: '', description: '', url: '' }
    ]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = projects.map((project, i) => {
      if (i === index) {
        return { ...project, [field]: value };
      }
      return project;
    });
    onChange(updatedProjects);
  };

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            onClick={() => removeProject(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project URL (optional)
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => updateProject(index, 'url', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;