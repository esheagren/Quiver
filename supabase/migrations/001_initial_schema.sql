-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  generated_name TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  user_token UUID NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_prompts table
CREATE TABLE IF NOT EXISTS saved_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_token UUID NOT NULL,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_token, prompt_id)
);

-- Create prompt_upvotes table
CREATE TABLE IF NOT EXISTS prompt_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_token UUID NOT NULL,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_token, prompt_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_token UUID PRIMARY KEY,
  display_name TEXT,
  grade_levels TEXT[] DEFAULT '{}',
  subjects_taught TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_token ON prompts(user_token);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_upvotes ON prompts(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_token ON saved_prompts(user_token);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_prompt_id ON saved_prompts(prompt_id);

CREATE INDEX IF NOT EXISTS idx_upvotes_user_token ON prompt_upvotes(user_token);
CREATE INDEX IF NOT EXISTS idx_upvotes_prompt_id ON prompt_upvotes(prompt_id);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompts
-- Anyone can read prompts (public access)
CREATE POLICY "Prompts are viewable by everyone"
  ON prompts FOR SELECT
  USING (true);

-- Users can insert their own prompts (using user_token)
CREATE POLICY "Users can insert their own prompts"
  ON prompts FOR INSERT
  WITH CHECK (true);

-- Users can update their own prompts
CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for saved_prompts
-- Users can only see their own saved prompts
CREATE POLICY "Users can view their own saved prompts"
  ON saved_prompts FOR SELECT
  USING (true);

-- Users can insert their own saved prompts
CREATE POLICY "Users can save prompts"
  ON saved_prompts FOR INSERT
  WITH CHECK (true);

-- Users can delete their own saved prompts
CREATE POLICY "Users can unsave prompts"
  ON saved_prompts FOR DELETE
  USING (true);

-- RLS Policies for prompt_upvotes
-- Users can view all upvotes (for counting)
CREATE POLICY "Upvotes are viewable by everyone"
  ON prompt_upvotes FOR SELECT
  USING (true);

-- Users can insert their own upvotes
CREATE POLICY "Users can upvote prompts"
  ON prompt_upvotes FOR INSERT
  WITH CHECK (true);

-- Users can delete their own upvotes
CREATE POLICY "Users can remove upvotes"
  ON prompt_upvotes FOR DELETE
  USING (true);

-- RLS Policies for user_profiles
-- Users can view all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update prompt upvote count
CREATE OR REPLACE FUNCTION update_prompt_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prompts SET upvotes = upvotes + 1 WHERE id = NEW.prompt_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prompts SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.prompt_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to automatically update upvote count
CREATE TRIGGER update_upvote_count_trigger
  AFTER INSERT OR DELETE ON prompt_upvotes
  FOR EACH ROW EXECUTE FUNCTION update_prompt_upvote_count();




