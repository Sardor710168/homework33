const db = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(`SELECT p.*, b.name as brand_name, m.name as model_name
      FROM phones p
      JOIN brands b ON p.brand_id=b.id
      LEFT JOIN models m ON p.model_id=m.id
      ORDER BY p.id`);
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM phones WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Phone not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.getByModel = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM phones WHERE model_id=$1 ORDER BY id', [req.params.model_id]);
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, price, brand_id, model_id, color, display, ram, memory } = req.body;
    const { rows } = await db.query(
      `INSERT INTO phones(name, price, brand_id, model_id, color, display, ram, memory)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, price, brand_id, model_id || null, color || null, display || null, ram || null, memory || null]
    );
    res.status(201).json({ success:true, data: rows[0] });
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ success:false, error:'Brand or model not found' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, price, brand_id, model_id, color, display, ram, memory } = req.body;
    const { rows } = await db.query(
      `UPDATE phones SET name=$1, price=$2, brand_id=$3, model_id=$4, color=$5, display=$6, ram=$7, memory=$8
       WHERE id=$9 RETURNING *`,
      [name, price, brand_id, model_id || null, color || null, display || null, ram || null, memory || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success:false, error:'Phone not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM phones WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success:false, error:'Phone not found' });
    res.json({ success:true, data: null });
  } catch (err) { next(err); }
};
