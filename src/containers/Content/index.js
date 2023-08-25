import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import { connect } from "react-redux";
import ReactGA from "react-ga";

// Pages
import HomePage from "pages/Home";
import Conference2023 from "pages/Conference2023";
import CouncilPage from "pages/Council";
import CouncilPageAdmin from "pages/CouncilAdmin";
import CouncilEvents from "pages/CouncilEvent";
import Speakers2023 from "pages/Speakers2023";
import LoginPage from "pages/Login";
import SignupPage from "pages/Signup";
import PasswordRecoveryPage from "pages/PasswordRecovery";
import ResetPasswordPage from "pages/ResetPassword";
import HEARTPage from "pages/Heart";
import LearningLibraryPage from "pages/Library";
import ArticlePage from "pages/Article";
import FavouritePage from "pages/Favourites";
import EventsPage from "pages/Events";
import PodcastPage from "pages/Podcast";
import MentoringPage from "pages/Mentoring";
import StartRouteSwift from "./StartRouteSwift"
import CertificatePage from "pages/Certificate";
import MicroClassCertificatePage from "pages/MicroClassCertificate";
import ClassesPage from "pages/Classes";
import MicroClassPage from "pages/MicroClass";
import JourneyPage from "pages/Journey";
import TermsOfUsePage from "pages/TermsOfUSe";
// import MarketplacePage from "pages/Marketplace";
import NoPageFound from "pages/NoPageFound";
import ConferenceLibrary from "pages/ConferenceLibrary";
import ChannelsPage from "pages/Channels";
import NotificationPage from "pages/Notification";
import GlobalConferencePage from "pages/GlobalConference";
import MicroConferencePage from "pages/MicroConference";
import GlobalConferenceSpeakersPage from "pages/GlobalConference/Speakers";
import GlobalConferenceParticipantsPage from "pages/GlobalConference/Participants";
import GlobalConferencePartnersPage from "pages/GlobalConference/Partners";
import GlobalConferenceBonfiressPage from "pages/Bonfires";
import GlobalConferencePersonalAgendaPage from "pages/GlobalConference/PersonalAgenda";
import GlobalConferenceLeaderboardPage from "pages/GlobalConference/ConferenceLeaderboard";
import SpeakersPage from "pages/Speakers";
import ParticipantsPage from "pages/Participants";
import LivePage from "pages/Live";
import PodcastSeriesPage from "pages/PodcastSeries";
import PodcastSeriesDetailPage from "pages/PodcastSeriesDetail";
import PostPage from "pages/Post";
import LibraryItemPage from "pages/LibraryItem";
import SkillCohortPage from "pages/SkillCohort";
import SkillCohortDetailPage from "pages/SkillCohortDetail";
import SkillCohortResourcePage from "pages/SkillCohortResources";
import MyLearningPage from "pages/Learnings";
import CouncilConversationsCard from "pages/Council/CouncilConversationsCard";
import SponsorDashboardPage from "pages/SponsorDashboard";
import ConfirmMail from "pages/ConfirmMail";
import BusinessPartnerPage from "pages/BusinessPartner";
import BusinessPartnerConversationCard from "pages/BusinessPartner/BusinessPartnerConversationCard";
import TalentMarketplacePage from "pages/TalentMarketplace";
import JobPostDetailsPage from "pages/TalentMarketplace/JobBoard/JobPostDetails";
import EventCertificatePage from "pages/EventCertificate/ShareCertificate";
import SearchPage from "pages/Search";
import BlogsPage from "pages/Blogs";
import BlogPage from "pages/Blog";
import CommunititesPage from "pages/Communities";
import BonfiresPage from "pages/Bonfires";
import LandingPague from "pages/LandingPague";
import CreatorsPague from "pages/CreatorsPague"
// import SimulationSprintsPage from "pages/SimulationSprints";
// import SimulationSprintPage from "pages/SimulationSprint";
// import SimulationSprintDashboardPage from "pages/SimulationSprintDashboard";
import SwiftRouteVerify from "./SwiftRouteVerify"; 
import BlogsLanding from "pages/BlogsLanding";

// Enum
import { INTERNAL_LINKS } from "enum";

import { PrivateRoute } from "components";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { injectIntl } from "react-intl";

import { homeSelector } from "redux/selectors/homeSelector";

