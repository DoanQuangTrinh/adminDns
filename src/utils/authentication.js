import { isJsonString } from "./helpers";

export const checkLogin = () => {
    return localStorage.getItem("xToken") || localStorage.getItem("mToken")
      ? true
      : false;
};
export const login = (token, data, isMember = false) => {
    if (isMember) {
        localStorage.setItem("mToken", token);
    } else {
        localStorage.setItem("xToken", token);
    }
    localStorage.setItem('isUserShow', JSON.stringify(data));
};
export const logout = () => {
    localStorage.removeItem('xToken');
    localStorage.removeItem('mToken');
    localStorage.removeItem("isUserShow");
};

export const getToken = () => {
    return localStorage.getItem('xToken');
};

export const getMemberToken = () => {
    return localStorage.getItem('mToken');
};

export const getUserShow = () => {
    const userInfoLocalStorage = localStorage.getItem("isUserShow");
    const userInfo = isJsonString(userInfoLocalStorage);
    
    return userInfo;
};
