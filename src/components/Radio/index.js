import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Radio } from "antd";

import "./style.scss";

const CustomRadio = ({ type, className, size, children, ...params }) => (
  <Radio className={clsx("custom-radio", type, className, size)} {...params}>
    {children}
  </Radio>
);

CustomRadio.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

CustomRadio.defaultProps = {
  type: "primary",
  size: "md",
  className: "",
};

export default CustomRadio;
