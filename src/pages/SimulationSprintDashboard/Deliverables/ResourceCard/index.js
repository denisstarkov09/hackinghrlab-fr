import React from "react";
import {
  FileTextFilled,
  SoundOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import "./style.scss";
import { CustomButton } from "components";
import moment from "moment";

const ResourceCard = ({ resource }) => {
  const convertedReleaseDate = moment(resource.releaseD).format("YYYY-MM-DD");
  return (
    <div className="simulation-sprint-resource-card">
      <div className="simulation-sprint-resource-card-icon">
        {resource.type === "article" ? (
          <FileTextFilled />
        ) : resource.type === "video" ? (
          <VideoCameraFilled />
        ) : (
          <SoundOutlined />
        )}
      </div>

      <div className="simulation-sprint-resource-card-container">
        <div className="simulation-sprint-resource-card-title">
          <h1>{resource.title}</h1>
        </div>

        <div className="simulation-sprint-resource-card-type">
          <h5>
            Type: <span>{resource.type}</span>
          </h5>
        </div>

        <div className="simulation-sprint-resource-card-description">
          <p>{resource.descript}</p>
        </div>
      </div>

      <div className="simulation-sprint-resource-card-button">
        <CustomButton
          type="primary"
          size="md"
          text={
            moment().isBefore(moment(convertedReleaseDate))
              ? `Available on ${moment(convertedReleaseDate).format("LL")}`
              : `Go To Resource`
          }
          onClick={() => window.open(resource.resource, "_blank")}
          disabled={moment().isBefore(moment(convertedReleaseDate))}
        />
      </div>
    </div>
  );
};

export default ResourceCard;
