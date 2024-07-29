const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        amount REAL,
        description TEXT,
        date TEXT,
        running_balance REAL
    )`);
});

// API endpoints
app.get('/', (req, res) => {
    res.send('Artists Company API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



// Add a new transaction
app.post('/transactions', (req, res) => {
    const { type, amount, description, date } = req.body;
    db.run(`INSERT INTO transactions (type, amount, description, date, running_balance) VALUES (?, ?, ?, ?, ?)`, 
    [type, amount, description, date, amount], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Get all transactions
app.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update transaction
app.put('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;
    db.run(`UPDATE transactions SET type = ?, amount = ?, description = ?, date = ? WHERE id = ?`, 
    [type, amount, description, date, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});


