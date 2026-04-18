-- ============================================================
-- Bhook - Supabase Storage Setup for Product Images
-- Run this in your Supabase SQL Editor AFTER the main schema.sql
-- ============================================================

-- 1. Create a public storage bucket for product images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  2097152,  -- 2MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- 2. Allow anyone to VIEW/download images (public read)
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Allow authenticated users (admins) to upload images
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- 4. Allow authenticated users (admins) to update/replace images
create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

-- 5. Allow authenticated users (admins) to delete images
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
