import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { connect } from "react-redux";
import Emitter from "services/emitter";

import { CustomCheckbox, CustomButton, SearchInput } from "components";

import { EVENT_TYPES } from "enum";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const FilterPanel = ({
  title,
  userProfile,
  allCategories,
  onChange,
  onSearch,
  currentTab,
  isBusiness = false,
}) => {
  const [filters, setFilters] = useState({});

  const onShareContent = () => {
    Emitter.emit(EVENT_TYPES.OPEN_SHARE_CONTENT);
  };

  const onFilterChange = (field, values) => {
    const newFilter = {
      ...filters,
      [field.toLowerCase()]: JSON.stringify(values),
    };
    setFilters(newFilter);
    onChange(newFilter);
  };

  return (
    <div className="library-filter-panel">
      {((isBusiness && currentTab === "2") ||
        (isBusiness && currentTab === "1")) && (
        <CustomButton
          className="library-filter-panel-share"
          text="Share content"
          size="md"
          type="primary"
          onClick={onShareContent}
        />
      )}
      {isBusiness || (
        <CustomButton
          className="library-filter-panel-share"
          text="Share content"
          size="md"
          type="primary"
          onClick={onShareContent}
        />
      )}
      <h2 className="font-regular">{title}</h2>
      <div className="library-filter-panel-content">
        <div className="search-filter">
          <h5 className="search-filter-title font-bold">Search</h5>
          <SearchInput onSearch={onSearch} />
          <h5 className="search-filter-title font-bold">Topics</h5>
          <Checkbox.Group
            value={filters["topics"] ? JSON.parse(filters["topics"]) : []}
            onChange={(values) => onFilterChange("Topics", values)}
          >
            {allCategories.map((item) => (
              <CustomCheckbox
                key={item.value}
                value={item.value}
                size="sm"
                disabled={userProfile.memberShip === "free"}
              >
                {item.title}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};

FilterPanel.defaultProps = {
  title: "Filters",
  onChange: () => {},
  onSearch: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(FilterPanel);
