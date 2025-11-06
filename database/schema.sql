CREATE DATABASE IF NOT EXISTS student_grades;
USE student_grades;

CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100),
    subject VARCHAR(100),
    grade DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO grades (student_name, subject, grade) VALUES
('Alice', 'Math', 95.50),
('Bob', 'Science', 88.00),
('Charlie', 'History', 92.75);