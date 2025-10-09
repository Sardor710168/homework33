INSERT INTO brands (name) VALUES ('Samsung') ON CONFLICT DO NOTHING;
INSERT INTO brands (name) VALUES ('Apple') ON CONFLICT DO NOTHING;

INSERT INTO models (brand_id, name)
SELECT b.id, 'Galaxy S' FROM brands b WHERE b.name='Samsung' AND NOT EXISTS (SELECT 1 FROM models m WHERE m.name='Galaxy S' AND m.brand_id=b.id);

INSERT INTO models (brand_id, name)
SELECT b.id, 'iPhone' FROM brands b WHERE b.name='Apple' AND NOT EXISTS (SELECT 1 FROM models m WHERE m.name='iPhone' AND m.brand_id=b.id);

INSERT INTO phones (name, price, brand_id, model_id, color, display, ram, memory)
SELECT 'Galaxy S24', 9990000, b.id, m.id, 'black', 6.2, '8GB', '256GB'
FROM brands b JOIN models m ON b.id=m.brand_id
WHERE b.name='Samsung' AND m.name='Galaxy S'
ON CONFLICT DO NOTHING;

INSERT INTO customers (name, phone_number) VALUES ('Alisher Karimov', '+998901234567') ON CONFLICT DO NOTHING;
