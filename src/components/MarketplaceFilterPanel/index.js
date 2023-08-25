import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Checkbox } from "antd";

import { CustomCheckbox } from "components";

import "./style.scss";

const MarketplaceFilterPanel = ({
  title = 'Filters',
  searchFilters = [],
  onChange
}) => {
  const [filters, setFilters] = useState([]);
  const onFilterChange = (values) => {
    let newFilter = values;
    setFilters(newFilter);
    onChange(newFilter);
  };

  return (<div className="marketplace-filter-panel">
    <h2 className="font-regular">{title}</h2>
    <div className="marketplace-filter-panel-content">
      <div className="search-filter">
        <h5 className="search-filter-title font-bold">Company type</h5>
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
  </div>);
};

MarketplaceFilterPanel.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
};

MarketplaceFilterPanel.defaultProps = {
  title: "Filters",
  onChange: () => { },
};

export default MarketplaceFilterPanel;