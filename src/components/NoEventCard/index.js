import React from "react";

import IconCalendar from "images/icon-no-event.svg";

import "./style.scss";

const NoEventCard = () => (
  <div className="no-event-card">
    <div className="no-event-card-icon">
      <img src={IconCalendar} alt="no-event-img" />
    </div>
    <span className="no-event-card-desc">
      There are no events for you at the moment
    </span>
  </div>
);

export default NoEventCard;
