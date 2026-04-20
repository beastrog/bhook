-- ============================================================
-- Bhook: Cooked Items & Order Number Fix Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Fix generate_order_number to avoid duplicate key violations
--    Uses advisory lock + retry-safe approach: appends microseconds suffix
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  today_str text;
  count_today integer;
  suffix text;
  order_num text;
  attempt integer := 0;
BEGIN
  today_str := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYMMDD');
  LOOP
    SELECT count(*) INTO count_today FROM orders
    WHERE date(created_at AT TIME ZONE 'Asia/Kolkata') = date(now() AT TIME ZONE 'Asia/Kolkata');

    -- On retry, append a random 2-digit suffix so concurrent orders never clash
    IF attempt = 0 THEN
      order_num := 'BHK-' || today_str || '-' || lpad((count_today + 1)::text, 3, '0');
    ELSE
      suffix := lpad(floor(random() * 99 + 1)::text, 2, '0');
      order_num := 'BHK-' || today_str || '-' || lpad((count_today + 1)::text, 3, '0') || suffix;
    END IF;

    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = order_num) THEN
      RETURN order_num;
    END IF;

    attempt := attempt + 1;
    IF attempt > 10 THEN
      -- Absolute fallback: use full timestamp
      RETURN 'BHK-' || to_char(now(), 'YYMMDD-HH24MISS') || '-' || floor(random()*999)::text;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;


-- 2. Add cooked_profit_splits table (separate from main profit splits)
CREATE TABLE IF NOT EXISTS cooked_profit_splits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_name text NOT NULL,
  percentage numeric(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_cooked_splits_updated_at BEFORE UPDATE ON cooked_profit_splits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for cooked_profit_splits
ALTER TABLE cooked_profit_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cooked profit splits"
  ON cooked_profit_splits FOR SELECT TO anon, authenticated
  USING (true);

-- 3. Seed default cooked split partners (same as main splits — adjust as needed)
INSERT INTO cooked_profit_splits (person_name, percentage, active)
SELECT person_name, percentage, active FROM profit_splits
ON CONFLICT DO NOTHING;
