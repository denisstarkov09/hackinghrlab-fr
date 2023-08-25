import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import { SpecialtyItem, CustomButton } from "components";
import { ReactComponent as IconChevronDown } from "images/icon-chevron-down.svg";
import { convertToLocalTime } from "utils/format";
import "./style.scss";

const BonfireCard = ({
  bonfire,
  added,
  isBonfireCreator,
  isUserInvited,
  onAddBonfire,
  onRemoveBonfire,
  editBonfire,
  deleteBonfire,
  onDownloadCsv,
}) => {
  const [hideInfo, setHideInfo] = useState(true);

  const convertedStartTime = convertToLocalTime(
    bonfire.startTime,
    bonfire.timezone
  ).format("YYYYMMDDTHHmmss");

  const convertedEndTime = convertToLocalTime(
    bonfire.endTime,
    bonfire.timezone
  ).format("YYYYMMDDTHHmmss");

  const userTimezone = moment.tz.guess();

  const onClickDownloadCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/bonfire/ics/${bonfire.id}?userTimezone=${userTimezone}`,
      "_blank"
    );
  };
  const onClickAddGoogleCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
      bonfire.title
    )}&dates=${convertedStartTime}/${convertedEndTime}&details=${encodeURIComponent(
      bonfire.description
    )}&location=https://www.hackinghrlab.io/global-conference&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${convertedStartTime}&et=${convertedEndTime}&title=${encodeURIComponent(
      bonfire.title
    )}&desc=${encodeURIComponent(
      bonfire.description
    )}&in_loc=https://www.hackinghrlab.io/global-conference`;
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

  return (
    <div className="bonfire-card">
      <div className="acc-session-header">
        <h3>{bonfire.title}</h3>

        {!added && !isBonfireCreator && (
          <CustomButton
            size="sm"
            text={isUserInvited ? "CONFIRM ATTENDANCE" : `JOIN`}
            onClick={onAddBonfire}
          />
        )}

        {isBonfireCreator && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "150px",
            }}
          >
            <CustomButton
              type="primary outlined"
              size="md"
              text="Edit"
              onClick={editBonfire}
              className="remove-buttom"
            />

            <CustomButton
              type="third outlined"
              size="md"
              text="Delete"
              onClick={deleteBonfire}
              className="remove-buttom"
            />

            <CustomButton
              type="secondary"
              size="md"
              text="Download list of participants"
              onClick={onDownloadCsv}
              className="remove-buttom"
            />
            <CustomButton
              size="sm"
              text="Go to Bonfire"
              onClick={() => window.open(bonfire.link, "_blank")}
            />
          </div>
        )}

        {added && !isBonfireCreator && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80px",
            }}
          >
            <CustomButton
              type="primary outlined"
              size="md"
              text="Withdraw"
              onClick={onRemoveBonfire}
              className="remove-buttom"
            />
            <CustomButton
              size="sm"
              text="Go to Bonfire"
              onClick={() => window.open(bonfire.link, "_blank")}
            />
          </div>
        )}
      </div>

      <div className="d-flex justify-between">
        <div>
          <div className="acc-session-date">
            {moment(bonfire.startTime).format("MMM, D, YYYY")}
          </div>
          <div className="acc-session-time">
            {bonfire.hours} ({userTimezone})
          </div>
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
              style={{ marginTop: ".5rem" }}
            >
              Download calendar <DownOutlined />
            </a>
          </Dropdown>
        )}
      </div>
      {added && <div className="acc-session-added-tag">I am joining</div>}
      <div className="d-flex justify-between align-center">
        <div className="acc-session-categories">
          {bonfire.categories.map((category, i) => (
            <SpecialtyItem title={category} key={i} />
          ))}
        </div>
        <div
          className="acc-session-toggle"
          onClick={() => setHideInfo(!hideInfo)}
        >
          {hideInfo ? "More Information" : "Hide information"}
          <div className={clsx("acc-session-toggle-icon", { hide: !hideInfo })}>
            <IconChevronDown />
          </div>
        </div>
      </div>
      {!hideInfo && (
        <div className="acc-details">
          {bonfire.description && (
            <>
              <h4>Description</h4>
              <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
                {bonfire.description}
              </p>
            </>
          )}

          <div className="acc-details">
            {bonfire.bonfireOrganizer && (
              <>
                <h4>Bonfire Organizer</h4>
                <a
                  href={bonfire.bonfireOrganizer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="acc-details-speaker">
                    <div className="acc-details-speaker-image">
                      {bonfire.bonfireOrganizer.img ? (
                        <img
                          src={bonfire.bonfireOrganizer.img}
                          alt="bonfire organizer"
                        />
                      ) : (
                        <div className="empty" />
                      )}
                    </div>
                    <div className="acc-details-speaker-desc">
                      <h4>
                        {bonfire.bonfireOrganizer.firstName}{" "}
                        {bonfire.bonfireOrganizer.lastName}
                      </h4>
                      <h5>{bonfire.bonfireOrganizer.company}</h5>
                      <h5>{bonfire.bonfireOrganizer.titleProfessions}</h5>
                    </div>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

BonfireCard.propTypes = {
  bonfire: PropTypes.object,
  added: PropTypes.bool,
  onAddBonfire: PropTypes.func,
  onRemoveBonfire: PropTypes.func,
  onDownloadCsv: PropTypes.func,
};

BonfireCard.defaultProps = {
  bonfire: {},
  added: false,
  onAddSession: () => {},
  onRemoveBonfire: () => {},
  onDownloadCsv: () => {},
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(BonfireCard);
