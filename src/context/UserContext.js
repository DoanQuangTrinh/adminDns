import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosGet } from '../utils/api';
import { isJsonString } from "utils/helpers";

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();
const DataContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    // case "LOGIN_FAILURE":
    //   return { ...state, isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const userInfoLocalStorage = localStorage.getItem("isUserShow");
  const userInfo = isJsonString(userInfoLocalStorage);
    
  const [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated:
      !!localStorage.getItem("xToken") || !!localStorage.getItem("mToken"),
    userInfo: userInfo,
  });

  const [data, setData] = React.useState([]);
  const [otherData, setOtherData] = React.useState([]);
  const userApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DOMAINS;
  const otherApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_CREATE_SUBDOMAIN;

  const fetchData = async () => {
    try {
      const response = await axiosGet(userApi);
      setData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOtherData = async () => {
    try {
      const response = await axiosGet(otherApi);
      setOtherData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchOtherData();
  }, []);

  const contextValue = {
    ...state,
    data,
    otherData,
    refetchData: fetchData,
    refetchOtherData: fetchOtherData,
  };

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        <DataContext.Provider value={contextValue}>
          {children}
        </DataContext.Provider>
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

function useDataContext() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}

async function loginUser(dispatch, token, user, isMember) {
  if (isMember) {
    localStorage.setItem("mToken", token);
  } else {
    localStorage.setItem("xToken", token);
  }
  localStorage.setItem("isUserShow", JSON.stringify(user));
  dispatch({ type: "LOGIN_SUCCESS" });
}

function signOut(dispatch, history) {
  // localStorage.removeItem("id_token");
  localStorage.clear();
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/auth/signin");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut, useDataContext };
