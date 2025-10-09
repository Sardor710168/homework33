const db = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM customers ORDER BY id');
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM customers WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Customer not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, phone_number } = req.body;
    const { rows } = await db.query('INSERT INTO customers(name, phone_number) VALUES($1,$2) RETURNING *', [name, phone_number]);
    res.status(201).json({ success:true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success:false, error:'Phone number already exists' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, phone_number } = req.body;
    const { rows } = await db.query('UPDATE customers SET name=$1, phone_number=$2 WHERE id=$3 RETURNING *', [name, phone_number, req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Customer not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success:false, error:'Customer not found' });
    res.json({ success:true, data: null });
  } catch (err) { next(err); }
};
