import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Checkbox } from "antd";

import {
  CustomDrawer,
  CustomButton,
  CustomCheckbox,
  SearchInput,
} from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const FilterDrawer = ({ userProfile, allCategories, onChange, onSearch }) => {
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
    Emitter.on(EVENT_TYPES.OPEN_FILTER_PANEL, () => {
      setVisible(true);
    });

    return () => {
      Emitter.off(EVENT_TYPES.OPEN_FILTER_PANEL);
    };
  }, []);

  const onOpenPostFormModal = () => {
    if (userProfile.completed === true) {
      Emitter.emit(EVENT_TYPES.OPEN_POST_MODAL);
    } else {
      Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "story");
    }
  };

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
            <Button
              type="primary"
              className="create-post"
              onClick={onOpenPostFormModal}
            >
              Add Story
            </Button>
            <h5 className="search-filter-title font-bold">Search</h5>
            <SearchInput onChange={onSearch} />
            <h5 className="search-filter-title font-bold">Topics</h5>
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
                  disabled={userProfile.memberShip === "free"}
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
};

FilterDrawer.defaultProps = {
  title: "",
  onChange: () => {},
  onSearch: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(FilterDrawer);
