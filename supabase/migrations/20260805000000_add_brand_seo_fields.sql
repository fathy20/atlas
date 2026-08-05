-- Migration: Add SEO fields to brands table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_title_ar text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_description_ar text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS meta_keywords_ar text;
