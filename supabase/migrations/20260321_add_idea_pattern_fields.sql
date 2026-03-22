-- Migration: Add structured pattern fields to ideas table
-- Run this in your Supabase SQL Editor

ALTER TABLE ideas ADD COLUMN IF NOT EXISTS primary_pattern TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS sub_patterns TEXT[];
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS scoring_group TEXT;
