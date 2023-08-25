import React from "react";
import { Card, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./style.scss";

const SpeakerCard = ({ speaker }) => {
  return (
    <Col className="speaker-col">
      <a href={speaker.linkSpeaker} target="_blank" rel="noopener noreferrer">
        <Card
          hoverable
          bordered
          type="inner"
          extra={<UserOutlined />}
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {speaker.img ? (
            <Avatar size={180} src={speaker.img} alt={speaker.name} />
          ) : (
            <Avatar size={180} icon={<UserOutlined />} />
          )}

          <div style={{ textAlign: "center" }}>
            <p className="speaker-name">{speaker.name}</p>
            <p>{speaker.description}</p>
          </div>
        </Card>
      </a>
    </Col>
  );
};

export default SpeakerCard;
