export const fetchUsers = async () => {
  try {
    const response = await fetch(
      "https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(
      "https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(
      `https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(
      `https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users/${id}`,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
