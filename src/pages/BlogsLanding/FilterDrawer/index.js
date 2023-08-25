import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import { CustomDrawer, CustomButton, CustomCheckbox } from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";

import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const FilterDrawer = ({ allCategories, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const onClickDone = () => {
    onChange(filterValues);
    onDrawerClose();
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  const clearAllFilters = () => {
    setFilterValues({});
    onChange({});
    onDrawerClose();
  };

  const onFilterChange = (field, values) => {
    const newFilter = {
      ...filterValues,
      [field.toLowerCase()]: JSON.stringify(values),
    };
    setFilterValues(newFilter);
  };

  useEffect(() => {
    Emitter.on(EVENT_TYPES.OPEN_BLOGS_POST_FILTER_PANEL, () => {
      setVisible(true);
    });

    return () => {
      Emitter.off(EVENT_TYPES.OPEN_BLOGS_POST_FILTER_PANEL);
    };
  }, []);

  return (
    <CustomDrawer
      className="blog-filter-drawer"
      title=""
      width={450}
      visible={visible}
      placement="left"
      onClose={onDrawerClose}
      destroyOnClose={true}
    >
      <div className="blog-filter-drawer-container">
        <div className="blog-filter-drawer-header">
          <h2>Filters</h2>
          <h2 className="done" onClick={onClickDone}>
            Done
          </h2>
        </div>
        <div className="blog-filter-drawer-content">
          <div className="search-filter">
            <h4 className="search-filter-title font-bold">Topics</h4>
            <Checkbox.Group
              value={
                filterValues["category"]
                  ? JSON.parse(filterValues["category"])
                  : []
              }
              onChange={(values) => onFilterChange("category", values)}
            >
              {allCategories.map((item) => (
                <CustomCheckbox key={item.value} value={item.value} size="md">
                  {item.title}
                </CustomCheckbox>
              ))}
            </Checkbox.Group>
          </div>
        </div>
        <div className="filter-drawer-footer">
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

FilterDrawer.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
};

FilterDrawer.defaultProps = {
  title: "",
  onChange: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(FilterDrawer);
