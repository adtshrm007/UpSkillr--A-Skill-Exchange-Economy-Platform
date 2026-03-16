import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/user/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
