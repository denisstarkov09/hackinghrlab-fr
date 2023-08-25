import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { Menu } from "antd";
import qs from "query-string";
import { homeSelector } from "redux/selectors/homeSelector";
import { EVENT_TYPES, INTERNAL_LINKS } from "enum";
import GeneralInformation from "./GeneralInformation";
import UpcomingSprints from "./UpcomingSprints";
import MySprints from "./MySprints";
import Emitter from "services/emitter";
import "./style.scss";

const SimulationSprintsPage = ({ userProfile }) => {
  const [showProfileCompletionFirewall, setShowProfileCompletionFirewall] =
    useState(false);
  const [selectedKeys, setSelectedKeys] = useState("general-information");

  const location = useLocation();

  const parsed = qs.parse(location.search);

  useEffect(() => {
    setSelectedKeys(parsed.key || "general-information");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Page",
      `${INTERNAL_LINKS.SIMULATION_SPRINTS}?key=${selectedKeys}`
    );
  }, [selectedKeys]);

  const completeProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
  };

  return (
    <div className="simulation-sprints">
      <div className="simulation-sprints-container">
        <Menu
          mode="horizontal"
          className="sub-menu"
          selectedKeys={selectedKeys}
        >
          <Menu.Item
            key="general-information"
            className="sub-menu-item-global-conference"
            onClick={() => setSelectedKeys("general-information")}
          >
            General Information
          </Menu.Item>

          <Menu.Item
            key="upcoming-sprints"
            className="sub-menu-item-global-conference"
            onClick={() => setSelectedKeys("upcoming-sprints")}
          >
            Upcoming Sprints
          </Menu.Item>
          <Menu.Item
            key="my-sprints"
            className="sub-menu-item-global-conference"
            onClick={() => setSelectedKeys("my-sprints")}
          >
            My Sprints
          </Menu.Item>
        </Menu>

        <div className="simulation-sprints-content">
          {selectedKeys === "general-information" ? (
            <GeneralInformation />
          ) : selectedKeys === "upcoming-sprints" ? (
            <UpcomingSprints />
          ) : (
            <MySprints />
          )}
        </div>
      </div>
      {showProfileCompletionFirewall && (
        <div
          className="simulation-sprint-firewall"
          onClick={() => setShowProfileCompletionFirewall(false)}
        >
          <div className="upgrade-notification-panel" onClick={completeProfile}>
            <h3>
              You must fully complete your profile before you can purchase any
              of the simulation sprint packages.
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationSprintsPage);
