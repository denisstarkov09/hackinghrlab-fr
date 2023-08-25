import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";

import { CustomCalendar, CustomButton } from "components";
import { eventSelector } from "redux/selectors/eventSelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const EventFilterPanel = ({
  title,
  allEvents,
  allCategories,
  onFilterChange,
  onClose,
}) => {
  const [filterValues, setFilterValues] = useState({});

  const onDateChange = (date) => {
    const newFilters = {
      ...filterValues,
      date,
    };

    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const onShowAllEvent = () => {
    setFilterValues({});
    onFilterChange({});
  };

  return (
    <div className="event-filter-panel">
      <CloseOutlined className="event-filter-panel-close" onClick={onClose} />
      <CustomCalendar
        value={filterValues.date}
        events={allEvents}
        onChange={onDateChange}
      />
      <CustomButton
        className="event-filter-panel-allevents"
        type="primary"
        size="xs"
        text="All Events"
        onClick={onShowAllEvent}
      />
    </div>
  );
};

EventFilterPanel.propTypes = {
  title: PropTypes.string,
  onFilterChange: PropTypes.func,
  onClose: PropTypes.func,
};

EventFilterPanel.defaultProps = {
  title: "Filters",
  onFilterChange: () => {},
  onClose: () => {},
};

const mapStateToProps = (state) => ({
  allEvents: eventSelector(state).allEvents,
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(EventFilterPanel);
