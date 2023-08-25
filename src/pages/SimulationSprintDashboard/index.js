import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import qs from "query-string";
import { INTERNAL_LINKS } from "enum";
import IconBack from "images/icon-back.svg";
import { Menu } from "antd";

import { getSimulationSprint } from "redux/actions/simulationSprint-actions";
import { simulationSprintSelector } from "redux/selectors/simulationSprintSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import CalendarActivities from "./CalendarActivities";

import "./style.scss";
import Deliverables from "./Deliverables";
import MyTeam from "./MyTeam";
import FullCohort from "./FullCohort";

const SimulationSprintDashboardPage = ({
  simulationSprint,
  userProfile,
  getSimulationSprint,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const [selectedKeys, setSelectedKeys] = useState("the-basics");

  const parsed = qs.parse(location.search);

  const myTeam = simulationSprint?.SimulationSprintGroups?.find((group) =>
    group?.SimulationSprintParticipants?.some(
      (participant) => participant.UserId === userProfile.id
    )
  );

  useEffect(() => {
    setSelectedKeys(parsed.key || "the-basics");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (simulationSprint.id) {
      if (
        !simulationSprint?.SimulationSprintParticipants?.some(
          (participant) => participant?.UserId === userProfile.id
        )
      ) {
        history.push(
          `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
        );
      }
    }
  }, [history, simulationSprint, userProfile]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Page",
      `${INTERNAL_LINKS.SIMULATION_SPRINTS}/${id}/dashboard?key=${selectedKeys}`
    );
  }, [selectedKeys, id]);

  useEffect(() => {
    getSimulationSprint(id, (error) => {
      if (error) {
        history.push(
          `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
        );
      }
    });
  }, [getSimulationSprint, id, history]);

  (myTeam || {}).SimulationSprintParticipants =
    simulationSprint?.SimulationSprintParticipants?.filter(
      (participant) => participant?.SimulationSprintGroupId === myTeam?.id
    );

  return (
    <div className="simulation-sprint-dashboard-page">
      <div className="simulation-sprint-dashboard-page-header">
        <div className="simulation-sprint-dashboard-page-header-content">
          <div>
            <div
              className="sprints-detail-page-header-content-back-btn"
              onClick={() =>
                history.push(
                  `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=upcoming-sprints`
                )
              }
            >
              <div className="sprints-detail-page-header-content-back">
                <div className="sprints-detail-page-header-content-back-img">
                  <img src={IconBack} alt="icon-back" />
                </div>
                <h4>Back to simulations sprints</h4>
              </div>
            </div>
            <div className="title">
              <h2>{simulationSprint?.title}</h2>
            </div>
          </div>

          <Menu
            mode="horizontal"
            className="menu-simulation"
            selectedKeys={selectedKeys}
          >
            <Menu.Item
              key="the-basics"
              className="menu-simulation-item"
              onClick={() => setSelectedKeys("the-basics")}
            >
              The Basics
            </Menu.Item>

            <Menu.Item
              key="calendar"
              className="menu-simulation-item"
              onClick={() => setSelectedKeys("calendar")}
            >
              Calendar
            </Menu.Item>
            <Menu.Item
              key="deliverables"
              className="menu-simulation-item"
              onClick={() => setSelectedKeys("deliverables")}
            >
              Deliverables and Resources
            </Menu.Item>

            <Menu.Item
              key="team"
              className="menu-simulation-item"
              onClick={() => setSelectedKeys("team")}
            >
              Team Members
            </Menu.Item>

            <Menu.Item
              key="full-cohort"
              className="menu-simulation-item"
              onClick={() => setSelectedKeys("full-cohort")}
            >
              Full Cohort
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <div className="simulation-sprint-dashboard-page-body">
        {selectedKeys === "the-basics" && (
          <div
            className="the-basics"
            dangerouslySetInnerHTML={{
              __html: (simulationSprint.description || {}).html || "",
            }}
          />
        )}

        {selectedKeys === "calendar" && (
          <CalendarActivities
            activitites={simulationSprint.SimulationSprintActivities}
          />
        )}

        {selectedKeys === "deliverables" && (
          <Deliverables
            deliverables={simulationSprint.SimulationSprintDeliverables}
          />
        )}

        {selectedKeys === "team" && <MyTeam myTeam={myTeam} />}

        {selectedKeys === "full-cohort" && (
          <FullCohort
            participants={simulationSprint.SimulationSprintParticipants}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  simulationSprint: simulationSprintSelector(state).simulationSprint,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getSimulationSprint,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationSprintDashboardPage);
