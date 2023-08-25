import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Select } from "antd";

import "./style.scss";

class CustomSelect extends React.Component {
  render() {
    const { options, className, bordered, change , dropdownStyle, mode, ...rest } = this.props;

    return (
      <Select
        {...rest}
        mode={mode ? mode : ""}
        className={change ? clsx("custom-select2", className, { border: bordered }) : clsx("custom-select", className, { border: bordered })}
        suffixIcon={<i className="fal fa-angle-down" />}
        dropdownClassName={"custom-select-dropdown"}
        dropdownMenuStyle={dropdownStyle}
        dropdownStyle={dropdownStyle}
      >
        {options.map((opt) => {
          if (opt.name) {
            return (
              <Select.Option
                key={opt.name}
                value={`${opt.name}/${opt.timezoneId}`}
              >
                {opt.name}, {opt.country}
              </Select.Option>
            );
          } else if (opt.label) {
            return (
              <Select.Option
                key={opt.label}
                value={`${opt.label}`}
              >
                {opt.value}
              </Select.Option>
            );
          } else if (opt.title) {
            return (
              <Select.Option
                key={opt.value}
                value={`${opt.value}`}
              >
                {opt.title}
              </Select.Option>
            );
          } else {
            return (
              <Select.Option key={opt.key || opt.value} value={opt.value}>
                {opt.text}
              </Select.Option>
            );
          }
        })}
      </Select>
    );
  }
}

CustomSelect.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
};

CustomSelect.defaultProps = {
  className: "",
  options: [],
};

export default CustomSelect;
