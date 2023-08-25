import React from "react";
import MemberCard from "../MemberCard";

const MyTeam = ({ myTeam }) => {
  return (
    <div className="simulation-sprint-members-container">
      {myTeam?.SimulationSprintParticipants.map((participant) => (
        <MemberCard key={participant.id} participant={participant} />
      ))}
    </div>
  );
};

export default MyTeam;
