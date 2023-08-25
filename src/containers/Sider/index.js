import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
// Sider
import { Sidebar, PrivateRoute } from "components";
import StartRouteSwiftSider from "./StartRouteSwiftSider"
import VerifyCertificateSwiftSider from "./VerifyCertificateSwiftSider";
// Enum
import { INTERNAL_LINKS } from "enum";

class Sider extends Component {
  render() {
    return (
      <Switch>
        <PrivateRoute
          path={INTERNAL_LINKS.HOME}
          exact
          render={() => <Sidebar />}
        />
        <Route path={INTERNAL_LINKS.LANDING_PAGUE} />
        <Route path={INTERNAL_LINKS.LOGIN} />
        <Route path={INTERNAL_LINKS.CREATORS} />
        <Route path={INTERNAL_LINKS.BLOGS_PAGUE}/>
        <Route path={INTERNAL_LINKS.SIGNUP} />
        <PrivateRoute path={INTERNAL_LINKS.HEART} render={() => <Sidebar />} />
        <PrivateRoute
          path={INTERNAL_LINKS.LEARNING_LIBRARY}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.CLASSES}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.MICRO_CLASS}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.BONFIRES}
          render={() => <Sidebar />}
        />
        <PrivateRoute path={INTERNAL_LINKS.EVENTS} render={() => <Sidebar />} />
        <PrivateRoute
          path={INTERNAL_LINKS.CHANNELS}
          exact
          render={() => <Sidebar />}
        />

        <PrivateRoute
          path={`${INTERNAL_LINKS.CHANNELS}/:id`}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.COUNCIL}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.COUNCIL}/resource`}
          render={() => <Sidebar />}
        />
        <PrivateRoute 
          path={`${INTERNAL_LINKS.EVENTS_COUNCIL}`}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.COUNCIL_ADMIN}
          render={(props) => <Sidebar {...props} />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.BUSINESS_PARTNER}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.BUSINESS_PARTNER}/resource`}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.CERTIFICATIONS}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.JOURNEY}
          render={() => <Sidebar />}
        />
        <PrivateRoute path={INTERNAL_LINKS.HUB} render={() => <Sidebar />} />
        <PrivateRoute
          path={INTERNAL_LINKS.NOTIFICATIONS}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.PODCAST}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.FAVORITES}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.READ_LATER}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.MARKETPLACE}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.CONFERENCE_LIBRARY}
          render={() => <Sidebar />}
        />
        {/* <PrivateRoute
          path={INTERNAL_LINKS.GLOBAL_CONFERENCE}
          render={() => <Sidebar />}
        /> */}
        <PrivateRoute
          path={`${INTERNAL_LINKS.MICRO_CONFERENCE}/:id`}
          render={(props) => <Sidebar {...props} />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.SPEAKERS}`}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.PARTICIPANTS}/:idConference`}
          render={() => <Sidebar />}
        />
        <PrivateRoute path={INTERNAL_LINKS.LIVE} render={() => <Sidebar />} />
        <PrivateRoute
          path={INTERNAL_LINKS.PODCAST_SERIES}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.SPEAKER_2023}
          render={() => <Sidebar />}
        />
        <PrivateRoute path={INTERNAL_LINKS.POST} render={() => <Sidebar />} />
        <PrivateRoute
          path={INTERNAL_LINKS.LIBRARY_ITEM}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.PROJECTX}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.MY_LEARNINGS}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.SPONSOR_DASHBOARD}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.TALENT_MARKETPLACE}
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.AD_HOME_PREVIEW}/:id`}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.AD_CONFERENCE_LIBRARY_PREVIEW}/:id`}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.AD_EVENTS_PREVIEW}/:id`}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.AD_PROJECT_X_PREVIEW}/:id`}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={INTERNAL_LINKS.SEARCH}
          exact
          render={() => <Sidebar />}
        />

        <PrivateRoute
          path={`${INTERNAL_LINKS.CHANNELS}/:id${INTERNAL_LINKS.BLOGS}/:id`}
          exact
          render={() => <Sidebar />}
        />

        <PrivateRoute
          path={INTERNAL_LINKS.BLOGS}
          exact
          render={() => <Sidebar />}
        />
        <PrivateRoute
          path={`${INTERNAL_LINKS.BLOGS}/:id`}
          exact
          render={() => <Sidebar />}
        />

        <PrivateRoute
          path={`${INTERNAL_LINKS.SIMULATION_SPRINTS}`}
          exact
          render={() => <Sidebar />}
        />

        <PrivateRoute
          path={`${INTERNAL_LINKS.SIMULATION_SPRINTS}/:id`}
          render={() => <Sidebar />}
        />
        <Route
          exact
          path={`${INTERNAL_LINKS.VERIFY}/:code`}
          render={(props) => <VerifyCertificateSwiftSider {...props} />}
        />
        <Route
          exact
          path={"/:data"}
          render={(props) => <StartRouteSwiftSider {...props} />}
        />
      </Switch>
    );
  }
}

export default Sider;
