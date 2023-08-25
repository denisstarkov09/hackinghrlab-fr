import React, { useEffect } from "react";
import { connect } from "react-redux";
import SprintCard from "../SprintCard";
import { getAllMySimulationSprints } from "redux/actions/simulationSprint-actions";
import { simulationSprintSelector } from "redux/selectors/simulationSprintSelector";

const MySprints = ({ getAllMySimulationSprints, mySimulationsSprints }) => {
  useEffect(() => {
    getAllMySimulationSprints();
  }, [getAllMySimulationSprints]);

  return (
    <div className="upcoming-sprints">
      {mySimulationsSprints.map((sprint, i) => {
        const data = {
          id: sprint["SimulationSprint.id"],
          startDate: sprint["SimulationSprint.startDate"],
          endDate: sprint["SimulationSprint.endDate"],
          image: sprint["SimulationSprint.image"],
          title: sprint["SimulationSprint.title"],
          description: sprint["SimulationSprint.description"],
          open: sprint["SimulationSprint.open"],
          userParticipated: sprint.UserId ? true : false,
        };

        return <SprintCard key={i} sprint={data} />;
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  mySimulationsSprints: simulationSprintSelector(state).mySimulationsSprints,
});

const mapDispatchToProps = {
  getAllMySimulationSprints,
};

export default connect(mapStateToProps, mapDispatchToProps)(MySprints);
