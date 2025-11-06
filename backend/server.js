const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to database');
});

// Root endpoint để test
app.get('/', (req, res) => {
    res.json({ message: 'Student Grades API is running!', status: 'OK' });
});

// API 1: Lấy tất cả điểm
app.get('/api/grades', (req, res) => {
    console.log('📥 GET /api/grades called');
    const query = 'SELECT * FROM grades ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Query error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('✅ Returning', results.length, 'records');
        res.json(results);
    });
});

// API 2: Thêm điểm mới
app.post('/api/grades', (req, res) => {
    console.log('📥 POST /api/grades called with:', req.body);
    const { student_name, subject, grade } = req.body;
    const query = 'INSERT INTO grades (student_name, subject, grade) VALUES (?, ?, ?)';
    
    db.query(query, [student_name, subject, grade], (err, result) => {
        if (err) {
            console.error('❌ Insert error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('✅ Grade added successfully, ID:', result.insertId);
        res.json({ message: 'Grade added successfully', id: result.insertId });
    });
});

// API 3: Thống kê
app.get('/api/stats', (req, res) => {
    console.log('📥 GET /api/stats called');
    const query = `
        SELECT 
            COUNT(*) as total_records,
            AVG(grade) as average_grade,
            MAX(grade) as highest_grade,
            MIN(grade) as lowest_grade
        FROM grades
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Stats query error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('✅ Stats returned');
        res.json(results[0]);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 API endpoints:`);
    console.log(`   - GET  /api/grades`);
    console.log(`   - POST /api/grades`);
    console.log(`   - GET  /api/stats`);
});