import React from "react";
// import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { Route } from "react-router-dom";
import { Sidebar } from "components";

const VerifyCertificateSwiftSider = () => {

  return (
    <>
      {localStorage.getItem("community") !== null &&
        <Route
            path={`${INTERNAL_LINKS.VERIFY}/:code`}
            render={(props) => <Sidebar {...props} />}
        />
      }
      
    </>
  );
};

// const mapStateToProps = (state) => ({
// });

// const mapDispatchToProps = {
// };

export default VerifyCertificateSwiftSider;