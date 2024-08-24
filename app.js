const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3600;
const rateLimit = require('express-rate-limit');
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// MySQL database connection
const db = mysql.createConnection({
    host: '50.87.*.*', // Replace with your database host
    user: 'sa',
    password: 'xxxxxx',
    database: 'xxxxx'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

app.get('/',(req,res) => {

res.send('helllo');

})

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



// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

app.post('/wait', limiter, (req, res) => {
    console.log("hello waitlist");
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).send('All fields are required');
    }

    // Input sanitization (basic)
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if the email already exists
    const checkQuery = 'SELECT * FROM waitlistsmart WHERE email = ?';
    db.query(checkQuery, [sanitizedEmail], (err, results) => {
        if (err) {
            console.error('Error checking email:', err.stack);
            return res.status(500).send('Server error, please try again later.');
        }

        if (results.length > 0) {
            return res.status(409).send('Email already exists in the waitlist.');
        }

        // Get the current date and time
        const currentDate = new Date();

        // Query to insert the data
        const insertQuery = 'INSERT INTO waitlistsmart (email, datet) VALUES (?, ?)';
        db.query(insertQuery, [sanitizedEmail, currentDate], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err.stack);
                return res.status(500).send('Error saving contact information');
            }
            res.status(200).send('Email saved successfully');
        });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
