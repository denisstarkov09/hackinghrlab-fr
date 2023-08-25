import React from "react";
import PropTypes from 'prop-types';

import IconCalendar from "images/icon-no-event.svg";

import "./style.scss";

const NoItemsMessageCard = ({ message }) => (
  <div className="no-items-card">
    <div className="no-items-card-icon">
      <img src={IconCalendar} alt="no-items-img" />
    </div>
    <span className="no-items-card-desc">
      {message}
    </span>
  </div>
);

NoItemsMessageCard.propTypes = {
  message: PropTypes.string,
};

NoItemsMessageCard.defaultProps = {
  message: 'There are no items for you at the moment',
};

export default NoItemsMessageCard;
