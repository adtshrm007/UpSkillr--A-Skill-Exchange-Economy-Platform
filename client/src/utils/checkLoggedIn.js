import axios from "axios";

export const checkLoggedIn = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/user/checkLoggedIn",
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
