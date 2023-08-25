import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import {
  CustomDrawer,
  CustomButton,
  CustomCheckbox,
  SearchInput,
} from "components";
import { categorySelector } from "redux/selectors/categorySelector";

import { SEARCH_FILTERS } from "enum";

import "./style.scss";

const YearOptions = SEARCH_FILTERS.ConferenceLibrary.year;

const ConferenceLibraryFilterDrawer = ({
  visible,
  allCategories,
  onChange,
  onClose,
  onSearch,
}) => {
  const [filterValues, setFilterValues] = useState({});

  const onClickDone = () => {
    onChange(filterValues);
    onClose();
  };

  const clearAllFilters = () => {
    setFilterValues({});
    onChange({});
    onClose();
  };

  const onFilterChange = (field, values) => {
    const newFilter = {
      ...filterValues,
      [field.toLowerCase()]: JSON.stringify(values),
    };
    setFilterValues(newFilter);
  };

  return (
    <CustomDrawer
      className="conference-filter-drawer"
      title=""
      width={450}
      visible={visible}
      placement="left"
      onClose={onClose}
      destroyOnClose={true}
    >
      <div className="conference-filter-drawer-container">
        <div className="conference-filter-drawer-header">
          <h2>Filters</h2>
          <h2 className="done" onClick={onClickDone}>
            Done
          </h2>
        </div>
        <div className="conference-filter-drawer-content">
          <div className="search-filter">
            <h5 className="search-filter-title font-bold">Search</h5>
            <SearchInput onChange={onSearch} />
            <h4 className="search-filter-title font-bold">Year</h4>
            <Checkbox.Group
              value={
                filterValues["year"] ? JSON.parse(filterValues["year"]) : []
              }
              onChange={(values) => onFilterChange("year", values)}
            >
              {YearOptions.map((item) => (
                <CustomCheckbox key={item} value={item} size="sm">
                  {item}
                </CustomCheckbox>
              ))}
            </Checkbox.Group>
          </div>
          <div className="search-filter">
            <h4 className="search-filter-title font-bold">Topics</h4>
            <Checkbox.Group
              value={
                filterValues["topics"] ? JSON.parse(filterValues["topics"]) : []
              }
              onChange={(values) => onFilterChange("Topics", values)}
            >
              {allCategories.map((item) => (
                <CustomCheckbox key={item.value} value={item.value} size="md">
                  {item.title}
                </CustomCheckbox>
              ))}
            </Checkbox.Group>
          </div>
        </div>
        <div className="conference-filter-drawer-footer">
          <CustomButton
            className="w-full"
            text="Clear all"
            type="primary outlined"
            size="lg"
            onClick={clearAllFilters}
          />
        </div>
      </div>
    </CustomDrawer>
  );
};

ConferenceLibraryFilterDrawer.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
};

ConferenceLibraryFilterDrawer.defaultProps = {
  visible: false,
  title: "",
  onChange: () => {},
  onClose: () => {},
  onSearch: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(ConferenceLibraryFilterDrawer);
