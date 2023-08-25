import React from "react";

import "./style.scss";

const AuthAlert = ({ title = "", message = "" }) => {
  return (
    <div className="auth-alert">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};
export default AuthAlert;
