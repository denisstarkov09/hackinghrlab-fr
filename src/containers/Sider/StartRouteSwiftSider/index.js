import React from "react";
import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { Sidebar } from "components";
import { Route } from "react-router-dom";
import { channelSelector } from "redux/selectors/channelSelector";

const StartRouteSwiftSider = ({ 
  bulChannelPage,
}) => {

    return (
      <>
        {bulChannelPage === "channel" && localStorage.getItem("community") !== null &&
            <Route
                path={`${INTERNAL_LINKS.CHANNEL_PAGE}/:name`}
                exact
                render={() => <Sidebar />}
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

export default connect(mapStateToProps, mapDispatchToProps)(StartRouteSwiftSider);