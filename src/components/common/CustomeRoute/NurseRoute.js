import React from "react";
import { Route, Redirect } from "react-router-dom";
import Page403 from "views/errors/Page403";

function DoctorRoute({ role, component: Component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        // 권한 체크
        if (role === "ROLE_NURSE" || role === "ROLE_DOCTOR" || role === "ROLE_MASTER") {
          return <Component {...props} role={role} />
        }
        else{
          return <Page403 />
        }
      }}
    />
  );
}

export default DoctorRoute;