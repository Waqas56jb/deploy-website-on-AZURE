const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));

// GET routes for static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// POST routes
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err) => {
    if (err) {
      console.error('Signup error:', err);
      res.status(500).send('Error signing up. Please try again.');
      return;
    }
    res.redirect('/login');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      res.status(500).send('Error logging in. Please try again.');
      return;
    }
    if (results.length > 0) {
      req.session.user = results[0];
      res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});