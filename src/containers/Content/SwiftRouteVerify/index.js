import React from "react";
// import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { Route } from "react-router-dom";
import { PrivateRoute } from "components";
import VerifyCertificate from "pages/VerifyCertificate";

const SwiftRouteVerify = () => {

  return (
    <>
      {localStorage.getItem("community") !== null &&
        <PrivateRoute
            path={`${INTERNAL_LINKS.VERIFY}/:code`}
            render={(props) => <VerifyCertificate {...props} />}
        />
      }
      {localStorage.getItem("community") === null &&
        <Route
            path={`${INTERNAL_LINKS.VERIFY}/:code`}
            render={(props) => <VerifyCertificate {...props} />}
        />
      }
    </>
  );
};

// const mapStateToProps = (state) => ({
// });

// const mapDispatchToProps = {
// };

export default SwiftRouteVerify;