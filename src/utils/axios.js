import axios from "axios";
const { getToken, logout, getMemberToken } = require("./authentication");
export const createService = (baseURL, contentType, headers = null) => {
  return interceptAuth(baseConfig(baseURL, contentType, headers));
};

const baseConfig = (
  baseURL,
  contentType = "application/json",
  headers = null
) => {
  return {
    baseURL,
    headers: {
      "Content-Type": contentType,
      ...headers,
    },
  };
};

const interceptAuth = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((cf) => {
    const token = getToken();
    const memberToken = getMemberToken();
    if (token && cf?.headers) {
      cf.headers["xToken"] = token;
    } else if (memberToken && cf?.headers) {
      cf.headers["mToken"] = memberToken;
    }
    return cf;
  });
  instance.interceptors.response.use(
    (response) => {
      // Do something with response data
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
      }
      // Do something with response error
      return Promise.reject(error);
    }
  );
  return instance;
};
axios.interceptors.request.use((cf) => {
  const token = getToken();
  const memberToken = getMemberToken();
  //   console.log("token", token);
  //   console.log("memberToken", memberToken);
  if (token && cf?.headers) {
    cf.headers["xToken"] = token;
  } else if (memberToken && cf?.headers) {
    cf.headers["mToken"] = memberToken;
  }
  return cf;
});

axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 401) {
      logout();
      window.location.href = "/";
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
