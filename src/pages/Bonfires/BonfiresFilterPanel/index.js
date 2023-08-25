import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { connect } from "react-redux";

import { CustomCheckbox } from "components";

import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const BonfiresFilterPanel = ({
  title = "Filters",
  allCategories,
  onChange,
}) => {
  const [filters, setFilters] = useState({});
  const onFilterChange = (field, values) => {
    let newFilter = {
      ...filters,
      [field]: JSON.stringify(values),
    };
    setFilters(newFilter);
    onChange(newFilter);
  };

  return (
    <div className="bonfires-filter-panel">
      <h2 className="font-regular">{title}</h2>
      <div className="bonfires-filter-panel-content">
        <div className="search-filter">
          <h5 className="search-filter-title font-bold">Categories</h5>
          <Checkbox.Group
            value={filters.category ? JSON.parse(filters.category) : []}
            onChange={(values) => onFilterChange("category", values)}
          >
            {allCategories.map((item) => (
              <CustomCheckbox key={item.value} value={item.value} size="sm">
                {item.title}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};

BonfiresFilterPanel.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
};

BonfiresFilterPanel.defaultProps = {
  title: "Filters",
  onChange: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BonfiresFilterPanel);
