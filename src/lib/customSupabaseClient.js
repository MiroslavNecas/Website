import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrpycunvzompmupkolzd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHljdW52em9tcG11cGtvbHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODM5NDksImV4cCI6MjA3NDQ1OTk0OX0.Vt-ssT3UPvrQBxjkAZsWMdwgTs_F0kw8pF_oZPDKitQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);