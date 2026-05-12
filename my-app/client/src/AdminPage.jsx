import { useEffect, useState } from "react";
import "./AdminPage.css";
import logoutLogo from "./assets/logout-16.ico";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AdminPage() {
  const [users, setUsers] = useState([]);
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("");
 const [editId, setEditId] = useState(null);
const [editData, setEditData] = useState({ username: "", email: "", role: "" });


// icons imported from https://icons.getbootstrap.com/icons
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
</svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16">
  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg>
);

const [dark, setDark] = useState(false);

// Toggle dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);


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
 if (window.confirm("Are you sure you want to add this user?")){
  if (!username || !email || !password || !role) {
    toast.error("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("User added successfully");
      getUsers();
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
    } else {
      toast.error(data.error);
    }
  } catch (err) {
    toast.error("Server error");
  }
}
};

  // DELETE USER
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")){
    try{const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });
if(res.ok){
    getUsers();
    toast.success("User deleted successfully!");
}else{
  toast.error("failed to delete user");
}


}catch(err){
toast.error("server error");
}
   } 
  };

  // UPDATE USER
const saveEdit = async () => {
  if (window.confirm("Are you sure you want to update this user?")){
  try {

    const res = await fetch(`http://localhost:5000/api/users/${editId}`, {
    method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(editData),
    });


 const data = await res.json();
if (res.ok){ toast.success("User updated successfully"); setEditId(null); getUsers(); }
 else toast.error(data.error);
  } catch(err){ toast.error("Server error"); }
}
};

  const handleLogout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
  localStorage.removeItem("token"); 
  localStorage.removeItem("role");
  window.location.href = "/";   
  }
} 
  return (
    <div className="dashboard-container">

  <header className="dashboard-header">
    <h1>Admin Dashboard</h1>
<div className="buttons-container">
          <button className="theme-toggle-btn" onClick={() => setDark(!dark)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        
         <button onClick={handleLogout} className="logout-btn">
          <img src={logoutLogo} alt="Logout"/> Logout
       </button>
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
           value={email}
          onChange={(e) => setEmail(e.target.value)}
        
        />

        <input
          type="password"
          placeholder="Password"
           value={password}
          onChange={(e) => setPassword(e.target.value)}
        
        />

        <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="">Select Role</option>
  <option value="admin">Admin</option>
  <option value="agent">Agent</option>
  <option value="finance">Finance</option>
  <option value="cassier">Caissier</option>
</select>

        <button className="addUser" onClick={addUser}>Add User</button>

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
    <td>{editId === user.id ? <input value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})}/> : user.username}</td>
    <td>{editId === user.id ? <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})}/> : user.email}</td>
    <td>{editId === user.id 
      ? <select value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value})}>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="finance">Finance</option>
          <option value="cassier">Caissier</option>
        </select> 
      : user.role}
    </td>
    <td>
      {editId === user.id 
        ? <><button className="edit-btn" onClick={saveEdit}>Save</button><button className="delete-btn" onClick={() => setEditId(null)}>Cancel</button></>
        : <><button className="edit-btn" onClick={() => {setEditId(user.id); setEditData({username: user.username, email: user.email, role: user.role});}}>Edit</button><button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button></>
      }
    </td>
  </tr>
))}

          </tbody>

        </table>

      </div>
 <ToastContainer position="top-center" autoClose={3000} />
    </div>

  </div>

</div>
  );
  }
