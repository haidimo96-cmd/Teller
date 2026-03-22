-- Add JSONB column for structured idea data
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS idea_data JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN ideas.idea_data IS 'Structured idea data: one_liner, hero, villain, villain_line, victim_type, hook, key_twists, escalation, payoff, viral_formula, title_formula, dual_themes, concrete_numbers, wtf_concept, comment_trigger';
