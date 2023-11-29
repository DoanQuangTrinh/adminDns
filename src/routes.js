// import
import React, { Component } from "react";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import User from "views/Dashboard/User/User";
import Domain from "views/Dashboard/Domain/Domain";
import CreateDomainForm from "views/createDomain";

import { StatsIcon, PersonIcon } from "components/Icons/Icons";
import { Roles } from "utils/constant";
import Team from "views/Dashboard/Team/Team";

var dashRoutes = [
  {
    path: "/user",
    name: "User",
    icon: <StatsIcon color="inherit" />,
    component: User,
    layout: "/admin",
    role: [Roles.ADMIN],
  },
  {
    path: "/create",
    name: "create",
    icon: <StatsIcon color="inherit" />,
    component: CreateDomainForm,
    layout: "/admin",
    role: [Roles.ADMIN],
  },
  {
    path: "/domain",
    name: "Domain",
    icon: <StatsIcon color="inherit" />,
    component: Domain,
    layout: "/admin",
    role: [Roles.ADMIN],
  },
  {
    path: "/teams",
    name: "Teams",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color="inherit" />,
    component: Team,
    layout: "/admin",
    role: [Roles.ADMIN, Roles.USER],
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
        role: [Roles.ADMIN, Roles.USER, Roles.GUEST],
      },
      {
        path: "/signin",
        name: "Sign In",
        component: SignIn,
        layout: "/auth",
        icon: <PersonIcon color="inherit" />,
      },
    ],
  },
];
export default dashRoutes;
