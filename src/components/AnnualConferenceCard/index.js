import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";
import { CustomButton, SpecialtyItem } from "components";
import { Dropdown, Menu, Tooltip, notification, Modal } from "antd";
import { InfoCircleOutlined, DownOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import { isEmpty } from "lodash";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  saveForLaterSession,
  setSessionViewed,
} from "redux/actions/session-actions";
import Emitter from "services/emitter";
import { ReactComponent as IconChevronDown } from "images/icon-chevron-down.svg";
import { EVENT_TYPES, TIMEZONE_LIST } from "../../enum";

import { convertToLocalTime } from "utils/format";
import "./style.scss";

const ButtonContainer = ({
  session,
  added,
  attended,
  convertedStartTime,
  convertedEndTime,
  userProfile,
  onAddSession,
  onRemoveSession,
  joinedOtherSession,
  joinedSession,
}) => {
  const interval = 1000;
  const currentTime = moment().unix();
  const diffTime = convertedStartTime.unix() - currentTime;
  let duration = moment.duration(diffTime * interval, "milliseconds");

  const [hoursStartSession, setHoursStartSession] = useState(
    `Starting in: ${
      Math.floor(duration.asHours().toFixed(2)) > 0
        ? `${Math.floor(duration.asHours().toFixed(2))} hours and `
        : ""
    } ${duration.minutes()} minutes`
  );
  const [timeLeft, setTimeLeft] = useState(
    moment.duration(convertedStartTime.diff(moment.now())).asMinutes()
  );

  useEffect(() => {
    let duration = moment.duration(diffTime * interval, "milliseconds");
    setInterval(() => {
      duration = moment.duration(duration - 60000, "milliseconds");
      setHoursStartSession(
        `Starting in: ${
          Math.floor(duration.asHours().toFixed(2)) > 0
            ? `${Math.floor(duration.asHours().toFixed(2))} hours and `
            : ""
        } ${duration.minutes()} minutes`
      );

      setTimeLeft(duration.asMinutes());
    }, 60000);
  }, [diffTime]);

  if (
    moment().date() < 1 &&
    moment().month() <= 2 &&
    moment().year() <= 2022 &&
    timeLeft < 69120
  ) {
    setTimeLeft(80000);
  }

  const counterdown = useMemo(() => {
    return (
      <CustomButton
        type="primary"
        size="md"
        text={`${hoursStartSession}`}
        disabled={true}
        style={{ marginTop: "5px", maxWidth: "340px" }}
      />
    );
  }, [hoursStartSession]);

  return (
    <div className="button-container">
      {added ? (
        <CustomButton
          type="primary outlined"
          size="sm"
          text="Remove from My Personalized Agenda"
          onClick={onRemoveSession}
          className="remove-buttom"
          style={{ alignSelf: "flex-end" }}
        />
      ) : attended ? (
        <CustomButton
          size="sm"
          text="Add To My Personalized Agenda"
          onClick={onAddSession}
        />
      ) : null}

      {session.totalusersjoined >= 30 &&
      session.type === "Roundtable" &&
      !userProfile?.sessionsJoined?.includes(session.id) ? (
        <CustomButton
          type="primary"
          size="md"
          text="Session Full"
          disabled={true}
          style={{ marginTop: "5px" }}
        />
      ) : timeLeft <= 5 &&
        moment.duration(convertedEndTime.diff(moment.now())).asMinutes() > 0 ? (
        <CustomButton
          type="primary"
          size="md"
          text="Join"
          className={
            joinedOtherSession &&
            !userProfile?.sessionsJoined?.includes(session.id)
              ? "custom-button-disabled"
              : null
          }
          onClick={() => joinedSession()}
          style={{
            marginTop: "5px",
            maxWidth: "150px",
            width: "100%",
            alignSelf: "flex-end",
          }}
        />
      ) : timeLeft >= -10 && timeLeft < 69120 ? (
        counterdown
      ) : timeLeft <= -10 &&
        !userProfile?.sessionsJoined?.includes(session.id) ? (
        <CustomButton
          type="primary"
          size="md"
          text="This Session Is Now Closed"
          disabled={true}
          style={{ marginTop: "5px" }}
        />
      ) : timeLeft <= 5 && userProfile?.sessionsJoined?.includes(session.id) ? (
        <CustomButton
          type="primary"
          size="md"
          text="Join"
          className={
            joinedOtherSession &&
            !userProfile?.sessionsJoined?.includes(session.id)
              ? "custom-button-disabled"
              : null
          }
          onClick={() => joinedSession()}
          style={{
            marginTop: "5px",
            maxWidth: "150px",
            width: "100%",
            alignSelf: "flex-end",
          }}
        />
      ) : null}
    </div>
  );
};

