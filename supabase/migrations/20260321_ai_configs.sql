-- Migration: AI Model Management tables
-- Run this in your Supabase SQL Editor

-- Table to store AI provider configs per user
CREATE TABLE IF NOT EXISTS ai_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google',
  model_name TEXT NOT NULL DEFAULT 'gemini-3.1-pro',
  display_name TEXT NOT NULL DEFAULT 'Gemini 3.1 Pro',
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  token_limit BIGINT DEFAULT 1000000,
  used_tokens BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Table to log each AI call's token usage
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  config_id UUID REFERENCES ai_configs(id) ON DELETE SET NULL,
  phase TEXT NOT NULL,
  model_name TEXT NOT NULL,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE ai_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own configs
CREATE POLICY "Users can view own configs" ON ai_configs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configs" ON ai_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configs" ON ai_configs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configs" ON ai_configs
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only access their own usage logs
CREATE POLICY "Users can view own usage" ON ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert usage" ON ai_usage_logs
  FOR INSERT WITH CHECK (true);

-- Index for faster usage queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_configs_user_id ON ai_configs(user_id);
