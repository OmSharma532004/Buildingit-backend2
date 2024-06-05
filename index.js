const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require("cookie-parser");


const app = express();
dotenv.config();

// Passport setup
require('./passport.js');

// Middleware
app.use(cookieParser());
app.use(fileUpload());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(session({
  secret: 'Hi',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/auth');
const getMaterialRoutes = require('./routes/getMaterial');
const materialAdditionRoutes = require('./routes/MaterialAddition');
const mailSendRoutes = require('./routes/mailSend');
const superAdminRoutes = require('./routes/superAdmin');

app.use('/api', userRoutes);
app.use('/api', fileRoutes);
app.use('/api', authRoutes);
app.use('/api', getMaterialRoutes);
app.use('/api', materialAdditionRoutes);
app.use('/api', mailSendRoutes);
app.use('/api', superAdminRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
