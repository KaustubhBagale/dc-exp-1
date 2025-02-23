import React, { useState, useEffect } from "react";
import "./App.css"; 

const BACKEND_URL = "http://backend_device_ip:5000"; // replace with backend ip

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [showTasks, setShowTasks] = useState(false); 

  useEffect(() => {
    fetch(`${BACKEND_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = () => {
    fetch(`${BACKEND_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTask({ title: "", description: "" });
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  const fetchTasks = () => {
    fetch(`${BACKEND_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const deleteTask = (id) => {
    fetch(`${BACKEND_URL}/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div className="container">
      <h1 className="title">Add and View Tasks</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
        <button className="view-tasks-btn" onClick={fetchTasks}>View Tasks</button>
      </div>

      {showTasks && (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
