import React from "react";
import PropTypes from "prop-types";

import {
  CustomButton,
} from "components";

import "./style.scss";

const JourneyHomeMessage = ({
  onClick
}) => {
  return (<div className="learning-journey-message">
    <h3>
      Start a journey and learn together with HHR
    </h3>
    <h3>
      Do you want to create your first learning journey?
    </h3>
    <CustomButton onClick={onClick} text="Yes, I want to create a journey" size="md" />
  </div>);
};

JourneyHomeMessage.propTypes = {
  onClick: PropTypes.func,
};

JourneyHomeMessage.defaultProps = {
  onClick: () => {},
};

export default JourneyHomeMessage;