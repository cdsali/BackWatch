const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3600;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://smart-v2.vercel.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
// MySQL database connection
const db = mysql.createConnection({
    host: '50.87.145.190', // Replace with your database host
    user: 'sastana3_sas',
    password: 'thJ..$!axP4z',
    database: 'sastana3_website1'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// Route to handle contact form submission
app.post('/contact', (req, res) => {
    console.log("hello is me");
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO Contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.stack);
            return res.status(500).send('Error saving contact information');
        }
        res.status(200).send('Contact information saved successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
