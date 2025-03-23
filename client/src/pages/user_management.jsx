import React, { useEffect, useState } from "react";
import "../assets/css/usermanage.css";
import UserManagePopup from "../components/usermanage.jsx";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../context/adminauth.jsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Added role to formData
  });
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let success;

      if (editingId) {
        success = await updateUser(editingId, formData);
      } else {
        success = await createUser(formData);
      }

      if (success) {
        setFormData({ username: "", email: "", password: "", role: "" });
        setEditingId(null);
        setShowPopup(false);
        loadUsers();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const success = await deleteUser(id);
      if (success) {
        loadUsers();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowPopup(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ username: "", email: "", password: "", role: "" });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingId(null);
    setFormData({ username: "", email: "", password: "", role: "" });
  };

  return (
    <div>
      <div className="header">
        <h1>User Management</h1>
        <div className="button-group">
          <button className="add_button" onClick={handleAdd}>
            <span>+</span> Add New User
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user_manage_page">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th className="button">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="button">
                      <button
                        className="edit-icon"
                        onClick={() => handleEdit(user)}
                      >
                        ⚙️
                      </button>
                      <button
                        className="delete-icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserManagePopup
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              editingId={editingId}
              loading={loading}
              onClose={closePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
