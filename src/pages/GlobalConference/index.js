import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import moment from "moment-timezone";
import jsPdf from "jspdf";
import { Menu, notification } from "antd";
import { INTERNAL_LINKS } from "enum";
import {
  CustomButton,
  Tabs,
  GlobalConferenceFilterPanel,
  CustomModal,
} from "components";
import {
  getAllSessions,
  getSessionsUserJoined,
} from "redux/actions/session-actions";
import {
  attendToGlobalConference,
  setLoading,
} from "redux/actions/home-actions";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import {
  addToMyEventList,
  getAllEvent,
  removeFromMyEventList,
} from "redux/actions/event-actions";
import { convertToUTCTime, convertToLocalTime } from "utils/format";
import { formatAnnualConference } from "utils/formatPdf";
import Emitter from "services/emitter";
import SocketIO from "services/socket";
import { EVENT_TYPES, SOCKET_EVENT_TYPE } from "enum";
import ConferenceList from "./ConferenceList";
import FilterDrawer from "./FilterDrawer";
import RecommendedAgendaModal from "./RecommendedAgendaModal";
import AccessibilityRequirementsModal from "./AccessibilityRequirementsModal";
import InviteColleaguesFormModal from "./InviteColleaguesFormModal";
import "./style.scss";
import AcceptTermsAndConditions from "./AcceptTermsAndConditions";
import { CheckOutlined } from "@ant-design/icons";
import Certificate from "./Certificate";
import ThingsYouNeedToKnow from "./ThingsYouNeedToKnow";

const TAB_NUM = 6;

