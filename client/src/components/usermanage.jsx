import React from "react";

const UserManagePopup = ({
  formData,
  handleInputChange,
  handleSubmit,
  editingId,
  loading,
  onClose,
}) => {
  return (
    <div className="user-manage-popup">
      <h2>{editingId ? "Edit User" : "Add User"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="">Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          required={!editingId} // Password chỉ bắt buộc khi tạo mới
        />
        <button type="submit" disabled={loading}>
          {editingId ? "Update" : "Add"} User
        </button>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserManagePopup;
