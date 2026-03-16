import axios from "axios";

export const findMatches = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/matches/getMatches",
      {
        withCredentials:true
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
