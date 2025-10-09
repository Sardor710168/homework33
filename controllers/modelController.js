const db = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT m.*, b.name as brand_name FROM models m JOIN brands b ON m.brand_id=b.id ORDER BY m.id');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM models WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Model not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.getByBrand = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM models WHERE brand_id=$1 ORDER BY id', [req.params.brand_id]);
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { brand_id, name } = req.body;
    const { rows } = await db.query('INSERT INTO models(brand_id,name) VALUES($1,$2) RETURNING *', [brand_id, name]);
    res.status(201).json({ success:true, data: rows[0] });
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ success:false, error: 'Brand not found' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { brand_id, name } = req.body;
    const { rows } = await db.query('UPDATE models SET brand_id=$1, name=$2 WHERE id=$3 RETURNING *', [brand_id, name, req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Model not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM models WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success:false, error:'Model not found' });
    res.json({ success:true, data: null });
  } catch (err) { next(err); }
};
