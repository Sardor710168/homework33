const db = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(`SELECT o.*, c.name as customer_name, c.phone_number
      FROM orders o JOIN customers c ON o.customer_id=c.id ORDER BY o.id DESC`);
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const orderRes = await db.query('SELECT o.*, c.name as customer_name, c.phone_number FROM orders o JOIN customers c ON o.customer_id=c.id WHERE o.id=$1', [req.params.id]);
    if (!orderRes.rows.length) return res.status(404).json({ success:false, error:'Order not found' });
    const order = orderRes.rows[0];
    const items = await db.query(`SELECT od.*, p.name as phone_name FROM order_detail od JOIN phones p ON od.phone_id=p.id WHERE od.order_id=$1`, [req.params.id]);
    order.items = items.rows;
    res.json({ success:true, data: order });
  } catch (err) { next(err); }
};

exports.getByCustomer = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE customer_id=$1 ORDER BY id DESC', [req.params.customer_id]);
    res.json({ success:true, data: rows });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { customer_id, order_date, order_status='pending', order_items } = req.body;

    const customerCheck = await client.query('SELECT id FROM customers WHERE id=$1', [customer_id]);
    if (!customerCheck.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success:false, error: 'Customer not found' });
    }

    let total_price = 0;
    const itemDetails = [];
    for (const it of order_items) {
      const phoneRes = await client.query('SELECT id, price FROM phones WHERE id=$1', [it.phone_id]);
      if (!phoneRes.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success:false, error: `Phone with id ${it.phone_id} not found` });
      }
      const unit_price = Number(phoneRes.rows[0].price);
      const quantity = Number(it.quantity);
      if (quantity <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success:false, error: 'Quantity must be > 0' });
      }
      const line_total = unit_price * quantity;
      total_price += line_total;
      itemDetails.push({ phone_id: it.phone_id, quantity, unit_price, line_total });
    }

    const orderInsert = await client.query(
      'INSERT INTO orders(customer_id, order_date, order_status, total_price) VALUES($1,$2,$3,$4) RETURNING *',
      [customer_id, order_date, order_status, total_price]
    );
    const orderId = orderInsert.rows[0].id;

    for (const it of itemDetails) {
      await client.query(
        'INSERT INTO order_detail(order_id, phone_id, quantity, unit_price, line_total) VALUES($1,$2,$3,$4,$5)',
        [orderId, it.phone_id, it.quantity, it.unit_price, it.line_total]
      );
    }

    await client.query('COMMIT');

    const created = await db.query('SELECT * FROM orders WHERE id=$1', [orderId]);
    const items = await db.query('SELECT od.*, p.name as phone_name FROM order_detail od JOIN phones p ON od.phone_id=p.id WHERE od.order_id=$1', [orderId]);
    const result = created.rows[0];
    result.items = items.rows;
    res.status(201).json({ success:true, data: result });
  } catch (err) {
    await client.query('ROLLBACK').catch(e=>console.error(e));
    next(err);
  } finally {
    client.release();
  }
};

exports.update = async (req, res, next) => {
  try {
    // for simplicity only allow status or other fields update (not items) — can be extended
    const { order_status } = req.body;
    const { rows } = await db.query('UPDATE orders SET order_status=COALESCE($1, order_status) WHERE id=$2 RETURNING *', [order_status || null, req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Order not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { order_status } = req.body;
    const { rows } = await db.query('UPDATE orders SET order_status=$1 WHERE id=$2 RETURNING *', [order_status, req.params.id]);
    if (!rows.length) return res.status(404).json({ success:false, error:'Order not found' });
    res.json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success:false, error:'Order not found' });
    res.json({ success:true, data: null });
  } catch (err) { next(err); }
};