const ButtonContainerConference = ({
  session,
  userProfile,
  onWatch,
  saveForLaterSession,
  setSessionViewed,
}) => {
  const handleSaveForLater = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isSavedForLater =
      !isEmpty(session.saveForLater) &&
      session.saveForLater.includes(userProfile.id);
    const status = isSavedForLater ? "not saved" : "saved";

    saveForLaterSession(session.id, userProfile.id, status);
  };

  return (
    <div className="button-container">
      {session.type === "Certificate Track and Panels" && (
        <CustomButton type="primary" size="xs" text="Watch" onClick={onWatch} />
      )}

      <CustomButton
        className="mark-viewed"
        type={
          session?.viewed[userProfile.id] === "mark" ||
          userProfile?.sessionsJoined?.includes(session.id)
            ? "remove"
            : "secondary"
        }
        size="xs"
        text={
          session?.viewed[userProfile.id] === "mark" ||
          userProfile?.sessionsJoined?.includes(session.id)
            ? "Viewed"
            : "Mark As Completed"
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (userProfile?.sessionsJoined?.includes(session.id)) return;
          setSessionViewed(
            session.id,
            userProfile.id,
            session.viewed[userProfile.id] === "mark" ? "unmark" : "mark"
          );
        }}
        style={{
          marginTop: "8px",
        }}
      />

      {session.viewed &&
        session.viewed[userProfile.id] !== "mark" &&
        session.type === "Certificate Track and Panels" && (
          <CustomButton
            className="save-for-later"
            type={
              !isEmpty(session.saveForLater) &&
              session.saveForLater.includes(userProfile.id)
                ? "remove"
                : "third"
            }
            size="xs"
            text={
              !isEmpty(session.saveForLater) &&
              session.saveForLater.includes(userProfile.id)
                ? "Unsave"
                : "Save for later"
            }
            onClick={handleSaveForLater}
          />
        )}
    </div>
  );
};

