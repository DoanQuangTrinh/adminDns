import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js"; // Chakra imports
import { ChakraProvider } from "@chakra-ui/react";
// Custom Chakra theme
import theme from "theme/theme.js";
import { UserProvider } from "context/UserContext";
import "./styles/globals.css";
import "@trendmicro/react-paginations/dist/react-paginations.css";


ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <UserProvider>
      <HashRouter>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <Route path={`/admin`} component={AdminLayout} />
          <Route path={`/rtl`} component={RTLLayout} />
          <Redirect from={`/`} to="/admin" />
        </Switch>
      </HashRouter>
    </UserProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
