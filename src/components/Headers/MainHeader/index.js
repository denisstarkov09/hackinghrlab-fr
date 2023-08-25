import React from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  // Input,
  // Button, 
  // Avatar,
  // Modal
} from "antd";
import {
  // SearchOutlined,
  // CloseCircleFilled 
} from "@ant-design/icons";
import {
  SIDEBAR_MENU_LIST,
  EVENT_TYPES,
  INTERNAL_LINKS,
  INTERNAL_LINKS_ADDITIONAL_DATA_FOR_HEADER,
} from "enum";
import CustomButton from "../../Button";
import ProfilePopupMenu from "../../ProfilePopupMenu";
import TimeZoneList from "enum/TimezoneList";
import PremiumAlert from "../../PremiumAlert";
import Emitter from "services/emitter";
import moment from "moment";
import { eventSelector } from "redux/selectors/eventSelector";
import {
  searchUser,
  setInputSearchValue,
  setSearchedUsers,
  setUserShow,
  setVisibleProfileUser,
  updateUserPopUp
} from "redux/actions/home-actions";
import { setCollapsed } from "redux/actions/env-actions";
// import Imbox from "containers/Imbox";
import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";
import Notification from "containers/Notification";

import {
  getAllEvent,
  getAllEventsChannels
} from "redux/actions/event-actions";

import IconChevronDown from "images/icon-chevron-down.svg";
import IconTvOutline from "images/icon-tv-outline.svg";
import IconMedal from "images/icon-medal.svg";
import IconNotification from "images/icon-notification-header.svg";
import IconHeadsetOutline from "images/icon-headset-outline.svg";
import IconLibrary from "images/icon-library.svg";
import IconFlaskOutline from "images/icon-flask-outline.svg";
import IconBriefcaseOutline from "images/icon-briefcase-outline.svg";
import IconReader from "images/icon-reader.svg";
import IconHome from "images/icon-home.svg";
import iconSchool from "images/icon-school.svg";
import IconMentoring from "images/icon-mentoring.svg";

import IconGlobal from "images/icon-global.svg";
import { homeSelector } from "redux/selectors/homeSelector";
import { envSelector } from "redux/selectors/envSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { courseSelector } from "redux/selectors/courseSelector";
import { liveSelector } from "redux/selectors/liveSelector";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";

import "./style.scss";
import { sessionSelector } from "redux/selectors/sessionSelector";
import CustomDrawer from "components/Drawer";
import ProfileViewPanel from "containers/ProfileDrawer/ProfileViewPanel";
import { capitalizeWord } from "utils/format";

// const { Search } = Input;


const MenuList = [
  ...SIDEBAR_MENU_LIST.TOP_MENUS,
  ...SIDEBAR_MENU_LIST.BOTTOM_MENUS,
  ...INTERNAL_LINKS_ADDITIONAL_DATA_FOR_HEADER,
];

class MainHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visiblePremiumAlert: false,
      showSearchInput: window.screen.width > 920,
      showSearchResult: false,
      openPopUp: false,
      firstTimePop: false
    };
  }

  timeout;

  planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  // inviteFriend = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_INVITE_FRIEND_MODAL);
  // };

  onShowSidebar = () => {
    this.props.setCollapsed(false);
  };

  onHideAlert = () => {
    this.setState({ visiblePremiumAlert: false });
  };

  showPremiumAlert = () => {
    this.setState({ visiblePremiumAlert: true });
  };

  handleSearch = (e) => {
    this.props.setInputSearchValue(e.target.value);

    clearTimeout(this.timeout);
    if (e.target.value === "") {
      return;
    }

    this.timeout = setTimeout(() => {
      this.props.searchUser(this.props.inputUserSearchValue);
      this.setState({ showSearchResult: true });
      clearTimeout(this.timeout);
    }, 1000);
  };

  handleBlur = (e) => {
    this.timeout = setTimeout(() => {
      this.setState({ showSearchResult: false });

      if (window.screen.width < 920) {
        this.setState({ showSearchInput: false });
      }
      clearTimeout(this.timeout);
    }, 500);
  };

  onDrawerClose = () => {
    this.setState({ visibleProfileUser: false });
  };

  onOpenPostFormModal = () => {
    if (this.props.userProfile.completed === true && this.props.userProfile.memberShip === "premium") {
      Emitter.emit(EVENT_TYPES.OPEN_POST_MODAL);
    } else {
      Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "story");
    }
  };

  componentDidMount() {

    if (!this.props.allEventsChannels || this.props.allEventsChannels.length === 0) {
      this.props.getAllEventsChannels()
    }
    if (!this.props.allEvents || this.props.allEvents.length === 0) {
      this.props.getAllEvent();
    }

    this.props.getCouncilEvents(() => {

    });

    window.addEventListener("click", (e) => {
      if (this.props.isMobile) {
        if (e?.target?.parentElement?.parentElement !== undefined && e?.target?.parentElement?.parentElement !== null) {
          if (e.target.className !== 'ant-input ant-input-lg'
            && e.target.className !== 'ant-btn ant-btn-primary ant-btn-lg ant-btn-icon-only button-search'
            && e.target.parentElement.className !== 'main-header-left'
            && e.target.parentElement.className !== 'anticon anticon-search'
            && e.target.parentElement.parentElement.className !== 'anticon anticon-search') {
            this.setState({ showSearchInput: false });
          }
        }
      }
    })
  }

  filterInformationPopupEvents(data) {
    const datePopUpUser = moment(this.props.userProfile?.lastDateSignOut, 'YYYY-MM-DD hh:mm a')?.format('YYYYMMDDHHmm')

    let newArray = data.filter((event) => {
      let date1 = moment(event.createdAt, 'YYYY-MM-DD hh:mm a')?.format('YYYYMMDDHHmm')
      let date2 = (event?.channel !== null)
        ? moment(event?.startDate, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')
        : moment(event?.startAndEndTimes[0]?.startDate, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')

      let bul3 = this.props.userProfile?.arrayControlIdsEvents?.includes(event.id)
      let bul1 = Number(datePopUpUser) < Number(date1)
      let bul2 = Number(datePopUpUser) < Number(date2)

      return (bul1 || bul2) && !bul3
    })

    return newArray
  }

  componentDidUpdate() {
    // const dateNow =  moment.utc().format('YYYYMMDDHHmm')
    // const datePopUpUser = moment(this.props.userProfile?.limitDatePopUp,'YYYY-MM-DD hh:mm a')?.add(60, 'day')?.format('YYYYMMDDHHmm')

    // const comparation = (this.props.userProfile?.limitDatePopUp !== '') 
    //   ? (Number(datePopUpUser) < Number(dateNow)) 
    //   : true

    // const numLength = this.filterInformationPopupEvents(this.props.allEventsChannels).length
    // + this.filterInformationPopupEvents(this.props.allEvents).length

    // if(this.props.userProfile?.bulPopup && !this.state.firstTimePop && comparation && numLength > 0){
    //   this.setState({ openPopUp: true, firstTimePop: true });
    // }
  }

  searchTimeZone = (timezone) => {
    let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

    if (currentTimezone) {
      currentTimezone = currentTimezone.utc[0];
    } else {
      currentTimezone = timezone;
    }

    return currentTimezone
  }

  configureDate(date, timezone) {
    if (moment(date, 'YYYY-MM-DD hh:mm a').tz(this.searchTimeZone(timezone)) === undefined) {
      return `${moment(date, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD hh:mm a')} (UTC)`
    } else {
      return `${moment(date).tz(this.searchTimeZone(timezone)).format('YYYY-MM-DD hh:mm a')} (${timezone})`
    }
  }


  calcelModal() {
    // this.setState({ openPopUp: false });

    // const newArrayEventsChannels = this.filterInformationPopupEvents(this.props.allEventsChannels).map((data) => {
    //   return data.id
    // })

    // const newArrayEvents = this.filterInformationPopupEvents(this.props.allEvents).map((data) => {
    //   return data.id
    // })

    // this.props.updateUserPopUp({
    //   bul: false, 
    //   arrayControlIdsEvents: [
    //     ...this.props.userProfile?.arrayControlIdsEvents,
    //     ...newArrayEvents,
    //     ...newArrayEventsChannels
    //   ]
    // })
  }

  dontShowMore() {
    // this.setState({ openPopUp: false });
    // this.props.updateUserPopUp({
    //   bul: false, 
    //   limitDatePopUp: moment.utc().format()
    // })
  }

  render() {
    const {
      userProfile: user,
      userShow,
      visibleProfileUser,
      // setUserShow,
      setVisibleProfileUser,
    } = this.props;
    const {
      visiblePremiumAlert,
      showSearchInput,
      // showSearchResult,
      // inputSearchValue,
      // openPopUp
    } = this.state;
    const { pathname } = this.props.history.location || {};
    // const typeQuery = this.props.history.location.search.substring(6,10)
    let pathInfo = MenuList.find((item) => item.url.includes(pathname));
    // const users = this.props.searchedUsers?.map((searchedUser) => (
    //   <div className="search-result" key={searchedUser.id}>
    //     <div
    //       className="search-result-container"
    //       onClick={() => {
    //         setUserShow(searchedUser);
    //         setVisibleProfileUser(true);
    //       }}
    //     >
    //       {searchedUser.img ? (
    //         <Avatar
    //           size={30}
    //           src={searchedUser.img}
    //           alt={`${searchedUser.firstName} ${searchedUser.lastName}`}
    //         />
    //       ) : (
    //         <Avatar>{searchedUser.abbrName}</Avatar>
    //       )}
    //       <div className="search-result-info-container">
    //         <h5>
    //           {" "}
    //           {searchedUser.firstName} {searchedUser.lastName}
    //         </h5>
    //         <span>{searchedUser.titleProfessions}</span>
    //       </div>
    //     </div>
    //   </div>
    // ));

    if (pathname === INTERNAL_LINKS.NOTIFICATIONS) {
      pathInfo = {
        icon: IconNotification,
        label: "Notifications",
      };
    } else if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.CHANNELS}/`)) {
      const { selectedChannel } = this.props;
      pathInfo = {
        icon: IconTvOutline,
        label: (selectedChannel || {}).name || "",
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.COUNCIL}`)) {
      pathInfo = {
        icon: IconLibrary,
        label: `Council`,
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.COUNCIL_ADMIN}`)) {
      pathInfo = {
        icon: IconLibrary,
        label: `Events Council Admin`,
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.EVENTS_COUNCIL}`)) {
      pathInfo = {
        icon: IconLibrary,
        label: `Events`,
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.EVENT_CERTIFICATE}`)) {
      pathInfo = {
        // icon: ,
        label: `Certificate of participation`,
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.BUSINESS_PARTNER}`)) {
      pathInfo = {
        // icon: ,
        label: `HR Business Partners Community`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MICRO_CLASS}/`)) {
      const { selectedCourse } = this.props;
      pathInfo = {
        icon: IconMedal,
        label: `Class - ${(selectedCourse || {}).title || ""}`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MICRO_CONFERENCE}/`)) {
      const { session } = this.props;

      pathInfo = {
        icon: IconGlobal,
        label: `Hacking HR 2022 Global Online Conference - ${(session || {}).title || ""
          }`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.PODCAST_SERIES}`)) {
      const { podcastSeries } = this.props;
      pathInfo = {
        icon: IconHeadsetOutline,
        label: (podcastSeries || {}).title || "Podcast Series",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.POST}/`)) {
      pathInfo = {
        icon: IconMedal,
        label: `Post Details`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.LIBRARY_ITEM}/`)) {
      if (pathname.includes(`${INTERNAL_LINKS.LIBRARY_ITEM}/podcast`)) {
        pathInfo = {
          icon: IconHeadsetOutline,
          label: `Podcast`,
        };
      } else {
        pathInfo = {
          icon: IconLibrary,
          label: `Library Item`,
        };
      }
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.PROJECTX}/`)) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: `ProjectX - Cohort: ${this.props.skillCohort.title || ""}`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MY_LEARNINGS}`)) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: "My Learnings",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.SPONSOR_DASHBOARD}`)) {
      pathInfo = {
        // icon: ,
        label: "Partners Dashboard",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.SPEAKER_2023}`)) {
      pathInfo = {
        // icon: ,
        label: "Speaker 2023",
      };
    }

    if (
      !pathInfo &&
      pathname.includes(`${INTERNAL_LINKS.TALENT_MARKETPLACE}`)
    ) {
      pathInfo = {
        icon: IconBriefcaseOutline,
        label: "Talent Marketplace",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_HOME_PREVIEW}`)) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (
      !pathInfo &&
      pathname.includes(`${INTERNAL_LINKS.AD_CONFERENCE_LIBRARY_PREVIEW}`)
    ) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_EVENTS_PREVIEW}`)) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (
      !pathInfo &&
      pathname.includes(`${INTERNAL_LINKS.AD_PROJECT_X_PREVIEW}`)
    ) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: "Advertisement Preview",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.BLOGS}`)) {
      pathInfo = {
        icon: IconReader,
        label: "Blog",
      };
    }

    if (
      !pathInfo &&
      pathname.includes(`${INTERNAL_LINKS.SIMULATION_SPRINTS}`)
    ) {
      pathInfo = {
        icon: iconSchool,
        label: "Simulation Sprints",
      };
    }
    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.COMMUNITIES}`)) {
      const title = capitalizeWord(pathname.slice(13));
      pathInfo = {
        icon: IconMentoring,
        label: title,
      };
    }

    return (
      <div className="main-header">
        <div className="main-header-left">
          {this.props.isMobile && (
            <div className="main-header-left-menu" onClick={this.onShowSidebar}>
              <i className="fal fa-bars" />
            </div>
          )}
          {pathInfo && (
            <>
              <div className="page-icon">
                {pathInfo.icon ? (
                  <img src={pathInfo.icon} alt="page-icon" />
                ) : (
                  <></>
                )}
              </div>
              <span className="page-label">
                {pathInfo.label === "Global Conference"
                  ? "Hacking HR 2022 Global Online Conference"
                  : pathInfo.label}
              </span>
            </>
          )}

          {/* {showSearchInput ? (
            <div className="search-results-container">
              <Search
                placeholder="Search Users"
                onSearch={() => {
                  this.props.history.push("/search");
                }}
                className="search-input"
                size="large"
                onKeyUp={this.handleSearch}
                value={inputSearchValue}
                onBlur={this.handleBlur}
              />

              <div
                className={`dropdown-custom ${users.length === 0 || !showSearchResult ? "not-visible" : ""
                  }`}
              >
                {showSearchResult &&
                  users.length > 0 &&
                  users.slice(0, 10).map((user) => user)}

                {showSearchResult && users.length > 5 && (
                  <div className="view-more-results">
                    <Link to="/search">
                      <h4>View More Results</h4>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <Button
              icon={<SearchOutlined />}
              size="large"
              type="primary"
              className="button-search"
              onClick={() => this.setState({ showSearchInput: true })}
            />
          )}
          {(pathInfo?.label === 'Home' && !this.props.isMobile) &&
            <CustomButton
              type="primary"
              onClick={this.onOpenPostFormModal}
              style={{ marginLeft: "20px" }}
              text="Add Story"
            />
          } */}
        </div>

        <div
          className="main-header-right"
          style={
            showSearchInput && window.screen.width < 920
              ? { display: "none" }
              : {}
          }
        >
          {this.props.live?.live === true && (
            <div
              className="live-button"
              onClick={() => {
                if (user.completed === true) {
                  this.props.history.push(INTERNAL_LINKS.LIVE);
                } else {
                  Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "live");
                }
              }}
            >
              <div className="live-container">
                <div className="live-circle"></div>
                <div>LIVE</div>
                <p>: {this.props?.live?.title}</p>
              </div>
            </div>
          )}
          {/* <CustomButton
            text="Invite friend"
            type="primary"
            size="lg"
            className="btn-invite"
            onClick={this.inviteFriend}
          /> */}
          {user.memberShip === "free" ? (
            <CustomButton
              text="Upgrade to PREMIUM"
              type="primary"
              size="lg"
              className="btn-upgrade"
              onClick={this.planUpgrade}
            />
          ) : (
            <div style={{
              background: '#00b574', color: 'white', height: '40px', width: '240px', padding: '10px', fontWeight: '700', fontSize: '20px', borderRadius: '5px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'
            }}>
              PREMIUM ACCOUNT
            </div>
          )}
          {/* <Imbox className="main-header-imbox" /> */}
          <Notification className="main-header-notification" />
          <ProfilePopupMenu showPremiumAlert={this.showPremiumAlert}>
            <div className="user-avatar">
              {user.img ? (
                <img src={user.img} alt="user-avatar" />
              ) : (
                user.abbrName
              )}
            </div>
            <span className="user-name">{`${user.firstName || ""} ${user.lastName || ""
              }`}</span>
            <div className="profile-menu-chevron">
              <img src={IconChevronDown} alt="profile-menu" />
            </div>
          </ProfilePopupMenu>
        </div>
        <CustomDrawer
          title=""
          visible={visibleProfileUser}
          onClose={() => {
            setVisibleProfileUser(false);
          }}
        >
          <ProfileViewPanel user={userShow} />
        </CustomDrawer>
        <PremiumAlert
          visible={visiblePremiumAlert}
          onCancel={() => this.onHideAlert()}
        />
        {/* <Modal
          visible={openPopUp}
          width={600}
          bodyStyle={{ overflow: "auto", padding: "20px" }}
          title={
            <div 
              style={{
                paddingLeft: '20px', 
                paddingRight: '20px', 
                display: 'flex', 
                justifyContent: "center",
                alignItems: 'start',
                fontSize:'20px'
              }}
            >
              Welcome back {user.firstName}
            </div>
          }
          footer={[
            <Button key="cancel" onClick={() => {this.dontShowMore()}}>
              Don't show more
            </Button>,
            <Button key="back" onClick={() => {this.calcelModal()}}>
              Ok
            </Button>,
          ]}
          onCancel={() => {this.calcelModal()}}
          closable={true}
          closeIcon={<CloseCircleFilled className="custom-modal-close" id="close-email" />}
        >
          <div>
            The last time you over here was {this.configureDate(user.lastDateSignOut, user.timezone)}
          </div>
          <p>We have all this new content for you:</p>
          {this.filterInformationPopupEvents(this.props.allEventsChannels).length > 0 && (
            <div>
              <h3><Link to={INTERNAL_LINKS.EVENTS}>Events Channels</Link></h3>
              <ul>
                {this.filterInformationPopupEvents(this.props.allEventsChannels).map((event) => {
                  return (
                    <li>{event.title}</li>
                  )
                })}
              </ul>
            </div>
          )}
          {this.filterInformationPopupEvents(this.props.allEvents).length > 0 && (
            <div>
              <h3><Link to={INTERNAL_LINKS.EVENTS}>Events Hacking HR LAB</Link></h3>
              <ul>
                {this.filterInformationPopupEvents(this.props.allEvents).map((event) => {
                  return (
                    <li>{event.title}</li>
                  )
                })}
              </ul>
            </div>
          )}
        </Modal> */}
      </div>
    );
  }
}

MainHeader.propTypes = {
  title: PropTypes.string,
};

MainHeader.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  isMobile: envSelector(state).isMobile,
  selectedChannel: channelSelector(state).selectedChannel,
  selectedCourse: courseSelector(state).course,
  session: sessionSelector(state).session,
  live: liveSelector(state).live,
  podcastSeries: podcastSelector(state).podcastSeries,
  skillCohort: skillCohortSelector(state).skillCohort,
  inputUserSearchValue: homeSelector(state).inputUserSearchValue,
  searchedUsers: homeSelector(state).searchedUsers,
  userShow: homeSelector(state).userShow,
  bulChannelPage: channelSelector(state).bulChannelPage,
  visibleProfileUser: homeSelector(state).visibleProfileUser,
  allEvents: eventSelector(state).allEvents,
  allEventsChannels: eventSelector(state).allEventsChannels,
  ...councilEventSelector(state),
});

const mapDispatchToProps = {
  setCollapsed,
  searchUser,
  setInputSearchValue,
  setSearchedUsers,
  setUserShow,
  setVisibleProfileUser,
  updateUserPopUp,
  getAllEvent,
  getAllEventsChannels,
  ...councilEventActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader);