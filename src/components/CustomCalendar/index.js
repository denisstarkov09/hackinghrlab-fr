import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar } from "antd";
import moment from "moment";
import clsx from "clsx";

import { SVG_ICONS } from "enum";
import { CustomButton } from "components";

import IconLeft from "images/icon-arrow-left.svg";
import IconRight from "images/icon-arrow-right.svg";

import "./style.scss";

const CustomCalendar = ({ events, value, disabled, onChange }) => {
  const [current, setCurrent] = useState(moment());
  const onDateChange = (date) => {
    if (!disabled) {
      setCurrent(date);
    }
  };

  const getEventData = (value) => {
    let listData = events.map((event) => {
      return event.startAndEndTimes?.filter((time) => {
        const eventDate = moment(time?.startTime, "YYYY.MM.DD. h:mm:a");
        if (
          eventDate.date() === value.date() &&
          eventDate.year() === value.year() &&
          eventDate.month() === value.month()
        ) {
          return true;
        }
        return false;
      });
    });
    return listData.flat();
  };

  const headerRender = ({ value, type, onChange, onTypeChange }) => {
    const current = value.clone();
    const localeData = value.localeData();
    const currentMonth = `${localeData.months(current)} ${current.year()}`;

    const onPrevMonth = () => {
      if (!disabled) {
        const newDate = current.subtract(1, "month");
        onChange(newDate);
      }
    };

    const onNextMonth = () => {
      if (!disabled) {
        const newDate = current.add(1, "month");
        onChange(newDate);
      }
    };

    return (
      <div className="custom-calendar-header">
        <span className="custom-calendar-header-date">{currentMonth}</span>
        <div
          className={clsx("custom-calendar-header-buttons", {
            disabled: disabled,
          })}
        >
          <img src={IconLeft} alt="arrow-left" onClick={onPrevMonth} />
          <img src={IconRight} alt="arrow-left" onClick={onNextMonth} />
        </div>
      </div>
    );
  };

  const dateCellRender = (date) => {
    const listData = getEventData(date);

    return listData && listData.length > 0 ? SVG_ICONS.ICON_CIRCLE : null;
  };

  const onSelectToday = () => {
    setCurrent(moment());
  };

  useEffect(() => {
    onChange(current);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    if (value && value.isValid && value.isValid()) {
      setCurrent(value);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="custom-calendar">
      <Calendar
        className={clsx("custom-calendar-control", { disabled: disabled })}
        value={current}
        fullscreen={false}
        headerRender={headerRender}
        dateCellRender={dateCellRender}
        onChange={onDateChange}
      />
      <CustomButton
        className="custom-calendar-today"
        text="Today"
        type="primary"
        size="xs"
        disabled={disabled}
        onClick={onSelectToday}
      />
    </div>
  );
};

CustomCalendar.propTypes = {
  disabled: PropTypes.bool,
  events: PropTypes.array,
  onChange: PropTypes.func,
};

CustomCalendar.defaultProps = {
  disabled: false,
  events: [],
  onChange: () => {},
};

export default CustomCalendar;
