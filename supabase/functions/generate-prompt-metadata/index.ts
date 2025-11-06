import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const EDUCATION_TAGS = [
  'Lesson Planning',
  'Assessment Creation',
  'Differentiation',
  'Parent Communication',
  'Student Feedback',
  'Classroom Management',
  'Professional Development',
  'Content Explanation',
  'Curriculum Planning',
  'Writing Assistance',
  'Discussion Facilitation',
  'Grading & Rubrics',
] as const

interface RequestBody {
  url: string
  prompt_text: string
}

interface MetadataResponse {
  generated_name: string
  description: string
  tags: string[]
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { url, prompt_text }: RequestBody = await req.json()

    if (!url || !prompt_text) {
      return new Response(
        JSON.stringify({ error: 'url and prompt_text are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI that generates metadata for educational CustomGPT prompts.

Given a CustomGPT URL and prompt text, generate:
1. generated_name: A concise, descriptive title (5-8 words) that captures the purpose
2. description: A 2-3 sentence summary explaining what this prompt helps teachers accomplish
3. tags: An array of 2-5 relevant tags from this list:
   - ${EDUCATION_TAGS.join('\n   - ')}

Focus on clarity and accuracy. Tags should reflect the primary use cases.
Return ONLY valid JSON with these exact keys: generated_name, description, tags (as an array).`,
          },
          {
            role: 'user',
            content: `URL: ${url}\n\nPrompt: ${prompt_text}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    const metadata: MetadataResponse = JSON.parse(content)

    // Validate and filter tags
    const validTags = metadata.tags.filter((tag) =>
      EDUCATION_TAGS.some((validTag) => validTag.toLowerCase() === tag.toLowerCase())
    )

    // Ensure we have at least one tag
    if (validTags.length === 0 && metadata.tags.length > 0) {
      // Use the first tag even if not exact match (allow some flexibility)
      validTags.push(metadata.tags[0])
    }

    const response: MetadataResponse = {
      generated_name: metadata.generated_name || 'Untitled Prompt',
      description: metadata.description || 'No description available.',
      tags: validTags.length > 0 ? validTags : ['Professional Development'],
    }

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})




