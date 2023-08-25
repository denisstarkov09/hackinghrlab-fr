import React from "react";
import { Card, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./style.scss";

const ParticipantCard = ({ participant }) => {
  return (
    <Col className="participant-col">
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
        {participant.img ? (
          <Avatar size={180} src={participant.img} alt={participant.name} />
        ) : (
          <Avatar size={180} icon={<UserOutlined />} />
        )}

        <div style={{ textAlign: "center" }}>
          <p className="participant-name">{participant.name}</p>
          <p>{participant.description}</p>
        </div>
      </Card>
    </Col>
  );
};

export default ParticipantCard;
