import axios from "axios";
import storage from "store";

const community = storage.get("community");

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
if (community) {
  axios.defaults.headers.common.Authorization = `Bearer ${community.accessToken}`;
}

export default axios;
