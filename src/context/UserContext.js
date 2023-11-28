import React from "react";
import { isJsonString } from "utils/helpers";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();


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
    
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated:
      !!localStorage.getItem("xToken") || !!localStorage.getItem("mToken"),
    userInfo: userInfo,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };


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