import React, { useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import SprintCard from "../SprintCard";

import { getAllSimulationSprints } from "redux/actions/simulationSprint-actions";
import { simulationSprintSelector } from "redux/selectors/simulationSprintSelector";
import { homeSelector } from "redux/selectors/homeSelector";

const UpcomingSprints = ({
  getAllSimulationSprints,
  allSimulationSprints,
  userProfile,
}) => {
  useEffect(() => {
    getAllSimulationSprints({
      date: moment().format(),
    });
  }, [getAllSimulationSprints]);

  return (
    <div className="upcoming-sprints">
      {allSimulationSprints.map((sprint, i) => (
        <SprintCard
          key={i}
          sprint={{
            ...sprint,
            userParticipated: sprint.SimulationSprintParticipants.some(
              (participant) => participant.UserId === userProfile.id
            ),
          }}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  allSimulationSprints: simulationSprintSelector(state).allSimulationSprints,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getAllSimulationSprints,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingSprints);
