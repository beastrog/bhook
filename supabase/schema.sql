-- ============================================================
-- Bhook Hostel Snack Store - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  image_url text,
  cost_price numeric(10,2) not null default 0,
  selling_price numeric(10,2) not null default 0,
  stock_quantity integer not null default 0,
  active boolean not null default true,
  category text not null default 'Snacks',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_name text not null,
  room_number text not null,
  phone_number text,
  total_amount numeric(10,2) not null default 0,
  total_cost numeric(10,2) not null default 0,
  total_profit numeric(10,2) not null default 0,
  status text not null default 'reserved' check (status in ('reserved', 'pending_pickup', 'completed', 'cancelled')),
  payment_mode text not null default 'offline',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name text not null,
  quantity integer not null default 1,
  unit_cost_price numeric(10,2) not null,
  unit_selling_price numeric(10,2) not null,
  line_total numeric(10,2) generated always as (unit_selling_price * quantity) stored,
  line_cost numeric(10,2) generated always as (unit_cost_price * quantity) stored,
  line_profit numeric(10,2) generated always as ((unit_selling_price - unit_cost_price) * quantity) stored,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PROFIT SPLITS TABLE
-- ============================================================
create table if not exists profit_splits (
  id uuid primary key default uuid_generate_v4(),
  person_name text not null,
  percentage numeric(5,2) not null check (percentage > 0 and percentage <= 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();

create trigger update_profit_splits_updated_at before update on profit_splits
  for each row execute function update_updated_at_column();

-- Generate order number (e.g., BHK-240418-001)
create or replace function generate_order_number()
returns text as $$
declare
  today_str text;
  count_today integer;
  order_num text;
begin
  today_str := to_char(now(), 'YYMMDD');
  select count(*) into count_today from orders 
  where date(created_at) = date(now());
  order_num := 'BHK-' || today_str || '-' || lpad((count_today + 1)::text, 3, '0');
  return order_num;
end;
$$ language plpgsql;

-- Reserve stock with concurrency protection (RPC)
create or replace function place_order(
  p_customer_name text,
  p_room_number text,
  p_phone_number text,
  p_items jsonb -- [{product_id, quantity}]
)
returns jsonb as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_total_amount numeric := 0;
  v_total_cost numeric := 0;
  v_total_profit numeric := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_line_total numeric;
  v_line_cost numeric;
  v_line_profit numeric;
begin
  -- Lock and validate each product
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from products 
    where id = (v_item->>'product_id')::uuid
    for update;
    
    if not found then
      raise exception 'Product not found: %', v_item->>'product_id';
    end if;
    
    if not v_product.active then
      raise exception 'Product is not available: %', v_product.name;
    end if;
    
    if v_product.stock_quantity < (v_item->>'quantity')::integer then
      raise exception 'Insufficient stock for: %. Only % left.', v_product.name, v_product.stock_quantity;
    end if;
    
    v_line_total := v_product.selling_price * (v_item->>'quantity')::integer;
    v_line_cost := v_product.cost_price * (v_item->>'quantity')::integer;
    v_line_profit := v_line_total - v_line_cost;
    
    v_total_amount := v_total_amount + v_line_total;
    v_total_cost := v_total_cost + v_line_cost;
    v_total_profit := v_total_profit + v_line_profit;
    
    -- Decrement stock
    update products set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
    where id = v_product.id;
  end loop;
  
  -- Generate order number
  v_order_number := generate_order_number();
  
  -- Create order
  insert into orders (order_number, customer_name, room_number, phone_number, total_amount, total_cost, total_profit, status)
  values (v_order_number, p_customer_name, p_room_number, p_phone_number, v_total_amount, v_total_cost, v_total_profit, 'reserved')
  returning id into v_order_id;
  
  -- Create order items
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid;
    
    insert into order_items (order_id, product_id, product_name, quantity, unit_cost_price, unit_selling_price)
    values (v_order_id, v_product.id, v_product.name, (v_item->>'quantity')::integer, v_product.cost_price, v_product.selling_price);
  end loop;
  
  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total_amount', v_total_amount,
    'total_profit', v_total_profit
  );
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table profit_splits enable row level security;
alter table settings enable row level security;

-- Products: public read for active products, full access via service role
create policy "Public can view active products"
  on products for select to anon, authenticated
  using (active = true);

-- Orders: anyone can insert (to place order); service role manages rest
create policy "Anyone can place orders"
  on orders for insert to anon, authenticated
  with check (true);

create policy "Anyone can view their order by id"
  on orders for select to anon, authenticated
  using (true);

-- Order items: public read  
create policy "Anyone can view order items"
  on order_items for select to anon, authenticated
  using (true);

create policy "Service role inserts order items"
  on order_items for insert to anon, authenticated
  with check (true);

-- Profit splits: public read
create policy "Anyone can view profit splits"
  on profit_splits for select to anon, authenticated
  using (true);

-- Settings: public read
create policy "Anyone can read settings"
  on settings for select to anon, authenticated
  using (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default settings
insert into settings (key, value) values
  ('store_name', 'Bhook'),
  ('admin_room', '204'),
  ('store_open', 'true'),
  ('announcement', 'Fresh stock available tonight! 🔥')
on conflict (key) do nothing;

-- Default profit splits (adjust percentages as needed)
insert into profit_splits (person_name, percentage, active) values
  ('You', 60, true),
  ('Partner', 40, true)
on conflict do nothing;

-- Sample products
insert into products (name, description, image_url, cost_price, selling_price, stock_quantity, category) values
  ('Lays Classic Salted', 'Classic salted potato chips', null, 10, 20, 30, 'Chips'),
  ('Kurkure Masala Munch', 'Spicy crunchy snack', null, 10, 20, 25, 'Chips'),
  ('Bingo Mad Angles', 'Tangy tomato flavored', null, 10, 20, 20, 'Chips'),
  ('Maggi Noodles 2-Minute', 'Classic masala flavor', null, 12, 22, 15, 'Noodles'),
  ('Dairy Milk Silk', '60g chocolate bar', null, 50, 80, 10, 'Chocolates'),
  ('KitKat 4 Finger', 'Crisp wafer bar', null, 50, 80, 8, 'Chocolates'),
  ('Red Bull Energy Drink', '250ml energy drink', null, 80, 130, 12, 'Drinks'),
  ('Mountain Dew 600ml', 'Citrus flavored soda', null, 25, 40, 20, 'Drinks'),
  ('Good Day Cashew Biscuits', 'Rich cashew cookies', null, 15, 25, 18, 'Biscuits'),
  ('Oreo Original', 'Classic cream cookies', null, 20, 35, 15, 'Biscuits')
on conflict do nothing;
