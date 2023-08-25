import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import Emitter from "services/emitter";

import { CustomDrawer, CustomButton, CustomCheckbox } from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import { MARKETPLACE_TYPES } from "enum";

import "./style.scss";

const FilterDrawer = ({ onChange, searchFilters }) => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState([]);

  const onClickDone = () => {
    onDrawerClose();
  };

  const onDrawerClose = () => {
    onChange(filters);
    setVisible(false);
  };

  const clearAllFilters = () => {
    setFilters([]);
    onChange([]);
    onDrawerClose();
  };

  const onFilterChange = (values) => {
    let newFilter = values;
    setFilters(newFilter);
  };

  useEffect(() => {
    Emitter.on(MARKETPLACE_TYPES.OPEN_FILTER_PANEL, () => {
      setVisible(true);
    });

    return () => {
      Emitter.off(MARKETPLACE_TYPES.OPEN_FILTER_PANEL)
    }
  }, []);

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
            <h4 className="search-filter-title font-bold">Company type</h4>
            <Checkbox.Group
              value={
                filters.length > 0 && filters
              }
              onChange={(values) => onFilterChange(values)}
            >
              {searchFilters.map((item) => (
                <CustomCheckbox
                  key={item.value}
                  value={item.value}
                  size="sm"
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
};

FilterDrawer.defaultProps = {
  title: "",
  onChange: () => { },
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

export default connect(mapStateToProps)(FilterDrawer);
