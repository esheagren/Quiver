#!/bin/bash

# Supabase configuration
SUPABASE_URL="https://lehsepmhhirnahdzzjhn.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaHNlcG1oaGlybmFoZHp6amhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODEzMjUsImV4cCI6MjA3Nzc1NzMyNX0.VoVy3qC2SAKuHtCkT-nF0Q_3AKTe8dh0BC9VBf1y-kA"

# Generate a test user token
USER_TOKEN=$(uuidgen | tr '[:upper:]' '[:lower:]')
echo "Using user token: $USER_TOKEN"
echo ""

# Function to insert a prompt
insert_prompt() {
  local name="$1"
  local description="$2"
  local tags="$3"
  local url="$4"
  local prompt_text="$5"

  curl -X POST "${SUPABASE_URL}/rest/v1/prompts" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{
      \"url\": \"${url}\",
      \"prompt_text\": \"${prompt_text}\",
      \"generated_name\": \"${name}\",
      \"description\": \"${description}\",
      \"tags\": ${tags},
      \"user_token\": \"${USER_TOKEN}\"
    }"
  echo ""
  echo ""
}

echo "Inserting sample prompts..."
echo ""

# Prompt 1: Lesson Planning
insert_prompt \
  "Create Engaging Lesson Plans" \
  "Generate comprehensive lesson plans with learning objectives, activities, and assessments tailored to your grade level and subject." \
  "[\"Lesson Planning\", \"Curriculum Planning\"]" \
  "https://chatgpt.com/g/lesson-planner" \
  "Create a detailed lesson plan for [SUBJECT] in [GRADE_LEVEL]. Include learning objectives, warm-up activities, main instruction, hands-on activities, differentiation strategies, and formative assessments. Make it engaging and aligned with [STANDARDS]."

# Prompt 2: Assessment Creation
insert_prompt \
  "Build Formative Assessments" \
  "Design quick formative assessments to check student understanding during lessons and adjust instruction accordingly." \
  "[\"Assessment Creation\", \"Differentiation\"]" \
  "https://chatgpt.com/g/assessment-builder" \
  "Create 5 formative assessment questions for [TOPIC] suitable for [GRADE_LEVEL]. Include a mix of multiple choice, short answer, and application questions. Provide answer keys and suggest when during the lesson to use each question."

# Prompt 3: Differentiation
insert_prompt \
  "Differentiate Instruction for All Learners" \
  "Get strategies to modify lessons for students with different learning needs, including ELL, gifted, and students with learning differences." \
  "[\"Differentiation\", \"Lesson Planning\"]" \
  "https://chatgpt.com/g/differentiation-helper" \
  "Suggest 3 ways to differentiate [LESSON_TOPIC] for: 1) English Language Learners, 2) Students who need extra support, 3) Advanced learners. Include modifications for content, process, and product."

# Prompt 4: Parent Communication
insert_prompt \
  "Write Professional Parent Emails" \
  "Craft clear, empathetic, and professional communications to parents about student progress, concerns, and achievements." \
  "[\"Parent Communication\", \"Student Feedback\"]" \
  "https://chatgpt.com/g/parent-communicator" \
  "Write a professional email to [STUDENT_NAME]'s parent about [TOPIC - e.g., academic progress, behavior concern, achievement]. Be warm, specific, and include actionable next steps. Maintain a collaborative tone."

# Prompt 5: Student Feedback
insert_prompt \
  "Provide Constructive Student Feedback" \
  "Generate specific, actionable feedback for students that promotes growth mindset and clear next steps for improvement." \
  "[\"Student Feedback\", \"Assessment Creation\"]" \
  "https://chatgpt.com/g/feedback-generator" \
  "Write constructive feedback for [STUDENT_NAME]'s work on [ASSIGNMENT]. Include: 1) What they did well (be specific), 2) One area for improvement, 3) A clear next step. Use a growth mindset approach."

# Prompt 6: Classroom Management
insert_prompt \
  "Classroom Management Strategies" \
  "Get practical strategies for maintaining a positive classroom environment and handling common behavior challenges." \
  "[\"Classroom Management\", \"Professional Development\"]" \
  "https://chatgpt.com/g/classroom-manager" \
  "Suggest 3 proactive classroom management strategies for [SITUATION - e.g., transitions, group work, attention]. Include both prevention and response strategies. Make them age-appropriate for [GRADE_LEVEL]."

# Prompt 7: Writing Assistance
insert_prompt \
  "Help Students Improve Writing" \
  "Provide scaffolding and support to help students develop their writing skills across different genres and purposes." \
  "[\"Writing Assistance\", \"Differentiation\"]" \
  "https://chatgpt.com/g/writing-coach" \
  "Create a writing scaffold for [WRITING_TYPE - e.g., persuasive essay, narrative, research report] for [GRADE_LEVEL] students. Include: structure outline, sentence starters, transition words, and a checklist for self-editing."

# Prompt 8: Content Explanation
insert_prompt \
  "Explain Complex Concepts Simply" \
  "Break down difficult concepts into age-appropriate explanations with analogies and examples that students can understand." \
  "[\"Content Explanation\", \"Lesson Planning\"]" \
  "https://chatgpt.com/g/concept-explainer" \
  "Explain [CONCEPT] to [GRADE_LEVEL] students using: 1) A simple analogy, 2) Real-world examples, 3) Visual aids suggestions, 4) Common misconceptions to address. Make it engaging and accessible."

echo "Done! Sample prompts inserted."
echo "User token used: $USER_TOKEN"
echo "You can use this token in your browser's localStorage to test saved prompts."

