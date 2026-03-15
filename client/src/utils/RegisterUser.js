import axios from "axios";

export const RegisterUser = async (email, password, name) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/user/register",
      {
        email: email,
        password: password,
        name: name,
      },
      {
        withCredentials: true,
      },
    );
    return response.data.message;
  } catch (error) {
    console.error(error);
  }
};
