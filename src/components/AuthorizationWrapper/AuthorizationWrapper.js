import { isJsonString } from "utils/helpers";

/**
 *
 * WithAuthorization
 *
 */
function AuthorizationWrapper({
  children,
  allowedRoles,
  disabled = false,
}) {
  const userInfoLocalStorage = localStorage.getItem("isUserShow");
  const user = isJsonString(userInfoLocalStorage);

  const userRoles = user?.role || [];
  const hasRole = (allowedRoles || []).some((role) => userRoles.includes(role));
  
  if (user?.level === "1" || hasRole || (!allowedRoles && !userRoles.length)) {
    return children;
  } else {
    if (disabled) {
      return children;
    }
    return null;
  }
}

export default AuthorizationWrapper;
