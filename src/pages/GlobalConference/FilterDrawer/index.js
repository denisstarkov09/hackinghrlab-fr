import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import {
  CustomDrawer,
  CustomButton,
  CustomCheckbox,
  SearchInput,
} from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";
import { categorySelector } from "redux/selectors/categorySelector";
import { homeSelector } from "redux/selectors/homeSelector";
import "./style.scss";
import { CONFERENCE_SETTING } from "enum";

const SessionType = [...CONFERENCE_SETTING.SESSION_TYPE];

const FilterDrawer = ({
  allCategories,
  userProfile,
  onChange,
  onSearch,
  filters,
  view,
}) => {
  const [visible, setVisible] = useState(false);
  const [filterValues, setFilterValues] = useState(filters);

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
    Emitter.on(EVENT_TYPES.OPEN_FILTER_PANEL, () => {
      setVisible(true);
    });

    return () => {
      Emitter.off(EVENT_TYPES.OPEN_FILTER_PANEL);
    };
  }, []);

  useEffect(() => {
    setFilterValues(filters);
  }, [filters]);

  return (
    <CustomDrawer
      className="filter-drawer"
      title=""
      width={450}
      visible={visible}
      placement="left"
      onClose={onDrawerClose}
      destroyOnClose={true}
    >
      <div className="filter-drawer-container">
        <div className="filter-drawer-header">
          <h2>Filters</h2>
          <h2 className="done" onClick={onClickDone}>
            Done
          </h2>
        </div>
        <div className="filter-drawer-content">
          <div className="search-filter">
            <h5 className="search-filter-title font-bold">Search</h5>
            <SearchInput onChange={onSearch} />
            <h5 className="search-filter-title font-bold">Sessions</h5>

            <Checkbox.Group
              value={
                filterValues["sessions"]
                  ? JSON.parse(filterValues["sessions"])
                  : []
              }
              style={{ marginBottom: "30px" }}
              onChange={(values) => onFilterChange("Sessions", values)}
            >
              {SessionType.map((item) => (
                <CustomCheckbox key={item.value} value={item.value} size="sm">
                  {item.text}
                </CustomCheckbox>
              ))}
            </Checkbox.Group>

            <h5 className="search-filter-title font-bold">Categories</h5>
            <Checkbox.Group
              value={
                filterValues["topics"] ? JSON.parse(filterValues["topics"]) : []
              }
              onChange={(values) => onFilterChange("Topics", values)}
            >
              {allCategories.map((item) => (
                <CustomCheckbox
                  key={item.value}
                  value={item.value}
                  size="sm"
                  disabled={
                    (view === "my-talent-marketplace-profile" ||
                      view === "talent-marketplace") &&
                    userProfile.memberShip !== "premium"
                  }
                >
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
  onSearch: PropTypes.func,
  filters: PropTypes.object,
};

FilterDrawer.defaultProps = {
  title: "",
  onChange: () => {},
  onSearch: () => {},
  filters: {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

export default connect(mapStateToProps)(FilterDrawer);
