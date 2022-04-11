import axios from "axios";

export default axios.create({
  baseURL: "https://xcziro00-bp-server.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
  },
});
