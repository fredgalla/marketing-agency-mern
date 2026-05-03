import { useState } from "react";

function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("adminToken", data.token);
          setToken(data.token);
          loadSubmissions(data.token);
        } else {
          setMessage("Incorrect password.");
        }
      })
      .catch(() => {
        setMessage("Login failed.");
      });
  }

  function loadSubmissions(authToken) {
    fetch("http://localhost:3000/submissions", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setSubmissions(data);
      })
      .catch(() => {
        setMessage("Failed to load submissions.");
      });
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setToken("");
    setSubmissions([]);
  }

  function handleDelete(id) {
    fetch(`http://localhost:3000/submissions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(() => {
        setSubmissions(submissions.filter(item => item._id !== id));
      })
      .catch(() => {
        setMessage("Delete failed.");
      });
  }

  if (!token) {
    return (
      <section className="admin">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>{message}</p>
      </section>
    );
  }

  return (
    <section className="admin">
      <h2>Submissions</h2>

      <button onClick={handleLogout}>Logout</button>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((item) => (
          <div key={item._id} className="submission-card">
            <h3>{item.name}</h3>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Message:</strong> {item.message}</p>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))
      )}
    </section>
  );
}

export default Admin;