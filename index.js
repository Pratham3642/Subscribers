const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prathamesh31',
    database: 'email_subscriptions'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        throw err;
    }
    console.log('MySQL connected...');
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'prathameshmavalkar34@gmail.com',
        pass: 'dtnl ltfr jipd llri'
    }
});

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

app.post("/save", (req, res) => {
    const email = req.body.email;

    if (!validateEmail(email)) {
        console.error('Invalid email format:', email);
        return res.status(400).send('Invalid email format');
    }

    // Check if email already exists
    const checkSql = "SELECT email FROM subscribers WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error('Database query error during existence check:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
            console.error('Email already subscribed:', email);
            return res.status(400).send('Email already subscribed');
        }

        // Insert email into database
        const sql = "INSERT INTO subscribers (email) VALUES (?)";
        db.query(sql, [email], (err, result) => {
            if (err) {
                console.error('Database query error during insert:', err);
                return res.status(500).send('Database query error');
            }

            // Send confirmation email
            const mailOptions = {
                from: 'prathameshmavalkar34@gmail.com',
                to: email,
                subject: 'Subscription Confirmation',
                text: 'You have successfully subscribed!'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email sending error:', error);
                    return res.status(500).send('Email sending error');
                }
                res.status(200).send('Subscribed Successfully');
            });
        });
    });
});

app.delete("/unsave", (req, res) => {
    const email = req.body.email;

    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email format');
    }

    // Check if email exists before trying to delete
    const checkSql = "SELECT email FROM subscribers WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error('Database query error during existence check:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            console.error('Email not found for unsubscription:', email);
            return res.status(404).send('Email not found');
        }

        // Delete email from database
        const sql = "DELETE FROM subscribers WHERE email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) {
                console.error('Database query error during delete:', err);
                return res.status(500).send('Database query error');
            }

            // Send unsubscription email
            const mailOptions = {
                from: 'prathameshmavalkar34@gmail.com',
                to: email,
                subject: 'Unsubscription Confirmation',
                text: 'You have successfully unsubscribed!'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email sending error:', error);
                    return res.status(500).send('Email sending error');
                }
                res.status(200).send('Unsubscribed Successfully');
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Server ready to serve @ 3000');
});
