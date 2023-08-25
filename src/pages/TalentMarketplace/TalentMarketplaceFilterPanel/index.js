import { Space, Checkbox } from "antd";
import React, { useState } from "react";
import { CustomCheckbox, SearchInput } from "components";
import { JOB_BOARD } from "enum";

import "./styles.scss";

const levels = [
  "C-Suite",
  "VP or SVP",
  "Director",
  "Manager",
  "Professional",
  "Junior",
];

const JobBoardFilterPanel = ({
  title = "Filters",
  onChange,
  isRecruiter = false,
}) => {
  const [filters, setFilters] = useState({});

  const onLevelChange = (field, values) => {
    let newFilter = {
      ...filters,
      [field]: JSON.stringify(values),
    };
    setFilters(newFilter);
    onChange(newFilter);
  };

  const onLocationChange = (field, values) => {
    let newFilter = {
      ...filters,
      [field]: JSON.stringify(values),
    };
    setFilters(newFilter);
    onChange(newFilter);
  };

  const handleOnChange = (field, values) => {
    if (isRecruiter) {
      const newFilter = {
        ...filters,
        [field]: values,
      };
      setFilters(newFilter);
      onChange(newFilter);
    }
  };

  const displayLevelCheckbox = levels.map((level, index) => {
    return (
      <CustomCheckbox key={index} value={level} disabled={!isRecruiter}>
        {level}
      </CustomCheckbox>
    );
  });

  const displayLocationCheckbox = JOB_BOARD.LOCATIONS.map((location, index) => {
    return (
      <CustomCheckbox key={index} value={location.value} disabled={!isRecruiter}>
        {location.text}
      </CustomCheckbox>
    );
  });

  return (
    <div className="job-board-filter-panel">
      <h2 className="font-regular">{title}</h2>
      <div className="job-board-filter-panel-content">
        <div className="search-filter">
          <Space direction="vertical">
            <SearchInput
              onChange={(values) => handleOnChange("keyword", values)}
            />
            <h5 className="search-filter-title font-bold">Level</h5>
            <Checkbox.Group
              onChange={(values) => onLevelChange("level", values)}
            >
              <Space direction="vertical">{displayLevelCheckbox}</Space>
            </Checkbox.Group>
            <h5 className="search-filter-title font-bold">Location</h5>
            <Checkbox.Group
              onChange={(values) => onLocationChange("location", values)}
            >
              <Space direction="vertical">{displayLocationCheckbox}</Space>
            </Checkbox.Group>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default JobBoardFilterPanel;
