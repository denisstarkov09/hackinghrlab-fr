import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { notification, Tabs } from "antd";

import MicroConferenceSkeleton from "./MicroConferenceSkeleton";
import MicroConferenceVideosList from "./MicroConferenceVideosList";
import MicroConferenceVideoWrapper from "./MicroConferenceVideoWrapper";

import {
  getSession,
  getSessionClasses,
  claimSession,
} from "redux/actions/session-actions";

import { homeSelector } from "redux/selectors/homeSelector";
import { sessionSelector } from "redux/selectors/sessionSelector";

import { EVENT_TYPES, INTERNAL_LINKS } from "enum";
import { CustomButton, SpeakerCard } from "components";
import IconBack from "images/icon-back.svg";

import "./style.scss";
// import { DownloadOutlined } from "@ant-design/icons";
import Emitter from "services/emitter";
import LibraryClaimModal from "components/LibraryCard/LibraryClaimModal";

const { TabPane } = Tabs;

const useMicroConferenceQuery = (id) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");

    let timeout = setTimeout(() => {
      setStatus("success");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return {
    microConferenceData: data,
    setMicroConferenceData: setData,
    status,
  };
};

const MicroConference = ({
  history,
  match,
  user,
  session,
  classes,
  getSession,
  getSessionClasses,
  claimSession,
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const { status } = useMicroConferenceQuery(match.params.id);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  const type = query.get("type");

  useEffect(() => {
    if (type !== "2022" || type !== undefined || type !== null) {
      getSession(match.params.id, type);
      getSessionClasses(match.params.id, type);
    } else {
      getSession(match.params.id, '2022');
      getSessionClasses(match.params.id, '2022');
    }

  }, [getSession, getSessionClasses, match, type]);

  const activeVideoUrl = useMemo(() => {
    if (classes && classes.length) {
      let videoObject = classes.find((item) => item.id === activeVideoId);
      if (videoObject && videoObject.videoUrl) {
        return videoObject.videoUrl;
      }
      return null;
    }
    return null;
  }, [activeVideoId, classes]);

  const onClaimCredits = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user && user.memberShip === "premium") {
      setModalVisible(true);
    } else {
      setShowFirewall(true);
    }
  };

  const onHRClaimOffered = async () => {
    claimSession(session.id, type, (err) => {
      if (err) {
        notification.error({
          message: "Error",
          description: (err || {}).msg,
        });
      } else {
        notification.info({
          message: "Email was sent successfully.",
        });
        setModalVisible(false);
      }
    });
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  return (
    <div className="micro-conference__page">
      <div className="micro-conference__container">
        {status === "loading" && <MicroConferenceSkeleton />}

        {status === "success" && (
          <>
            <div className="micro-conference__row">
              <div className="micro-conference__row-1">
                <div className="micro-conference__row-1--video-list">
                  <div className="micro-conference__row-1--video-list--title">
                    <h2>{(type === '2023') ? session?.panelName : session?.title}</h2>
                  </div>
                  <MicroConferenceVideosList
                    list={classes}
                    setActiveVideoId={(id) => {
                      setActiveVideoId(id)
                    }}
                    activeVideoId={activeVideoId}
                    sessionId={match.params.id}
                    type={type}
                  />

                  <CustomButton
                    className="claim-credits"
                    type="primary"
                    size="md"
                    text="Claim HR Credits"
                    style={{
                      marginTop: "8px",
                      width: "100%",
                    }}
                    onClick={onClaimCredits}
                  />

                  <Link
                    to={INTERNAL_LINKS.CONFERENCE_2023}
                    className="micro-conference__row-1--video-list--back-link"
                  >
                    <img src={IconBack} alt="icon-back" />
                    <h2>Back to {(type === "2023") ? "Forward 2023" : "Conference Library"}</h2>
                  </Link>
                </div>
                <div className="micro-class__row-1--video-player">
                  <MicroConferenceVideoWrapper
                    url={activeVideoUrl ? activeVideoUrl : null}
                    id={activeVideoId}
                    type={type}
                    sessionId={match.params.id}
                  />

                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Session Information" key="1">
                      <div>
                        <div className="micro-conference__description-card">
                          <h3>Session Description</h3>
                          <p className="micro-conference__description-p">
                            {session?.description}
                          </p>
                          {/* <div style={{ marginTop: "10px" }}>
                            <h3>Session Classes Information</h3>
                            {classes?.map((sessionClass) => (
                              <>
                                {(sessionClass?.audioFileUrl ||
                                  sessionClass?.documentFileUrl) && (
                                  <div style={{ marginTop: "10px" }}>
                                    <h5>{sessionClass?.title}</h5>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {sessionClass?.audioFileUrl && (
                                        <a
                                          href={sessionClass.audioFileUrl}
                                          download
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Download Session Audio{" "}
                                          <DownloadOutlined />
                                        </a>
                                      )}

                                      {sessionClass?.documentFileUrl && (
                                        <a
                                          href={sessionClass.documentFileUrl}
                                          download
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Download Session Text{" "}
                                          <DownloadOutlined />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            ))}
                          </div> */}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab="Session Speakers" key="2">
                      <div>
                        <div className="micro-conference__description-card">
                          <h3>Session Speakers</h3>

                          <div className="micro-conference__description-speakers-list">
                            {(session?.speakers?.length > 0 || session?.SpeakerMemberPanels?.length > 0) &&
                              (type === '2023' ? session?.SpeakerMemberPanels : session?.speakers)?.map((speaker) => (
                                <SpeakerCard
                                  key={speaker?.id}
                                  speaker={speaker}
                                  type={type}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              {showFirewall && (
                <div
                  className="conference-card-firewall"
                  onClick={() => setShowFirewall(false)}
                >
                  <div
                    className="upgrade-notification-panel"
                    onClick={planUpgrade}
                  >
                    <h3>
                      Upgrade to a PREMIUM Membership and get unlimited access
                      to the LAB features
                    </h3>
                  </div>
                </div>
              )}
            </div>

            <LibraryClaimModal
              visible={modalVisible}
              title="HR Credit Offered"
              destroyOnClose={true}
              data={session}
              onClaim={onHRClaimOffered}
              onCancel={() => setModalVisible(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  session: sessionSelector(state).session,
  classes: sessionSelector(state).classes,
  user: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getSession,
  getSessionClasses,
  claimSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(MicroConference);
