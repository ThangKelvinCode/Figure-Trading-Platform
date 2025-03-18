import React from "react";

const accessory_management = () => {
  return (
    <div>
      <div className="header">
        <h1>Accessory Management</h1>
        <div className="button-group">
          <button className="add_button">
            <span>+</span> New Accessory
          </button>
        </div>
      </div>
      <div className="user_manage_page">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th className="button">Action</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default accessory_management;
