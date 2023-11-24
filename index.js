const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
require('console-stamp')(console, '[HH:MM:ss.l]');
const { logId } = require('./utils');

// Create the server
const app = express()

dotenv.config();

// Connect to database
mongoose.connect(
  process.env.DB_CONNECT, 
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.info('Connected to DB')
);
  
var store = new MongoDBStore({
  uri: process.env.DB_CONNECT,
  collection: 'sessions'
});
  
app.use((req, res, next) => {
  const url = req.url;
  console.info(req.method, url);
  res.on("finish", () => {
    console.info("END", req.method, url);
  });
  next();
});

  // Middlewares
app.use(express.json())
app.use(cors({
  credentials: true
}))

app.use(session({
  name: 'sessionId',
  secret: 'matija',
  resave: false,
  saveUninitialized: false,
  store: store,
}))

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))

// Add auth routes
const authRoutes = require('./routes/auth').router;
const materialRoutes = require('./routes/materials');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/orders');
const settingRoutes = require('./routes/settings');
const statisticRoutes = require('./routes/statistics');
const clientRoutes = require('./routes/clients');
const { requestEndedLog } = require('./utils');

app.use('/api', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/setting', settingRoutes);
app.use('/api/statistic', statisticRoutes);
app.use('/api/client', clientRoutes);

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// Choose the port and start the server
const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})