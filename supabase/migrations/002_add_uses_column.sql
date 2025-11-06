-- Add uses column to track message count/usage statistics
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS uses INTEGER DEFAULT 0;

-- Create index for sorting by uses
CREATE INDEX IF NOT EXISTS idx_prompts_uses ON prompts(uses DESC);
