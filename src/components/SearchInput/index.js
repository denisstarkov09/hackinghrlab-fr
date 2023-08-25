import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CustomInput from "../Input";

import IconSearch from "images/icon-search.svg";

import "./style.scss";

const SearchInput = ({ onSearch, onChange }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="search-input">
      <CustomInput
        className="search-input-text"
        value={value}
        size="sm"
        onChange={setValue}
        onPressEnter={() => onSearch(value)}
      />
      <div className="search-input-icon" onClick={() => onSearch(value)}>
        <img src={IconSearch} alt="search-icon" />
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};

SearchInput.defaultProps = {
  onChange: () => {},
  onSearch: () => {},
};

export default SearchInput;
