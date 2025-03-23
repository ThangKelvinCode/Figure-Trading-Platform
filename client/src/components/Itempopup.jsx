import React, { useEffect, useState } from "react";
import {
  Id,
  getowner,
  handlechange,
  handledrag,
  handledrop,
  handlesubmit,
} from "../context/ItemController";

const Itempopup = () => {
  const [itemData, setItemData] = useState({
    id: "",
    name: "",
    owner: "",
    image: null,
  });

  useEffect(() => {
    setItemData((prev) => ({ ...prev, id: Id() }));
  }, []);

  useEffect(() => {
    setItemData((prev) => ({ ...prev, owner: getowner() }));
  }, []);

  return (
    <div className="item-popup">
      <div
        className="drop-zone"
        onDrop={(e) => handledrop(e, setItemData)}
        onDragOver={handledrag}
      >
        {itemData.image ? (
          <img
            src={URL.createObjectURL(itemData.image)}
            alt="Preview"
            className="preview-image"
          />
        ) : (
          <span>Drop IMG</span>
        )}
      </div>

      <form onSubmit={(e) => handlesubmit(e, itemData)}>
        <div className="form-group">
          <label>Product ID</label>
          <input type="text" value={itemData.id} readOnly />
        </div>

        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            value={itemData.name}
            onChange={(e) => handlechange(e, setItemData)}
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label>Owner</label>
          <input type="text" value={itemData.owner} readOnly />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="text"
            value={itemData.image ? itemData.image.name : ""}
            readOnly
          />
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Itempopup;
