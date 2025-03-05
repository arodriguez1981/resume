import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    if (!req.body) {
      throw new Error('Request body is empty');
    }
    const { content, contentType, userId, isDevelopment, isExample } = await req.json();
    if (!content || !contentType) {
      throw new Error('Missing required content parameters');
    }
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    const openai = new OpenAI(openaiApiKey);
    let textContent = content;
    if (contentType === 'pdf') {
      // Convert base64 PDF content to text
      const buffer = Uint8Array.from(atob(content), (c)=>c.charCodeAt(0));
      textContent = new TextDecoder().decode(buffer);
    }
    // Skip user check for example resumes or development mode
    const skipUserCheck = isExample || isDevelopment;
    if (!skipUserCheck && !userId) {
      throw new Error('User ID required');
    }
    // Use GPT-3.5 for free users and development, GPT-4 for PRO users
    const model = isDevelopment ? "gpt-3.5-turbo" : "gpt-4-turbo-preview";
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are a resume parsing expert. Extract structured information from resumes with high accuracy and attention to detail. Follow these guidelines:

1. Section Recognition:
   - Identify common section variations
   - Extract contact details from anywhere in the document
   - Handle missing sections gracefully

2. Content Processing:
   - Maintain original formatting and bullet points
   - Convert all dates to YYYY-MM format
   - Clean and standardize text
   - Handle special characters appropriately

3. Output Format:
   Return ONLY a valid JSON object with this structure:
   {
     "fullName": string,
     "email": string,
     "phone": string,
     "location": string,
     "website": string,
     "linkedin": string,
     "summary": string,
     "experience": [
       {
         "company": string,
         "position": string,
         "startDate": string,
         "endDate": string,
         "description": string
       }
     ],
     "education": [
       {
         "school": string,
         "degree": string,
         "field": string,
         "startDate": string,
         "endDate": string
       }
     ],
     "skills": string[],
     "languages": string[],
     "certifications": [
       {
         "name": string,
         "issuer": string,
         "date": string
       }
     ],
     "projects": [
       {
         "name": string,
         "description": string,
         "url": string
       }
     ],
     "volunteer": [
       {
         "organization": string,
         "role": string,
         "description": string
       }
     ],
     "references": [
       {
         "name": string,
         "position": string,
         "company": string,
         "contact": string
       }
     ]
   }`
        },
        {
          role: "user",
          content: `Extract structured information from this resume text:\n\n${textContent}\n\nReturn ONLY the JSON object following the specified structure.`
        }
      ],
      max_tokens: 4096,
      temperature: 0.3
    });
    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Failed to extract information from resume');
    }
    try {
      const cleanedContent = response.choices[0].message.content.trim();
      const parsedData = JSON.parse(cleanedContent);
      const defaultData = {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        volunteer: [],
        references: []
      };
      const finalData = {
        ...defaultData,
        ...parsedData
      };
      return new Response(JSON.stringify(finalData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } catch (parseError) {
      console.error('Parse error details:', {
        error: parseError,
        content: response.choices[0].message.content,
        contentType: typeof response.choices[0].message.content
      });
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return new Response(JSON.stringify({
      error: error.message || 'An unknown error occurred',
      details: error.cause || error.stack
    }), {
      status: error.status || 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
