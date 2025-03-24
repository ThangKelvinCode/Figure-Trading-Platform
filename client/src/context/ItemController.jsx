export const Id = () => {
  return Math.random().toString(36).substr(2, 9); // Simple random ID
};

export const getowner = () => {
  // Replace with actual session logic
  const userSession = { username: "currentUser" }; // Mock session
  return userSession.username || "Unknown";
};

export const handledrop = (event, setItemData) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    setItemData((prev) => ({ ...prev, image: file }));
  } else {
    alert("Please drop a valid image file.");
  }
};

export const handledrag = (event) => {
  event.preventDefault();
};

export const handlechange = (e, setItemData) => {
  const { name, value } = e.target;
  setItemData((prev) => ({ ...prev, [name]: value }));
};

export const handlesubmit = (e, itemData) => {
  e.preventDefault();
  console.log("Item Data:", itemData);
  // Add your submission logic here (e.g., API call)
};
