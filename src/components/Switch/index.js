import React from "react";
import { Switch } from "antd";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./style.scss";

const CustomSwitch = ({ className, ...params }) => (
  <Switch className={clsx("custom-switch", className)} {...params} />
);

CustomSwitch.propTypes = {
  className: PropTypes.string,
};

CustomSwitch.defaultProps = {
  className: "",
};

export default CustomSwitch;
