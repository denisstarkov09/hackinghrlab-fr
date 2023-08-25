import { Avatar } from "antd";
import React from "react";

import "./style.scss";

const MemberCard = ({ participant }) => {
  const { User } = participant;
  return (
    <div className="simulation-sprint-member-card">
      <div className="simulation-sprint-member-card-container-avatar">
        <div className="simulation-sprint-member-card-container-avatar-content">
          {User.img ? (
            <Avatar
              src={User.img}
              className="simulation-sprint-member-card-avatar"
            />
          ) : (
            <Avatar
              src={User.img}
              className="simulation-sprint-member-card-avatar"
            >
              {User.abbrName}
            </Avatar>
          )}
        </div>
      </div>

      <div className="simulation-sprint-member-card-container">
        <div className="simulation-sprint-member-card-user-information">
          <p>
            {" "}
            {User?.firstName} {User?.lastName}
          </p>
          <span>
            {User?.titleProfessions} / {User?.company}
          </span>
        </div>

        <div className="simulation-sprint-member-card-button-container">
          <a
            className="button-linkedin"
            href={
              User?.personalLinks?.linkedin?.substring(0, 7) !== "http://" &&
              User?.personalLinks?.linkedin?.substring(0, 8) !== "https://"
                ? `https://${User?.personalLinks?.linkedin}`
                : User?.personalLinks?.linkedin
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <></>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
