import axios from "axios";
export const updateProfile = async (data) => {
  try {
    const response = await axios.put(
      "http://localhost:3000/user/update",
      data,
      {
        withCredentials: true,
      },
    );
    return response;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};
