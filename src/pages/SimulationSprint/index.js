import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Dropdown, Menu, notification, Space } from "antd";
import moment from "moment-timezone";
import { CustomButton, CustomModal } from "components";
import { EVENT_TYPES, INTERNAL_LINKS } from "enum";
import IconBack from "images/icon-back.svg";

import { getSimulationSprint } from "redux/actions/simulationSprint-actions";
import { createSimulationSprintParticipant } from "redux/actions/simulationSprintParticipant-action";

import { simulationSprintSelector } from "redux/selectors/simulationSprintSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import "./style.scss";
import { convertToLocalTime } from "utils/format";
import { DownOutlined } from "@ant-design/icons";
import Emitter from "services/emitter";

const regex = /<[^>]+>/g;

const SimulationSprint = ({
  getSimulationSprint,
  createSimulationSprintParticipant,
  simulationSprint,
  userProfile,
}) => {
  const [confirmJoinModal, setConfirmJoinModal] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const convertedStartTime = moment(simulationSprint.startDate).tz(
    "America/Los_Angeles"
  );

  const convertedEndTime = moment(simulationSprint.endDate).tz(
    "America/Los_Angeles"
  );

  const dateToCloseJoinSimulation = convertedStartTime
    .subtract(1, "days")
    .tz("America/Los_Angeles");

  const onClickDownloadCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/simulation-sprint/ics/${simulationSprint.id}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${
      simulationSprint.title
    }&dates=${convertToLocalTime(convertedStartTime).format(
      "YYYYMMDDTHHmmSSS"
    )}/${convertToLocalTime(convertedEndTime).format(
      "YYYYMMDDTHHmmSSS"
    )}&details=${simulationSprint?.description?.html.replace(
      regex,
      ""
    )}&location=https://www.hackinghrlab.io/simulation-sprints/${
      simulationSprint.id
    }&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${convertToLocalTime(
      convertedStartTime
    ).format("YYYYMMDDTHHmm")}&et=${convertToLocalTime(convertedEndTime).format(
      "YYYYMMDDTHHmm"
    )}&title=${
      simulationSprint.title
    }&desc=${simulationSprint?.description?.html.replace(
      regex,
      ""
    )}&in_loc=https://www.hackinghrlab.io/simulation-sprints/${
      simulationSprint.id
    }`;

    window.open(yahooCalendarUrl, "_blank");
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  let displayBtn;
  let disabled = false;
  let typeButton = "primary";

  if (
    dateToCloseJoinSimulation.isBefore(moment()) &&
    !simulationSprint.SimulationSprintParticipants?.some(
      (participant) => participant.UserId === userProfile.id
    )
  ) {
    displayBtn = "This simulation is closed";
    disabled = true;
  } else if (
    simulationSprint.SimulationSprintParticipants?.some(
      (participant) => participant.UserId === userProfile.id
    ) &&
    convertedStartTime.isAfter(moment()) &&
    convertedEndTime.isBefore(moment())
  ) {
    displayBtn = "Enter the Dashboard";
  } else if (
    dateToCloseJoinSimulation.isAfter(moment()) &&
    !simulationSprint.SimulationSprintParticipants?.some(
      (participant) => participant.UserId === userProfile.id
    )
  ) {
    displayBtn = "Join";
  } else {
    const duration = moment.duration(convertedStartTime.diff(moment()));
    const days = Math.floor(duration.asDays().toFixed(2));
    const hours = Math.floor(duration.asHours().toFixed(2));
    const minutes = duration.minutes().toFixed(2);
    displayBtn = `This simulation will start in ${
      days >= 1
        ? `${days} days`
        : hours >= 1
        ? `${hours} hours`
        : `${minutes} minutes`
    }`;
    disabled = true;
  }

  const handleClick = () => {
    if (typeButton === "primary") {
      if (userProfile.memberShip !== "premium") {
        return setShowFirewall(true);
      }
      return setConfirmJoinModal(true);
    }
    history.push(`${INTERNAL_LINKS.SIMULATION_SPRINTS}/${id}/resources`);
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

  useEffect(() => {
    getSimulationSprint(id, (error) => {
      if (error) {
        history.push(
          `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
        );
      }
    });
  }, [getSimulationSprint, id, history]);

  if (!simulationSprint.id) {
    return <></>;
  }

  const handleJoinSimulationSprint = () => {
    setConfirmJoinModal(false);
    createSimulationSprintParticipant(
      {
        SimulationSprintId: simulationSprint.id,
        UserId: userProfile.id,
      },
      (error) => {
        if (error) {
          return notification.error({
            message: error,
          });
        }

        notification.success({
          message: "You have successfully joined ",
        });

        getSimulationSprint(id, (error) => {
          if (error) {
            history.push(
              `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
            );
          }
        });
      }
    );
  };

  return (
    <div className="sprints-detail-page">
      <div className="sprints-detail-page-header">
        <div className="sprints-detail-page-header-content">
          <div>
            <div
              className="sprints-detail-page-header-content-back-btn"
              onClick={() =>
                history.push(
                  `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
                )
              }
            >
              <div className="sprints-detail-page-header-content-back">
                <div className="sprints-detail-page-header-content-back-img">
                  <img src={IconBack} alt="icon-back" />
                </div>
                <h4>Back to List</h4>
              </div>
            </div>
            <div className="title">
              <h2>{simulationSprint.title}</h2>
            </div>
          </div>
        </div>
        <div className="sprints-btn">
          <CustomButton
            text={displayBtn}
            type={typeButton}
            htmlType="button"
            onClick={handleClick}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="sprints-detail-page-body">
        <div className="sprints-detail-page-body-content">
          <Space direction="vertical" size="large">
            <Space direction="vertical" size="large">
              <h3>Description </h3>
              <div
                className="details"
                dangerouslySetInnerHTML={{
                  __html: (simulationSprint.description || {}).html || "",
                }}
              />
            </Space>

            <Space direction="vertical" size="large">
              <h3>Schedule</h3>
              <div className="details">
                Starting on {moment(simulationSprint.startDate).format("LL")}
              </div>
              <div className="details">
                Finishing on {moment(simulationSprint.endDate).format("LL")}
              </div>
            </Space>

            {simulationSprint?.SimulationSprintParticipants.some(
              (participant) => participant.UserId === userProfile.id
            ) && (
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
          </Space>
        </div>
      </div>
      <CustomModal
        visible={confirmJoinModal}
        title="Join this Sprint?"
        subTitle="Click confirm if you want to join"
        onCancel={() => setConfirmJoinModal(false)}
        width={376}
      >
        <div className="confirm-modal">
          <CustomButton
            text="Cancel"
            type="primary outlined"
            htmlType="button"
            onClick={() => setConfirmJoinModal(false)}
          />
          <CustomButton
            text="Confirm"
            type="primary"
            htmlType="button"
            onClick={() => handleJoinSimulationSprint()}
          />
        </div>
      </CustomModal>

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
    </div>
  );
};

const mapStateToProps = (state) => ({
  simulationSprint: simulationSprintSelector(state).simulationSprint,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getSimulationSprint,
  createSimulationSprintParticipant,
};

export default connect(mapStateToProps, mapDispatchToProps)(SimulationSprint);
