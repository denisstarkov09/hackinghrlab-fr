import React from "react";
import PropTypes from "prop-types";

import { CustomButton } from "components";

import "./style.scss";

const TextData = {
  mentor: {
    buttonLabel: "Yes, I want to be a mentor",
    description: [
      "Click Below and Become a Mentor to Other Members of the Hacking HR Community",
    ],
  },
  mentee: {
    buttonLabel: "Yes, I want to be a mentee",
    description: [
      "Click Below and Find Mentors That Can Help You Achieve Your Professional Goals.",
    ],
  },
};

const WantCard = ({ type, onClick }) => {
  const { description, buttonLabel } = TextData[type];

  return (
    <div className="want-card">
      {description.map((desc, index) => (
        <h4 key={index} className="want-card-title">
          {desc}
        </h4>
      ))}
      <CustomButton
        className="want-card-button"
        text={buttonLabel}
        type="primary"
        size="xl"
        onClick={onClick}
      />
    </div>
  );
};

WantCard.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
};

WantCard.defaultProps = {
  type: "Yes, I want to be a mentor",
  onClick: () => {},
};

export default WantCard;
