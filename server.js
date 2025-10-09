const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const brandRoutes = require('./routes/brandRoutes');
const modelRoutes = require('./routes/modelRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