const GlobalConference = ({
  allSessions,
  sessionsUserJoined,
  allEvents,
  getAllEvent,
  userProfile,
  getAllSessions,
  getSessionsUserJoined,
  addToMyEventList,
  removeFromMyEventList,
  sessionsUser,
  setLoading,
  attendToGlobalConference,
  children,
  location,
}) => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState("0");
  const [selectTab, setSelectTab] = useState("Mar 07");

  const globalConferenceRef = React.createRef();

  const [firstTabDate] = useState(moment("2022-03-07", "YYYY-MM-DD"));
  const [tabData, setTabData] = useState([]);
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState("");
  const [
    modalFormInviteColleaguesVisible,
    setModalFormInviteColleaguesVisible,
  ] = useState(false);
  const [modalRequirementsVisible, setModalRequirementsVisible] =
    useState(false);
  const [modalCloseConferenceVisible, setModalCloseConferenceVisible] =
    useState(true);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [messageAdmin, setMessageAdmin] = useState("");
  const [modalRecommendeAgendaVisible, setModalRecommendeAgendaVisible] =
    useState(false);
  const [modalVisibleWelcomingMessage, setModalVisibleWelcomingMessage] =
    useState(false);
  const [modalVisibleCertificate, setModalVisibleCertificate] = useState(false);

  const localPathname =
    location.pathname.split("/")[2] || location.pathname.split("/")[1];

  const onFilterChange = (filter) => {
    setFilters(filter);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  const onSearch = (value) => {
    const startTime = convertToUTCTime(firstTabDate.clone());
    const endTime = convertToUTCTime(firstTabDate.clone().add(TAB_NUM, "days"));
    setMeta(value);
    getAllSessions({ startTime, endTime, meta: value });
  };

  // const goToPrevPage = () => {
  //   setFirstTabDate(firstTabDate.clone().subtract(TAB_NUM, "days"));
  // };

  // const goToNextPage = () => {
  //   setFirstTabDate(firstTabDate.clone().add(TAB_NUM, "days"));
  // };

  const onAttend = () => {
    const globalEvent = allEvents.find(
      (event) => event.isAnnualConference === 1
    );

    if (userProfile.attendedToConference === 0) {
      attendToGlobalConference();
      addToMyEventList(globalEvent);
    } else {
      removeFromMyEventList(globalEvent);
      attendToGlobalConference();
    }
  };

  const showModalMessage = (message) => {
    setMessageAdmin(message);
    setModalMessageVisible(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (modalMessageVisible) {
        setModalMessageVisible(false);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, [modalMessageVisible]);

  useEffect(() => {
    if (firstTabDate) {
      // get sessions data
      const startTime = convertToUTCTime(firstTabDate.clone());
      const endTime = convertToUTCTime(
        firstTabDate.clone().add(TAB_NUM, "days")
      );
      getAllSessions({ startTime, endTime });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTabDate]);

  useEffect(() => {
    const filterSessions = (data, date) => {
      return data.filter((item) => {
        return (
          convertToLocalTime(item.startTime).format("YYYY-MM-DD") ===
          date.format("YYYY-MM-DD")
        );
      });
    };
    const tData = Array.from(Array(TAB_NUM).keys()).map((item) => {
      const date = firstTabDate.clone().add(item, "days");
      const data = filterSessions(allSessions, date);

      return {
        title: date.format("MMM DD"),
        content: () => (
          <ConferenceList data={data} filters={filters} meta={meta} />
        ),
      };
    });

    for (let i = 0; i < tData.length; i++) {
      if (tData[i].title === moment().format("MMM DD")) {
        setCurrentTab(`${i}`);
        setSelectTab(tData[i].title);
        break;
      }

      setCurrentTab(`${tData.length - 1}`);
      setSelectTab(tData[tData.length - 1].title);
    }
    setTabData(tData);
  }, [firstTabDate, allSessions, filters, meta]);

  useEffect(() => {
    getAllEvent();
    if (userProfile?.sessionsJoined?.length > 0) {
      getSessionsUserJoined(userProfile.sessionsJoined);
    }
  }, [getAllEvent, getSessionsUserJoined, userProfile]);

  useEffect(() => {
    SocketIO.on(SOCKET_EVENT_TYPE.SEND_MESSAGE_GLOBAL_CONFERENCE, (message) =>
      showModalMessage(message)
    );
  }, [userProfile]);

  const downloadPdf = async (option) => {
    setLoading(true);

    if (option === "conference-schedule") {
      const link = document.createElement("a");
      link.download = "Conference Schedule.pdf";
      link.href =
        "https://hackinghr-lab-assets.s3.us-east-1.amazonaws.com/pdfs/A%20-%20Hacking%20HR%202022%20Global%20Conference%20-%20Schedule.pdf";
      link.target = "_blank";
      link.click();
      setLoading(false);
      return;
    }

    if (sessionsUser.length < 1 && option === "personal-agenda") {
      setLoading(false);
      return notification.warning({
        message: "You have no sessions",
        description: `Add your first session before downloading personalized agenda” if
        someone tries to download it without having added any session to
        their agenda`,
      });
    } else if (sessionsUserJoined < 1 && option === "report-sessions-joined") {
      setLoading(false);
      return notification.warning({
        message: "You haven't joined any session",
        description: `Join your first session before downloading the joined sessions report`,
      });
    }

    const template = formatAnnualConference(
      userProfile,
      option === "personal-agenda"
        ? sessionsUser
        : option === "conference-schedule"
        ? allSessions
        : sessionsUserJoined,
      option
    );

    const pdf = new jsPdf({
      orientation: "p",
      format: "a4",
      unit: "px",
      hotfixes: ["px_scaling"],
      precision: 32,
    });

    await pdf.html(template);

    if (option !== "conference-schedule") {
      pdf.setFontSize(16);
      pdf.text(120, 200, "SUGGESTED LINKS TO CHECK OUT (BY SPEAKERS)");
      pdf.setFontSize(12);
      pdf.text(
        50,
        230,
        "This link includes a comprehensive list of references and learning material suggested by the\nconference speakers."
      );
      pdf.setFontSize(10);
      pdf.setTextColor("#438cef");
      pdf.textWithLink("Please click here", 50, 280, {
        url: "https://docs.google.com/document/d/1RRy2yhPps3ebcYHVehtIsEkMN8NikrKDixdvIeVIPb0/edit?usp=sharing",
      });

      pdf.setTextColor("#000");
      pdf.text(50, 320, "Thank you!");
    }

    pdf.save(
      option === "personal-agenda"
        ? "Personalizated Agenda.pdf"
        : option === "conference-schedule"
        ? "Conference Schedule.pdf"
        : "Personalized Participation Report.pdf"
    );

    setLoading(false);
  };

  // const onAddBonfire = () => {
  //   if (userProfile.memberShip && userProfile.memberShip !== "premium") {
  //     return notification.warning({
  //       message: "Warning",
  //       description: `you need to be a premium user to create a bonfire`,
  //     });
  //   }
  //   setCreateBonfireModalVisible(true);
  // };

  const onInviteColleague = () => {
    if (userProfile.memberShip && userProfile.memberShip !== "premium") {
      return notification.warning({
        message: "Warning",
        description: `you need to be a premium user to invite a user`,
      });
    }
    setModalFormInviteColleaguesVisible(true);
  };

  useEffect(() => {
    setFilters({});
  }, [localPathname]);

  const childrenWithFilterProp = children
    ? React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { filters, onSearch });
        }
        return child;
      })
    : null;

  if (userProfile.percentOfCompletion && userProfile.percentOfCompletion < 100)
    return <Redirect to="/" />;

  const handleCustomTab = (tabTitle, tabIndex) => {
    globalConferenceRef.current.scrollTo({
      top: 0,
    });
    setCurrentTab(`${tabIndex}`);
    setSelectTab(tabTitle);
  };

  return (
    <div className="global-conference">
      <GlobalConferenceFilterPanel
        onChange={onFilterChange}
        onSearch={onSearch}
        filters={filters}
        view={localPathname}
        onAttend={onAttend}
        onInviteColleague={onInviteColleague}
        setModalRequirementsVisible={setModalRequirementsVisible}
        setModalVisibleWelcomingMessage={setModalVisibleWelcomingMessage}
        downloadPdf={downloadPdf}
        setModalVisibleCertificate={setModalVisibleCertificate}
      />
      <FilterDrawer
        onChange={onFilterChange}
        onSearch={onSearch}
        filters={filters}
        view={localPathname}
        onAttend={onAttend}
        onInviteColleague={onInviteColleague}
        setModalRequirementsVisible={setModalRequirementsVisible}
      />
      <div className="global-conference-container">
        <div className="global-conference-container-top-menu">
          <div className="global-conference__filters--button">
            <CustomButton
              text="Filters"
              onClick={() => {
                showFilterPanel();
              }}
            />

            {window.screen.width <= 1024 && (
              <div
                className="button-containers"
                style={{ marginBottom: "10px" }}
              >
                {userProfile.attendedToConference ? (
                  <>
                    <div className="attending-label">
                      <CheckOutlined />
                      <span>I'm attending</span>
                    </div>
                    <CustomButton
                      className="not-going-button"
                      text="Not attending"
                      size="xs"
                      type="remove"
                      remove={true}
                      onClick={onAttend}
                    />
                    <CustomButton
                      size="xs"
                      text="Invite Your Colleagues"
                      style={{ padding: "0px 28px" }}
                      onClick={onInviteColleague}
                    />
                  </>
                ) : (
                  <CustomButton
                    size="xs"
                    text="Attend the conference"
                    onClick={onAttend}
                  />
                )}
                <CustomButton
                  text="Accessibility Requirements"
                  size="xs"
                  type="info"
                  className="button-requirements"
                  onClick={() => setModalRequirementsVisible(true)}
                />

                <CustomButton
                  text="Things You Need To Know"
                  size="xs"
                  style={{ padding: "0px 35px", marginTop: "12px" }}
                  onClick={() => setModalVisibleWelcomingMessage(true)}
                />
                <CustomButton
                  size="xs"
                  text="Download Full Schedule"
                  style={{ marginTop: "12px", padding: "0px 22px" }}
                  onClick={() => downloadPdf("conference-schedule")}
                />

                {/* {localPathname === "personal-agenda" && (
                  <CustomButton
                    size="xs"
                    text="Download Personalized Agenda"
                    style={{ marginTop: "12px", padding: "0px 0px" }}
                    onClick={() => downloadPdf("personal-agenda")}
                    ƒ
                  />
                )} */}

                <CustomButton
                  size="xs"
                  text="Download Participation Report"
                  className="button-participation-report"
                  onClick={() => {
                    if (moment().weeks() <= 13) {
                      return notification.info({
                        message: "Coming soon",
                        description: "Available On March 21",
                      });
                    }
                    downloadPdf("report-sessions-joined");
                  }}
                />

                <CustomButton
                  size="xs"
                  text="Download Certificate"
                  style={{
                    marginTop: "12px",
                    padding: "0px 46px",
                  }}
                  onClick={() => {
                    if (moment().weeks() <= 12) {
                      return notification.info({
                        message: "Coming soon",
                        description: "Available On March 14",
                      });
                    }
                    setModalVisibleCertificate(true);
                  }}
                />
              </div>
            )}
          </div>
          <div className="global-conference-pagination">
            <Menu
              mode="horizontal"
              className="sub-menu"
              selectedKeys={localPathname}
            >
              <Menu.Item
                key="global-conference"
                className="sub-menu-item-global-conference"
              >
                <Link to="/global-conference">Conference Schedule</Link>
              </Menu.Item>

              <Menu.Item
                key="speakers"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_SPEAKERS}>
                  Speakers
                </Link>
              </Menu.Item>
              <Menu.Item
                key="participants"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_PARTICIPANTS}>
                  Participants
                </Link>
              </Menu.Item>

              {/* <Menu.Item
                key="partners"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_PARTNERS}>
                  Partners
                </Link>
              </Menu.Item> */}

              {/* <Menu.Item
                key="bonfire"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_BONFIRE}>
                  Bonfire
                </Link>
              </Menu.Item> */}
              <Menu.Item
                key="personal-agenda"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_PERSONAL_AGENDA}>
                  My Personal Agenda
                </Link>
              </Menu.Item>

              <Menu.Item
                key="conference-leaderboard"
                className="sub-menu-item-global-conference"
              >
                <Link to={INTERNAL_LINKS.GLOBAL_CONFERENCE_LEADERBOARD}>
                  Conference Leaderboard
                </Link>
              </Menu.Item>
            </Menu>

            {!childrenWithFilterProp && (
              <Menu
                mode="horizontal"
                className="sub-menu"
                selectedKeys={selectTab}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {tabData.map((tab, index) => (
                  <Menu.Item
                    key={tab.title}
                    className={`sub-menu-item-global-conference-fake-tabs`}
                    onClick={() => {
                      handleCustomTab(tab.title, index);
                    }}
                  >
                    {tab.title}
                  </Menu.Item>
                ))}
              </Menu>
            )}

            {/* <div style={{ display: "flex" }}>
              <CustomButton
                type="primary outlined"
                size="xs"
                text="<"
                onClick={goToPrevPage}
              />
              <CustomButton
                type="primary outlined"
                size="xs"
                text=">"
                onClick={goToNextPage}
              />
            </div> */}
          </div>
        </div>
        {childrenWithFilterProp ? (
          childrenWithFilterProp
        ) : (
          <div className="global-conference-tabs" ref={globalConferenceRef}>
            <Tabs
              data={tabData}
              current={currentTab}
              onChange={setCurrentTab}
            />
          </div>
        )}
      </div>
      <InviteColleaguesFormModal
        visible={modalFormInviteColleaguesVisible}
        onCancel={() => {
          setModalFormInviteColleaguesVisible(false);
        }}
      />
      <AccessibilityRequirementsModal
        visible={modalRequirementsVisible}
        onCancel={() => setModalRequirementsVisible(false)}
      />
      <CustomModal
        visible={modalMessageVisible}
        title="Attention!"
        width={500}
        onCancel={() => setModalMessageVisible(false)}
      >
        <div dangerouslySetInnerHTML={{ __html: messageAdmin.html }} />
      </CustomModal>
      <RecommendedAgendaModal
        visible={modalRecommendeAgendaVisible}
        onCancel={() => setModalRecommendeAgendaVisible(false)}
      />
      <ThingsYouNeedToKnow
        visible={modalVisibleWelcomingMessage}
        onCancel={() => setModalVisibleWelcomingMessage(false)}
      />
      `
      <Certificate
        visible={modalVisibleCertificate}
        onCancel={() => {
          setModalVisibleCertificate(false);
          setModalCloseConferenceVisible(true);
        }}
        sessionsUserJoined={sessionsUserJoined}
      />
      <CustomModal
        visible={modalCloseConferenceVisible}
        title="Thank you so much for joining the Hacking HR 2022 Global Online Conference."
        onCancel={() => history.goBack()}
        width={650}
      >
        <p>
          The Global Conference application is closed (until 2023!). The videos
          from the tracks and their panels will be available on March 21st in
          the Conference Library (see the left hand menu. For now, only 2020 and
          2021 videos are available).
        </p>

        <p>
          You can download your Digital Certificate of Participation in the
          button below, only if you participated in at least one session at the
          Hacking HR 2022 Global Online Conference. The Digital Certificate is
          not applicable to those who only watch the recorded sessions after the
          conference.
        </p>

        <p>
          For the HR credits corresponding to the sessions you watch during the
          conference: a Personalized Participation Report will be available on
          March 21st. It will show you all the sessions you joined and the
          corresponding codes (ONLY if you are a PREMIUM member in the LAB,
          otherwise the credit codes will not be visible). For those who want to
          earn HR credits for watching the recorded videos you will be able to
          do so by clicking on CLAIM credits after watching the sessions.
        </p>

        <p>Thank you!</p>

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {userProfile?.sessionsJoined?.length > 0 ? (
            <CustomButton
              size="md"
              text="Download Certificate"
              onClick={() => {
                setModalVisibleCertificate(true);
                setModalCloseConferenceVisible(false);
              }}
            />
          ) : (
            <CustomButton
              size="md"
              text="Close"
              onClick={() => history.goBack()}
            />
          )}
        </div>
      </CustomModal>
      <AcceptTermsAndConditions />
    </div>
  );
};

GlobalConference.propTypes = {
  title: PropTypes.string,
};

GlobalConference.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  ...sessionSelector(state),
  userProfile: homeSelector(state).userProfile,
  allEvents: eventSelector(state).allEvents,
});

const mapDispatchToProps = {
  getAllSessions,
  getSessionsUserJoined,
  attendToGlobalConference,
  getAllEvent,
  setLoading,
  addToMyEventList,
  removeFromMyEventList,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConference);
