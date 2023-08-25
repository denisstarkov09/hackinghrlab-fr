import React from "react";
import moment from "moment";
import { Dropdown, Menu } from "antd";

import "./style.scss";
import { CalendarFilled, DownOutlined } from "@ant-design/icons";

const CalendarCard = ({ activity }) => {
  const deliveryDate = moment(activity.deliveryDate).format("YYYYMMDD");

  const userTimezone = moment.tz.guess();

  const onClickDownloadCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/simulation-sprint-activity/ics/${activity.id}?userTimezone=${userTimezone}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
      activity.title
    )}&dates=${deliveryDate}/${deliveryDate}&location=https://www.hackinghrlab.io/&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${deliveryDate}&et=${deliveryDate}&title=${encodeURIComponent(
      activity.title
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
    <div className="simulation-sprint-calendar-card">
      <div className="simulation-sprint-calendar-card-icon">
        <CalendarFilled />
      </div>
      <div className="simulation-sprint-calendar-card-container">
        <div className="simulation-sprint-calendar-card-title">
          <h1>{activity.title}</h1>
          <h2>({activity.type})</h2>
        </div>

        <div className="simulation-sprint-calendar-card-date">
          <h4>Date:</h4>
          <span>{moment(activity.deliveryDate).format("LL")}</span>
        </div>

        <div>
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
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
