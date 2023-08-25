import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { connect } from "react-redux";

import { CustomCheckbox, SearchInput } from "components";

import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";

// import Emitter from "services/emitter";
// import { EVENT_TYPES } from "enum";

import "./style.scss";

const FilterPanel = ({
  title,
  userProfile,
  allCategories,
  onChange,
  onSearch,
}) => {
  const [filters, setFilters] = useState({});

  const onFilterChange = (field, values) => {
    const newFilter = {
      ...filters,
      [field.toLowerCase()]: JSON.stringify(values),
    };
    setFilters(newFilter);
    onChange(newFilter);
  };

  // const onOpenPostFormModal = () => {
  //   if (userProfile.completed === true) {
  //     Emitter.emit(EVENT_TYPES.OPEN_POST_MODAL);
  //   } else {
  //     Emitter.emit(EVENT_TYPES.SHOW_FIREWALL);
  //   }
  // };

  return (
    <div className="speakers-filter-panel">
      <h2 className="font-regular">{title}</h2>
      <div className="podcast-filter-panel-content">
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
  hidePodcastSeries: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClickPodcastSeries: PropTypes.func,
};

FilterPanel.defaultProps = {
  title: "Filters",
  hidePodcastSeries: false,
  onChange: () => {},
  onSearch: () => {},
  onClickPodcastSeries: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(FilterPanel);
