import React from "react";
import MemberCard from "../MemberCard";

const FullCohort = ({ participants }) => {
  return (
    <div className="simulation-sprint-members-container">
      {participants?.map((participant) => (
        <MemberCard key={participant.id} participant={participant} />
      ))}
    </div>
  );
};

export default FullCohort;
