import axios from "axios";

export const getDashboard = async () => {
  try {
    const response = await axios.get("http://localhost:3000/user/dashboard", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
