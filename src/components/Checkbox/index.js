import React from "react";
import { Checkbox } from "antd";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./style.scss";

const CustomCheckbox = ({ type, className, children, size, ...params }) => (
  <Checkbox
    className={clsx("custom-checkbox", type, className, size)}
    {...params}
  >
    {children}
  </Checkbox>
);

CustomCheckbox.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  type: "primary",
  size: "md",
  className: "",
};

export default CustomCheckbox;
