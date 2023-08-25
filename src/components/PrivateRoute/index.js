import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import isEmpty from "lodash/isEmpty";

import { setLoading, getUser } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { authSelector } from "redux/selectors/authSelector";

const PrivateRoute = ({
  loading,
  setLoading,
  isAuthenticated,
  userProfile,
  getUser,
  ...props
}) => {
  const redirect = INTERNAL_LINKS.LANDING_PAGUE;

  if (isAuthenticated && isEmpty(userProfile)) {
    getUser();
  }

  return isAuthenticated ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: redirect,
      }}
    />
  );
};

const mapStateToProps = (state) => ({
  loading: homeSelector(state).loading,
  userProfile: homeSelector(state).userProfile,
  isAuthenticated: authSelector(state).isAuthenticated,
});

const mapDispatchToProps = {
  setLoading,
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
