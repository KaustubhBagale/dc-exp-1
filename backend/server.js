require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});


app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});


app.post("/tasks", (req, res) => {
  const { title, description } = req.body; // Ensure 'des' is used

  console.log("Received a POST request to /tasks");
  console.log("Request Body:", req.body);

  if (!title || !description) {
    console.log("Missing title or description");
    return res.status(400).json({ error: "Title and description are required" });
  }

  const query = "INSERT INTO tasks (title, description) VALUES (?, ?)"; 
  db.query(query, [title, description], (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res.status(500).json({ error: "Failed to add task" });
    }
    console.log("Task successfully inserted:", { id: result.insertId, title, description });
    res.json({ id: result.insertId, title, description });
  });
});


app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Task deleted" });
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
