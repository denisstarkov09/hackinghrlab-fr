import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const BaseComponent = ({ title }) => {
  return <div className="base-component">{title}</div>;
};

BaseComponent.propTypes = {
  title: PropTypes.string,
};

BaseComponent.defaultProps = {
  title: "",
};

export default BaseComponent;
