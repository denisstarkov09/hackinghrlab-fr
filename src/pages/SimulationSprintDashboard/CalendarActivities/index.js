import React from "react";
import CalendarCard from "./CalendarCard";

const CalendarActivities = ({ activitites }) => {
  return (
    <>
      {activitites?.map((activity) => (
        <CalendarCard key={activity.id} activity={activity} />
      ))}
    </>
  );
};

export default CalendarActivities;
