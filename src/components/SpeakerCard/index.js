import React from "react";
import { Card, Avatar, Tooltip, Button } from "antd";
import { UserOutlined, LinkedinOutlined } from "@ant-design/icons";
import "./style.scss";

const SpeakerCard = ({ speaker, type }) => {

  const caseLink = (speaker?.User?.personalLinks?.linkedin?.substring(0, 7) !== "http://" && speaker?.User?.personalLinks?.linkedin?.substring(0, 8) !== "https://") ? `https://${speaker?.User?.personalLinks?.linkedin}` : speaker?.User?.personalLinks?.linkedin

  return (
    <Card
      hoverable
      bordered
      type="inner"
      extra={<UserOutlined />}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: "50px"
      }}
      onClick={() => window.open(`${(type === '2023') ? caseLink : speaker?.linkSpeaker}`, "_blank")}
    >
      {(speaker?.img || speaker?.User?.img) ? (
        <Avatar size={150} src={(type === '2023') ? speaker?.User?.img : speaker?.img} alt={(type === '2023') ? speaker?.User?.firstName : speaker?.name} />
      ) : (
        <Avatar size={150} icon={<UserOutlined />} />
      )}

      <div style={{ textAlign: "center" }}>
        <p className="speaker-name">{(type === '2023') ? speaker?.User?.firstName : speaker?.name}</p>
        <p>{(type === '2023') ? speaker?.User?.about : speaker?.description}</p>
      </div>
      {speaker && (
        <div className="participant-card-marketplaceprofile">
          <Tooltip title="Linkedin">
            <Button
              shape="circle"
              type="link"
              icon={<LinkedinOutlined />}
              onClick={() =>
                window.open(speaker?.User?.personalLinks?.linkedin, "_blank")
              }
              className="participant-card-marketplaceprofile-icon"
            />
          </Tooltip>
        </div>
      )}
    </Card>
  );
};

export default SpeakerCard;
