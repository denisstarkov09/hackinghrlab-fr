import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "antd";

import "./style.scss";

class DateAvatar extends React.Component {
  render() {
    const { day, month, className, ...rest } = this.props;
    const newClassName = `${className} date-avatar`;

    return (
      <Avatar className={newClassName} {...rest}>
        <h3>{day}</h3>
        <h5>{month}</h5>
      </Avatar>
    );
  }
}

DateAvatar.propTypes = {
  day: PropTypes.number,
  month: PropTypes.string,
  className: PropTypes.string,
};

DateAvatar.defaultProps = {
  day: 1,
  month: "Jan",
  className: "",
};

export default DateAvatar;