class Content extends Component {
  componentDidMount() {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);
    this.props.history
      .listen((location) => {
        ReactGA.pageview(location.pathname);
      })
      .bind(this);
  }

  render() {
    return (
      <Layout.Content style={{ overflow: "hidden" }}>
        <Switch>
          <PrivateRoute
            path={INTERNAL_LINKS.HOME}
            exact
            render={(props) => <HomePage {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.CREATORS}
            exact
            render={(props) => <CreatorsPague {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.BLOGS_PAGUE}
            exact
            render={(props) => <BlogsLanding {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.LANDING_PAGUE}
            render={(props) => <LandingPague {...props} />}
          />
          <Route
            exact
            path={INTERNAL_LINKS.LOGIN}
            render={(props) => <LoginPage {...props} />}
          />
          <Route
            path={`${INTERNAL_LINKS.LOGIN}/:sentEmail`}
            render={(props) => <LoginPage {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.JOIN}
            render={(props) => <LoginPage signup={true} {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.SIGNUP}
            render={(props) => <SignupPage {...props} />}
          />
          <Route
            path={`${INTERNAL_LINKS.CONFERENCE_2023}/:data`}
            render={(props) => <Conference2023 {...props} />}
          />
          <Route
            path={`${INTERNAL_LINKS.CONFERENCE_2023}`}
            render={(props) => <Conference2023 {...props} />}
          />
          <Route
            exact
            path={`${INTERNAL_LINKS.INVITATION}/:hostUserId/:email`}
            render={(props) => (
              <LoginPage signup={true} isInvitation={true} {...props} />
            )}
          />
          <Route
            path={INTERNAL_LINKS.CONFIRM_APPLY_EMAIL}
            render={(props) => <ConfirmMail {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.PASSWORD_RECOVERY}
            render={(props) => <PasswordRecoveryPage {...props} />}
          />
          {/* <Route
            path={INTERNAL_LINKS.PUBLIC_MARKETPLACE}
            render={(props) => <MarketplacePage {...props} />}
          /> */}
          <Route
            path={INTERNAL_LINKS.RESET_PASSWORD}
            render={(props) => <ResetPasswordPage {...props} />}
          />
          <Route
            path={INTERNAL_LINKS.TERMSOFUSE}
            render={(props) => <TermsOfUsePage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.HEART}
            render={(props) => <HEARTPage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.CLASSES}
            render={(props) => <ClassesPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.MICRO_CLASS}/:id`}
            render={(props) => <MicroClassPage {...props} />}
          />
          <PrivateRoute 
            exact
            path={INTERNAL_LINKS.COUNCIL_ADMIN}
            render={(props) => <CouncilPageAdmin {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.COUNCIL}
            render={(props) => <CouncilPage {...props} />}
          />
          <PrivateRoute 
            exact
            path={`${INTERNAL_LINKS.EVENTS_COUNCIL}/:id`}
            render={(props) => <CouncilEvents {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.SPEAKER_2023}
            render={(props) => <Speakers2023 {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.BUSINESS_PARTNER}
            render={(props) => <BusinessPartnerPage {...props} />}
          />
          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.BUSINESS_PARTNER}/resource`}
            render={(props) => <BusinessPartnerConversationCard {...props} />}
          />
          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.COUNCIL}/resource`}
            render={(props) => <CouncilConversationsCard {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.CHANNELS}
            render={(props) => <ChannelsPage {...props} />}
          />
          {/* <PrivateRoute
            path={`${INTERNAL_LINKS.CHANNELS}/:id`}
            exact
            render={(props) => <ChannelPage {...props} />}
          /> */}
          <PrivateRoute
            path={INTERNAL_LINKS.LEARNING_LIBRARY}
            render={(props) => <LearningLibraryPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.ARTICLE}/:id`}
            render={(props) => <ArticlePage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.FAVORITES}
            render={(props) => <FavouritePage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.EVENTS}
            render={(props) => <EventsPage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.PODCAST}
            render={(props) => <PodcastPage {...props} />}
          />

          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.BONFIRES}`}
            render={(props) => <BonfiresPage {...props} />}
          />

          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.COMMUNITIES}/mentoring`}
            render={(props) => <MentoringPage {...props} />}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.COMMUNITIES}
            render={(props) => <CommunititesPage {...props} />}
          />

          <PrivateRoute
            path={`${INTERNAL_LINKS.CERTIFICATE}/:id`}
            render={(props) => <CertificatePage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.EVENT_CERTIFICATE}`}
            render={(props) => <EventCertificatePage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.MICRO_CLASS_CERTIFICATE}/:id`}
            render={(props) => <MicroClassCertificatePage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.JOURNEY}
            render={(props) => <JourneyPage {...props} />}
          />
          {/* <PrivateRoute
            path={INTERNAL_LINKS.MARKETPLACE}
            render={(props) => <MarketplacePage {...props} />}
          /> */}
          <PrivateRoute
            path={INTERNAL_LINKS.CONFERENCE_LIBRARY}
            render={(props) => <ConferenceLibrary {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.PODCAST_SERIES}
            render={(props) => <PodcastSeriesPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.PODCAST_SERIES}/:id`}
            render={(props) => <PodcastSeriesDetailPage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.NOT_FOUND}
            render={(props) => <NoPageFound {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.NOTIFICATIONS}
            render={(props) => <NotificationPage {...props} />}
          />
          {/* <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE}
            render={(props) => <GlobalConferencePage {...props} />}
          /> */}

          <PrivateRoute
            path={`${INTERNAL_LINKS.MICRO_CONFERENCE}/:id`}
            render={(props) => <MicroConferencePage {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_SPEAKERS}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferenceSpeakersPage {...props} />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_PARTICIPANTS}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferenceParticipantsPage {...props} />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_PARTNERS}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferencePartnersPage {...props} />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_BONFIRE}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferenceBonfiressPage {...props} />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_PERSONAL_AGENDA}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferencePersonalAgendaPage {...props} />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_RECOMMENDED_AGENDA}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferencePersonalAgendaPage
                  {...props}
                  isRecommendedAgenda
                />
              </GlobalConferencePage>
            )}
          />

          <PrivateRoute
            exact
            path={INTERNAL_LINKS.GLOBAL_CONFERENCE_LEADERBOARD}
            render={(props) => (
              <GlobalConferencePage {...props}>
                <GlobalConferenceLeaderboardPage {...props} />
              </GlobalConferencePage>
            )}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.SPEAKERS}`}
            render={(props) => <SpeakersPage {...props} />}
          />

          <PrivateRoute
            path={`${INTERNAL_LINKS.PARTICIPANTS}/:idConference`}
            render={(props) => <ParticipantsPage {...props} />}
          />
          <PrivateRoute
            path={INTERNAL_LINKS.LIVE}
            render={(props) => <LivePage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.POST}/:id/:edit?`}
            render={(props) => <PostPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.LIBRARY_ITEM}/:type/:id`}
            render={(props) => <LibraryItemPage {...props} />}
          />
          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.PROJECTX}/:id`}
            render={(props) => <SkillCohortDetailPage {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.PROJECTX}
            render={(props) => <SkillCohortPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.LIBRARY_ITEM}/:type/:id`}
            render={(props) => <LibraryItemPage {...props} />}
          />
          <Route
            exact
            path={`${INTERNAL_LINKS.PROJECTX}/:id/resources`}
            render={(props) => <SkillCohortResourcePage {...props} />}
          />
          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.MY_LEARNINGS}`}
            render={(props) => <MyLearningPage {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.SPONSOR_DASHBOARD}
            render={(props) => <SponsorDashboardPage {...props} />}
          />
          <PrivateRoute
            exact
            path={INTERNAL_LINKS.TALENT_MARKETPLACE}
            render={(props) => <TalentMarketplacePage {...props} />}
          />
          <PrivateRoute
            exact
            path={`${INTERNAL_LINKS.TALENT_MARKETPLACE}/job-post/:id`}
            render={(props) => <JobPostDetailsPage {...props} />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.AD_HOME_PREVIEW}/:id`}
            exact
            render={(props) => <HomePage {...props} isAdPreview />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.AD_CONFERENCE_LIBRARY_PREVIEW}/:id`}
            exact
            render={(props) => <ConferenceLibrary {...props} isAdPreview />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.AD_EVENTS_PREVIEW}/:id`}
            exact
            render={(props) => <EventsPage {...props} isAdPreview />}
          />
          <PrivateRoute
            path={`${INTERNAL_LINKS.AD_PROJECT_X_PREVIEW}/:id`}
            exact
            render={(props) => <SkillCohortPage {...props} isAdPreview />}
          />

          <PrivateRoute
            path={INTERNAL_LINKS.SEARCH}
            exact
            render={(props) => <SearchPage {...props} />}
          />

          <PrivateRoute
            path={INTERNAL_LINKS.BLOGS}
            exact
            render={(props) => <BlogsPage {...props} />}
          />

          <PrivateRoute
            path={`${INTERNAL_LINKS.CHANNELS}/:id${INTERNAL_LINKS.BLOGS}/:id`}
            exact
            render={(props) => <BlogPage {...props} />}
          />

          <Route
            path={`${INTERNAL_LINKS.VERIFY}/:id`}
            exact
            render={(props) => <SwiftRouteVerify {...props} />}
          />

          <PrivateRoute
            path={`${INTERNAL_LINKS.BLOGS}/:id`}
            exact
            render={(props) => <BlogPage {...props} />}
          />

          {/* <Route
            exact
            path={INTERNAL_LINKS.SIMULATION_SPRINTS}
            render={(props) => <SimulationSprintsPage {...props} />}
          />

          <Route
            exact
            path={`${INTERNAL_LINKS.SIMULATION_SPRINTS}/:id`}
            render={(props) => <SimulationSprintPage {...props} />}
          />

          <Route
            exact
            path={`${INTERNAL_LINKS.SIMULATION_SPRINTS}/:id/dashboard`}
            render={(props) => <SimulationSprintDashboardPage {...props} />}
          /> */}
          <Route
            exact
            path={"/:data"}
            render={(props) => <StartRouteSwift {...props} />}
          />

          <Route component={NoPageFound} />
        </Switch>
      </Layout.Content>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

export default withRouter(connect(mapStateToProps)(injectIntl(Content)));
