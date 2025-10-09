const db = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM brands ORDER BY id');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM brands WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error: 'Brand not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { rows } = await db.query('INSERT INTO brands(name) VALUES($1) RETURNING *', [name]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success:false, error:'Brand already exists' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { rows } = await db.query('UPDATE brands SET name=$1 WHERE id=$2 RETURNING *', [name, req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Brand not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM brands WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success:false, error:'Brand not found' });
    res.json({ success:true, data: null });
  } catch (err) { next(err); }
};
