import { Language } from '../types/language';

const translations: Record<string, Record<string, string>> = {
  // English translations
  EN: {
    // Personal Information
    'personal.title': 'Personal Information',
    'personal.fullName': 'Full Name',
    'personal.email': 'Email',
    'personal.phone': 'Phone',
    'personal.location': 'Location',
    'personal.website': 'Website (optional)',
    'personal.linkedin': 'LinkedIn (optional)',
    
    // Professional Summary
    'summary.title': 'Professional Summary',
    'summary.placeholder': 'Write a brief summary of your professional background and career objectives...',
    
    // Work Experience
    'experience.title': 'Work Experience',
    'experience.company': 'Company',
    'experience.position': 'Position',
    'experience.startDate': 'Start Date',
    'experience.endDate': 'End Date',
    'experience.description': 'Description',
    'experience.add': 'Add Experience',
    
    // Education
    'education.title': 'Education',
    'education.school': 'School',
    'education.degree': 'Degree',
    'education.field': 'Field of Study',
    'education.add': 'Add Education',
    
    // Skills
    'skills.title': 'Skills',
    'skills.add': 'Add Skill',
    'skills.placeholder': 'Add a skill...',
    
    // Languages
    'languages.title': 'Languages',
    'languages.select': 'Select a language',
    'languages.proficiency': 'Proficiency Level',
    'languages.add': 'Add Language',
    
    // Certifications
    'certifications.title': 'Certifications',
    'certifications.name': 'Certification Name',
    'certifications.issuer': 'Issuing Organization',
    'certifications.date': 'Date',
    'certifications.add': 'Add Certification',
    
    // Projects
    'projects.title': 'Projects',
    'projects.name': 'Project Name',
    'projects.description': 'Description',
    'projects.url': 'Project URL (optional)',
    'projects.add': 'Add Project',
    
    // Volunteer
    'volunteer.title': 'Volunteer Experience',
    'volunteer.organization': 'Organization',
    'volunteer.role': 'Role',
    'volunteer.description': 'Description',
    'volunteer.add': 'Add Volunteer Experience',
    
    // References
    'references.title': 'References',
    'references.name': 'Reference Name',
    'references.position': 'Position',
    'references.company': 'Company',
    'references.contact': 'Contact Information',
    'references.add': 'Add Reference',
    
    // Buttons
    'button.reset': 'Reset',
    'button.import': 'Import',
    'button.customize': 'Customize',
    'button.download': 'Download PDF',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.apply': 'Apply',
    
    // AI Features
    'ai.writing': 'Writing Assistant',
    'ai.improve': 'Improve with AI',
    'ai.suggestions': 'AI Suggestions',
    'ai.generating': 'Generating suggestions...',
    
    // Misc
    'preview.empty': 'As you fill out the form, your resume preview will appear here.',
    'present': 'Present',
    
    // Cover Letter
    'coverletter.title': 'Cover Letter',
    'coverletter.personalInfo': 'Personal Information',
    'coverletter.jobDetails': 'Job Details',
    'coverletter.content': 'Cover Letter Content',
    'coverletter.jobTitle': 'Position Title',
    'coverletter.jobTitlePlaceholder': 'e.g. Senior Software Engineer',
    'coverletter.date': 'Date',
    'coverletter.hiringManager': 'Hiring Manager Name',
    'coverletter.hiringManagerPlaceholder': 'e.g. John Smith',
    'coverletter.company': 'Company Name',
    'coverletter.companyPlaceholder': 'e.g. Tech Corp',
    'coverletter.contentPlaceholder': 'Write your cover letter content here...',
  },
  
  // Spanish translations
  ES: {
    // Personal Information
    'personal.title': 'Información Personal',
    'personal.fullName': 'Nombre Completo',
    'personal.email': 'Correo Electrónico',
    'personal.phone': 'Teléfono',
    'personal.location': 'Ubicación',
    'personal.website': 'Sitio Web (opcional)',
    'personal.linkedin': 'LinkedIn (opcional)',
    
    // Professional Summary
    'summary.title': 'Resumen Profesional',
    'summary.placeholder': 'Escribe un breve resumen de tu experiencia profesional y objetivos laborales...',
    
    // Work Experience
    'experience.title': 'Experiencia Laboral',
    'experience.company': 'Empresa',
    'experience.position': 'Cargo',
    'experience.startDate': 'Fecha de Inicio',
    'experience.endDate': 'Fecha de Fin',
    'experience.description': 'Descripción',
    'experience.add': 'Agregar Experiencia',
    
    // Education
    'education.title': 'Educación',
    'education.school': 'Centro Educativo',
    'education.degree': 'Título',
    'education.field': 'Campo de Estudio',
    'education.add': 'Agregar Educación',
    
    // Skills
    'skills.title': 'Habilidades',
    'skills.add': 'Agregar Habilidad',
    'skills.placeholder': 'Agregar una habilidad...',
    
    // Languages
    'languages.title': 'Idiomas',
    'languages.select': 'Seleccionar idioma',
    'languages.proficiency': 'Nivel de Competencia',
    'languages.add': 'Agregar Idioma',
    
    // Certifications
    'certifications.title': 'Certificaciones',
    'certifications.name': 'Nombre de la Certificación',
    'certifications.issuer': 'Organización Emisora',
    'certifications.date': 'Fecha',
    'certifications.add': 'Agregar Certificación',
    
    // Projects
    'projects.title': 'Proyectos',
    'projects.name': 'Nombre del Proyecto',
    'projects.description': 'Descripción',
    'projects.url': 'URL del Proyecto (opcional)',
    'projects.add': 'Agregar Proyecto',
    
    // Volunteer
    'volunteer.title': 'Experiencia Voluntaria',
    'volunteer.organization': 'Organización',
    'volunteer.role': 'Rol',
    'volunteer.description': 'Descripción',
    'volunteer.add': 'Agregar Experiencia Voluntaria',
    
    // References
    'references.title': 'Referencias',
    'references.name': 'Nombre de la Referencia',
    'references.position': 'Cargo',
    'references.company': 'Empresa',
    'references.contact': 'Información de Contacto',
    'references.add': 'Agregar Referencia',
    
    // Buttons
    'button.reset': 'Reiniciar',
    'button.import': 'Importar',
    'button.customize': 'Personalizar',
    'button.download': 'Descargar PDF',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.apply': 'Aplicar',
    
    // AI Features
    'ai.writing': 'Asistente de Escritura',
    'ai.improve': 'Mejorar con IA',
    'ai.suggestions': 'Sugerencias de IA',
    'ai.generating': 'Generando sugerencias...',
    
    // Misc
    'preview.empty': 'A medida que completes el formulario, la vista previa de tu currículum aparecerá aquí.',
    'present': 'Presente',
    
    // Cover Letter
    'coverletter.title': 'Carta de Presentación',
    'coverletter.personalInfo': 'Información Personal',
    'coverletter.jobDetails': 'Detalles del Puesto',
    'coverletter.content': 'Contenido de la Carta',
    'coverletter.jobTitle': 'Título del Puesto',
    'coverletter.jobTitlePlaceholder': 'ej. Ingeniero de Software Senior',
    'coverletter.date': 'Fecha',
    'coverletter.hiringManager': 'Nombre del Gerente de Contratación',
    'coverletter.hiringManagerPlaceholder': 'ej. Juan Pérez',
    'coverletter.company': 'Nombre de la Empresa',
    'coverletter.companyPlaceholder': 'ej. Tech Corp',
    'coverletter.contentPlaceholder': 'Escribe el contenido de tu carta de presentación aquí...',
  }
};

export function useTranslation(language: Language) {
  return {
    t: (key: string) => translations[language]?.[key] || translations['EN'][key] || key
  };
}