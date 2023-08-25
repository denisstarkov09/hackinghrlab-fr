import React, { useState } from "react";
import { FolderOpenFilled } from "@ant-design/icons";
import { ReactComponent as IconChevronDown } from "images/icon-chevron-down.svg";
import moment from "moment";

import "./style.scss";
import clsx from "clsx";
import ResourceCard from "../ResourceCard";

const DeliverableCard = ({ deliverable, index }) => {
  const [showResources, setShowResources] = useState(false);
  const { SimulationSprintResources: resources } = deliverable;

  const handleShowResource = () => {
    setShowResources(!showResources);
  };

  return (
    <div className="simulation-sprint-deliverable-card">
      <div className="simulation-sprint-deliverable-card-icon">
        <FolderOpenFilled />
      </div>
      <div className="simulation-sprint-deliverable-card-container">
        <div className="simulation-sprint-deliverable-card-title">
          <h1>{`Deliverable ${index + 1}:`}</h1>
          <h2>{deliverable.title}</h2>
        </div>

        <div className="simulation-sprint-deliverable-card-description">
          <h1>Description: </h1>
          <p>{deliverable.description}</p>
        </div>

        <div className="simulation-sprint-deliverable-card-date">
          <h1>Due Date: </h1>
          <span>{moment(deliverable.dueDate).format("LL")}</span>
        </div>

        <div
          className="simulation-sprint-deliverable-card-toggle"
          onClick={() => handleShowResource()}
        >
          <span>{!showResources ? "Show Resources" : "Hide Resources"}</span>
          <div
            className={clsx("simulation-sprint-deliverable-card-toggle-icon", {
              show: showResources,
            })}
          >
            <IconChevronDown />
          </div>
        </div>

        <div
          className={clsx("simulation-sprint-deliverable-card-resources", {
            show: showResources,
          })}
        >
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliverableCard;
