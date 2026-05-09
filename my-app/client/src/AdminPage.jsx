import { useEffect, useState } from "react";
import "./AdminPage.css";
export default function AdminPage() {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  // GET USERS
  const getUsers = async () => {
    const response = await fetch("http://localhost:5000/api/users");

    const data = await response.json();

    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ADD USER
  const addUser = async () => {
    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    getUsers();

    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
    });
  };

  // DELETE USER
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    getUsers();
  };

  // UPDATE USER
  const updateUser = async (id) => {
    const username = prompt("New username");

    if (!username) return;

    await fetch(`http://localhost:5000/api//users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email: "updated@gmail.com",
        role: "user",
      }),
    });

    getUsers();
  };

  return (
    <div className="dashboard-container">

  <header className="dashboard-header">
    <h1>Admin Dashboard</h1>

    <div className="header-buttons">
      <button className="theme-btn">🌙</button>
      <button className="logout-btn">Logout</button>
    </div>
  </header>


  <div className="dashboard-content">

    <div className="table-section">

      <h2>USERS MANAGEMENT</h2>

      {/* ADD USER */}

      <div className="add-user-form">

        <input
          type="text"
          placeholder="Username"
        />

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <input
          type="text"
          placeholder="Role"
        />

        <button>Add User</button>

      </div>


      {/* USERS TABLE */}

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.username}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>

                  <button className="edit-btn">
                    Edit
                  </button>

                  <button className="delete-btn">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  </div>

</div>
  );
}