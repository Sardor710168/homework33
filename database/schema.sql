like constraint: bu yerdagi ruxsat etilgan ranglarni kengaytirish mumkin
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS models (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

CREATE TABLE IF NOT EXISTS phones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price BIGINT NOT NULL CHECK (price >= 0),
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  model_id INTEGER REFERENCES models(id) ON DELETE SET NULL,
  color VARCHAR(50),
  display NUMERIC(4,2),
  ram VARCHAR(50),
  memory VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone_number VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_date DATE NOT NULL,
  order_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  total_price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (order_status IN ('pending','processing','completed','cancelled','shipped'))
);

CREATE TABLE IF NOT EXISTS order_detail (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  phone_id INTEGER NOT NULL REFERENCES phones(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
  line_total BIGINT NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_models_brand ON models(brand_id);
CREATE INDEX IF NOT EXISTS idx_phones_model ON phones(model_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
