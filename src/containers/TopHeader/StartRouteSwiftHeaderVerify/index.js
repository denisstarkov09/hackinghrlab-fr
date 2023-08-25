import React from "react";
// import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { Route } from "react-router-dom";
import { PublicHeader, MainHeader } from "components";

const StartRouteSwiftHeaderVerify = () => {

  return (
    <>
      {localStorage.getItem("community") === null &&
        <Route
            path={`${INTERNAL_LINKS.VERIFY}/:code`}
            render={(props) => <PublicHeader {...props} />}
        />
      }
      {localStorage.getItem("community") !== null &&
        <Route
            path={`${INTERNAL_LINKS.VERIFY}/:code`}
            render={(props) => <MainHeader {...props} />}
        />
      }
      
    </>
  );
};

// const mapStateToProps = (state) => ({
// });

// const mapDispatchToProps = {
// };

export default StartRouteSwiftHeaderVerify;