const AnnualConferenceCard = React.memo(
  ({
    session,
    typeConference,
    attended,
    added,
    joinedOtherSession,
    onAddSession,
    onRemoveSession,
    onJoinedSession,
    onWatch,
    userProfile,
    saveForLaterSession,
    claimSession,
    setSessionViewed,
    savedItem,
  }) => {
    const timezone = TIMEZONE_LIST.find(
      (item) => item.value === session.timezone
    );
    const offset = timezone?.offset;

    const convertedStartTime = moment(session.startTime)
      ?.tz(timezone?.utc[0])
      ?.utcOffset(offset, true);

    const convertedEndTime = moment(session.endTime)
      ?.tz(timezone?.utc[0])
      ?.utcOffset(offset, true);

    const [hideInfo, setHideInfo] = useState(true);
    const [showFirewall, setShowFirewall] = useState(false);
    const [
      visibleConfirmJoinedOtherSession,
      setVisibleConfirmJoinedOtherSession,
    ] = useState(false);

    const onClickDownloadCalendar = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(
        `${process.env.REACT_APP_API_ENDPOINT}/public/global-conference/ics/${session.id}?userTimezone=${userProfile.timezone}`,
        "_blank"
      );
    };

    const onClickAddGoogleCalendar = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${
        session.title
      }&dates=${convertToLocalTime(convertedStartTime).format(
        "YYYYMMDDTHHmmSSS"
      )}/${convertToLocalTime(convertedEndTime).format(
        "YYYYMMDDTHHmmSSS"
      )}&details=${
        session.description
      }&location=${"https://www.hackinghrlab.io/global-conference"}&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
      window.open(googleCalendarUrl, "_blank");
    };

    const onClickAddYahooCalendar = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${convertToLocalTime(
        convertedStartTime
      ).format("YYYYMMDDTHHmm")}&et=${convertToLocalTime(
        convertedEndTime
      ).format("YYYYMMDDTHHmm")}&title=${session.title}&desc=${
        session.description
      }&in_loc=https://www.hackinghrlab.io/global-conference`;

      window.open(yahooCalendarUrl, "_blank");
    };

    const downloadDropdownOptions = () => (
      <Menu style={{ position: "relative", bottom: "70px" }}>
        <Menu.Item key="1">
          <a href="/#" onClick={(e) => onClickDownloadCalendar(e)}>
            Download ICS File
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="/#" onClick={(e) => onClickAddGoogleCalendar(e)}>
            Add to Google Calendar
          </a>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="/#" onClick={(e) => onClickAddYahooCalendar(e)}>
            Add to Yahoo Calendar
          </a>
        </Menu.Item>
      </Menu>
    );

    const joinedSession = () => {
      if (
        joinedOtherSession &&
        !userProfile?.sessionsJoined?.includes(session.id)
      ) {
        return notification.error({
          message: "Error",
          description:
            "You can’t join this session since you are registered for another session at this same time",
        });
      } else if (userProfile?.sessionsJoined?.includes(session.id)) {
        return onJoinedSession(session);
      }

      setVisibleConfirmJoinedOtherSession(true);
    };

    const planUpgrade = () => {
      Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
    };

    return (
      <div className="annual-conference-card acc">
        <div className="acc-session-header">
          <h3>{session.title}</h3>

          {typeConference !== "conference-library" ? (
            <ButtonContainer
              session={session}
              added={added}
              attended={attended}
              userProfile={userProfile}
              convertedStartTime={convertedStartTime}
              convertedEndTime={convertedEndTime}
              onAddSession={onAddSession}
              onRemoveSession={onRemoveSession}
              joinedOtherSession={joinedOtherSession}
              joinedSession={joinedSession}
            />
          ) : (
            <ButtonContainerConference
              session={session}
              userProfile={userProfile}
              onWatch={onWatch}
              saveForLaterSession={saveForLaterSession}
              setSessionViewed={setSessionViewed}
            />
          )}
        </div>
        {added && <div className="acc-session-added-tag">Added</div>}
        {userProfile?.sessionsJoined?.includes(session.id) && (
          <div className="acc-session-added-tag">
            Viewed During The Conference
          </div>
        )}
        <div className="d-flex justify-between">
          <div>
            <div className="acc-session-type">{`Session type: ${session.type}`}</div>
            <div className="acc-session-date">{session.date}</div>
            {typeConference !== "conference-library" && (
              <div className="acc-session-time">
                {session.period} {session.timezone}{" "}
                <Tooltip
                  placement="right"
                  title={
                    <span>
                      Where are you located? If you are not located in the West
                      Coast of the United States, Canada or Mexico, then you are
                      NOT in Pacific Time Zone. Please convert to your
                      corresponding time zone here:{" "}
                      <a
                        href="https://www.timeanddate.com/worldclock/converter.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.timeanddate.com
                      </a>
                    </span>
                  }
                  overlayStyle={{ background: "black" }}
                  overlayInnerStyle={{ background: "black" }}
                >
                  <InfoCircleOutlined className="conference-list-info-icon" />
                </Tooltip>
              </div>
            )}
          </div>
          {added && (
            <Dropdown overlay={downloadDropdownOptions}>
              <a
                href="/#"
                className="ant-dropdown-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Download calendar <DownOutlined />
              </a>
            </Dropdown>
          )}
        </div>

        <div className="acc-session-container">
          <div className="acc-session-categories">
            {session.categories.map((category, i) => (
              <SpecialtyItem key={i} title={category} />
            ))}
          </div>

          {!savedItem && (
            <div
              className="acc-session-toggle"
              onClick={() => setHideInfo(!hideInfo)}
            >
              {hideInfo ? "Review session" : "Hide information"}
              <div
                className={clsx("acc-session-toggle-icon", { hide: !hideInfo })}
              >
                <IconChevronDown />
              </div>
            </div>
          )}
        </div>
        {!hideInfo && (
          <div className="acc-details">
            {session.description && (
              <>
                <h4>Description</h4>
                <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
                  {session.description}
                </p>
              </>
            )}
            <div className="acc-details-other-brands">
              {(session.brands || []).map((brand, index) => (
                <div className="session-brand" key={index}>
                  <img src={brand} alt="brand-img" />
                </div>
              ))}
            </div>

            <div className="acc-details">
              <h4>Recertifications Credits</h4>
              <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
                {userProfile.memberShip === "premium"
                  ? session.recertification_credits
                  : "HR Recertification Credits: Only available to PREMIUM"}
              </p>
            </div>

            <div className="acc-details">
              {session.speakers && <h4>Speakers</h4>}
              {(session.speakers || []).map((speaker, index) => (
                <a
                  href={speaker.linkSpeaker}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <div className="acc-details-speaker">
                    <div className="acc-details-speaker-image">
                      {speaker.img ? (
                        <img src={speaker.img} alt="speaker-img" />
                      ) : (
                        <div className="empty" />
                      )}
                    </div>
                    <div className="acc-details-speaker-desc">
                      <h4>{speaker.name}</h4>
                      <h5>{speaker.description}</h5>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {showFirewall && (
          <div
            className="conference-card-firewall"
            onClick={() => setShowFirewall(false)}
          >
            <div className="upgrade-notification-panel" onClick={planUpgrade}>
              <h3>
                Upgrade to a PREMIUM Membership and get unlimited access to the
                LAB features
              </h3>
            </div>
          </div>
        )}

        <Modal
          visible={visibleConfirmJoinedOtherSession}
          title="Are you sure you want to join this session?"
          width={500}
          onCancel={() => setVisibleConfirmJoinedOtherSession(false)}
          onOk={() => {
            onJoinedSession(session);
            setVisibleConfirmJoinedOtherSession(false);
          }}
          okText="Confirm"
        >
          <p>
            You will not be able to join any other session at the same time.
          </p>
        </Modal>
      </div>
    );
  }
);

AnnualConferenceCard.propTypes = {
  session: PropTypes.object,
  attended: PropTypes.number,
  added: PropTypes.bool,
  onAddSession: PropTypes.func,
  onRemoveSession: PropTypes.func,
};

AnnualConferenceCard.defaultProps = {
  session: {},
  attended: 0,
  added: false,
  onAddSession: () => {},
  onRemoveSession: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  saveForLaterSession,
  setSessionViewed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnualConferenceCard);
