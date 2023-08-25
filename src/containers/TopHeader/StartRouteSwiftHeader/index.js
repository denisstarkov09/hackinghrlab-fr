import React from "react";
import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { Route } from "react-router-dom";
import { PublicHeader, MainHeader } from "components";
import { channelSelector } from "redux/selectors/channelSelector";

const StartRouteSwiftHeader = ({ 
  bulChannelPage,
}) => {

  return (
    <>
      {bulChannelPage === "channel" && localStorage.getItem("community") === null &&
          <Route
              path={`${INTERNAL_LINKS.CHANNEL_PAGE}/:name`}
              exact
              render={(props) => <PublicHeader bulChannelPage={bulChannelPage} {...props} />}
          />
      }
      {bulChannelPage === "channel" && localStorage.getItem("community") !== null &&
          <Route
              path={`${INTERNAL_LINKS.CHANNEL_PAGE}/:name`}
              exact
              render={(props) => <MainHeader {...props} />}
          />
      }
      {bulChannelPage === "event" &&
          <Route
              exact
              path={`${INTERNAL_LINKS.PUBLIC_EVENT}/:id`}
              render={(props) => <PublicHeader bulChannelPage={bulChannelPage} {...props} />}
          />
      }
      
    </>
  );
};

const mapStateToProps = (state) => ({
    bulChannelPage: channelSelector(state).bulChannelPage,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(StartRouteSwiftHeader);