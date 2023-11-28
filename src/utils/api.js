import axios from "utils/axios";
// import { getToken, getMemberToken } from "./authentication";

export const axiosPost = async (url, data, additionalHeaders = null) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
    data: data,
  };

  return await axios.request(config)
};

export const axiosGet = async (url) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await axios.request(config);

};
