import React, { useState, useEffect } from "react";
import { Divider, Modal } from "antd";
import moment from "moment";
import ReactPlayer from "react-player/youtube";

import Interweave from "interweave";
import { connect } from "react-redux";
import { updateEventUserAssistence } from "redux/actions/event-actions";
import { getUser } from "redux/actions/home-actions";
import { getEvent } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { liveSelector } from "redux/selectors/liveSelector";
import { eventSelector } from "redux/selectors/eventSelector";

import Emitter from "services/emitter";
import TimeZoneList from "enum/TimezoneList";
import { EVENT_TYPES, INTERNAL_LINKS, TIMEZONE_LIST } from "enum";

import { CustomButton } from "components";

import "./style.scss";

const LivePage = ({
  userProfile,
  getUser,
  history,
  updateEventUserAssistence,
  live,
  myEvent,
  getEvent,
}) => {
  const [visibleEventConfirm, setVisibleEventConfirm] = useState(false);
  const [firstTimes, setFirstTimes] = useState([]);
  const [times, setTimes] = useState([]);
  const [isIdRepeated, setIsIdRepeated] = useState(false);
  const handleConfirmAssistence = () => {
    setVisibleEventConfirm(true);
  };

  const onConfirmAssistence = () => {
    let usersAssistence;
    usersAssistence = times.length > 0 && times.map((el) => JSON.stringify(el));
    if (!usersAssistence) {
      usersAssistence = firstTimes.map((el) => JSON.stringify(el));
    }

    if (!isIdRepeated) {
      updateEventUserAssistence({
        ...myEvent,
        usersAssistence,
      });
    }
    setVisibleEventConfirm(false);
  };

  useEffect(() => {
    getUser();
    if (live.event) {
      getEvent(Number(live.event));
    }
    setTimes([]);
    setFirstTimes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  useEffect(() => {
    setTimes([]);
    setFirstTimes([]);
    setIsIdRepeated(false);
  }, [myEvent]);

  /*
   * validating event date to confirm live assistence
   * adding user to the users assistence list
   */

  useEffect(() => {
    if (userProfile.id && myEvent.id) {
      const userAssistenceJsonToArray =
        myEvent.usersAssistence?.length > 0 &&
        myEvent.usersAssistence[0]?.map((el) => JSON.parse(el));
      setTimes(userAssistenceJsonToArray);

      myEvent.startAndEndTimes &&
        myEvent.startAndEndTimes.map((time, index) => {
          const start = time.startTime;
          const end = time.endTime;

          const usersEventAssistence = [];
          const userAssistence = userProfile.id;
          const timezone = TIMEZONE_LIST.find(
            (item) => item.value === myEvent.timezone
          );
          const convertedStartEventTime = moment(start)
            ?.tz(timezone?.utc[0])
            ?.utcOffset(timezone?.offset, true)
            ?.format();
          const convertedEndEventTime = moment(end)
            ?.tz(timezone?.utc[0])
            ?.utcOffset(timezone.offset, true)
            ?.format();

          const localDate = moment()
            ?.utc()
            ?.tz(timezone?.utc[0])
            ?.utcOffset(timezone.offset, true)
            ?.format();

          const isTodayEvent =
            moment(convertedStartEventTime).format("MM DD") ===
              moment(localDate).format("MM DD") &&
            moment(convertedEndEventTime).format("MM DD") ===
              moment(localDate).format("MM DD");

          if (userAssistenceJsonToArray) {
            const item = userAssistenceJsonToArray[index];
            if (
              item.usersAssistence?.includes(userAssistence) &&
              isTodayEvent
            ) {
              setIsIdRepeated(true);
            }
            if (item.usersAssistence?.length > 0 && isTodayEvent) {
              usersEventAssistence.push(
                ...item.usersAssistence,
                userAssistence
              );
            } else if (isTodayEvent) {
              usersEventAssistence.push(userAssistence);
            }
          }

          if (!isIdRepeated) {
            if (userAssistenceJsonToArray) {
              return setTimes((prev) => {
                if (isTodayEvent) {
                  prev[index] = {
                    start: prev[index].start,
                    end: prev[index].end,
                    usersAssistence: [
                      ...prev[index].usersAssistence,
                      userAssistence,
                    ],
                  };
                }
                prev = [...new Set(prev)];
                return [...prev];
              });
            } else {
              return setFirstTimes((prev) => {
                prev = [
                  ...prev,
                  {
                    start,
                    end,
                    usersAssistence: isTodayEvent ? [userAssistence] : [],
                  },
                ];
                prev = [...new Set(prev)];
                return [...prev];
              });
            }
          }
          return time;
        });
    }
  }, [myEvent, live, userProfile.id, isIdRepeated]);

  const onUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const searchTimeZone = (timezone) => {
    let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

    if (currentTimezone) {
      currentTimezone = currentTimezone.utc[0];
    } else {
      currentTimezone = timezone;
    }

    return currentTimezone
  }

  const showButtonFunction = (startAndEndTimes,timezone) => {
    let bul = false

    if(startAndEndTimes !== undefined && timezone !== undefined){
      let dateNow = moment(moment.utc(),'YYYY-MM-DD hh:mm a').tz(searchTimeZone(timezone))?.format('YYYYMMDDHHmm')

      startAndEndTimes.forEach((time) => {
        if(bul === false){
          if((Number(dateNow) > Number(moment(time?.startTime,"YYYY-MM-DD hh:mm a")?.subtract(5, 'minute')?.format('YYYYMMDDHHmm'))) === true
          && (Number(dateNow) < Number(moment(time?.endTime,"YYYY-MM-DD hh:mm a")?.add(1, 'minute')?.format('YYYYMMDDHHmm'))) === true){
            bul = true
          }
        }
      })
    }

    return bul

  }

  return (
    <>
      {(live.live === true || showButtonFunction(myEvent?.startAndEndTimes, myEvent?.timezone)) ? (
        <>
          {((live.live === true || showButtonFunction(myEvent?.startAndEndTimes, myEvent?.timezone)) && userProfile.memberShip === "premium") ||
          ((live.live === true || showButtonFunction(myEvent?.startAndEndTimes, myEvent?.timezone)) &&
            userProfile.memberShip === "free" &&
            live.isFree === true) ? (
            <div className="live-page">
              <div className="live-page--container">
                <div className="live-page--container--videoplayer">
                  <div className="video">
                    <ReactPlayer
                      url={live.url}
                      width="100%"
                      height="100%"
                      playing={true}
                    />
                  </div>
                  <div className="chat">
                    <iframe
                      title="live-chat"
                      src={`https://gaming.youtube.com/live_chat?v=${
                        live.url.split("=")[1]
                      }&embed_domain=${window.location.hostname}`}
                    ></iframe>
                  </div>
                </div>
                <div live-item>
                  {live.eventAssistence && (
                    <div className="live-confirm-assistence-button-container">
                      <CustomButton
                        text="Click here to confirm you are participating in this event"
                        onClick={isIdRepeated || handleConfirmAssistence}
                        className={isIdRepeated ? "custom-button-disabled" : ""}
                      />
                      <Modal
                        visible={visibleEventConfirm}
                        title="Attendance Confirmation"
                        width={500}
                        onCancel={() => setVisibleEventConfirm(false)}
                        onOk={() => onConfirmAssistence()}
                        okText="Confirm"
                      >
                        <p>
                          Confirming your participation to this event will
                          generate a Digital Badge of participation. The badge
                          will be available at the end of the event under your
                          profile, in My Learning, in the Digital Certificates
                          tab:
                        </p>
                        <div className="buttons-confirm-container"></div>
                      </Modal>
                    </div>
                  )}
                </div>
                <div className="live-item">
                  <Divider />
                  <h2>{live.title}</h2>
                </div>
                <div className="live-item">
                  <Interweave content={live.description} />
                </div>
              </div>
            </div>
          ) : (
            <div className="live-page">
              <div className="home-page-container--upgrade">
                {userProfile && userProfile.memberShip === "free" && (
                  <div className="recommend-card">
                    <h2 className="recommend-card-label">
                      Upgrade to a PREMIUM Membership and get access to this
                      LIVE event and also unlimited access to the premium
                      features in the Hacking HR LAB. Click on UPGRADE on the
                      top right
                    </h2>
                    <CustomButton
                      text="Upgrade"
                      type="primary"
                      size="xl"
                      className="recommend-card-upgrade"
                      onClick={onUpgrade}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        history.push(INTERNAL_LINKS.HOME)
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  live: liveSelector(state).live,
  myEvent: eventSelector(state).liveEvent,
});

const mapDispatchToProps = {
  updateEventUserAssistence,
  getUser,
  getEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(LivePage);
