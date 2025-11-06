-- Add is_broken column to track GPTs that are not publicly accessible
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_broken BOOLEAN DEFAULT false;

-- Create index for filtering broken GPTs
CREATE INDEX IF NOT EXISTS idx_prompts_is_broken ON prompts(is_broken);
