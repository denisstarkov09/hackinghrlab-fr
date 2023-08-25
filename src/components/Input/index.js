import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Input, DatePicker } from "antd";

import "./style.scss";

class CustomInput extends React.Component {
  render() {
    const { className, multiple, type, onChange, size, ...rest } = this.props;

    return multiple ? (
      <Input.TextArea
        {...rest}
        rows={4}
        className={clsx("custom-input", className, "mutiple", size)}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : type === "password" ? (
      <Input.Password
        {...rest}
        className={clsx("custom-input", className, size)}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : type === "time" ? (
      <DatePicker
        showTime
        className={clsx("custom-input", className, size)}
        style={{ width: "100%" }}
        onChange={(e) => onChange(e)}
        format="YYYY/MM/DD HH:mm"
        {...rest}
      />
    ) : (
      <Input
        {...rest}
        className={clsx("custom-input", className, size)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
}

CustomInput.propTypes = {
  className: PropTypes.string,
  multiple: PropTypes.bool,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

CustomInput.defaultProps = {
  className: "",
  multiple: false,
  type: "input",
  onChange: () => {},
};

export default CustomInput;
