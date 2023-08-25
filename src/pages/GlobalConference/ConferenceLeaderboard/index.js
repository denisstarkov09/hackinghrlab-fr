import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { getParticipants } from "redux/actions/session-actions";
import { CustomButton } from "components";
import { List, Avatar, Modal, Timeline } from "antd";
import "./style.scss";

const ConferenceLeaderboard = ({ getParticipants, participants }) => {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    getParticipants({ order: true });
  }, [getParticipants]);

  return (
    <div className="conference-leaderboard">
      <div className="conference-leaderboard-container">
        <CustomButton
          size="xs"
          text="How To Earn Points"
          className="conference-leaderboard-button"
          onClick={() => setOpenModal(true)}
        />
        <List
          itemLayout="horizontal"
          bordered
          dataSource={participants}
          renderItem={(participant) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  participant.img ? (
                    <Avatar src={participant.img} />
                  ) : (
                    <Avatar>{participant.abbrName}</Avatar>
                  )
                }
                title={`${participant.firstName} ${participant.lastName}`}
                description={`${participant.company} - ${participant.titleProfessions}`}
              />

              <span>{participant.pointsConferenceLeaderboard}</span>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title="How To Earn Points"
        centered
        visible={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        className="modal-earn-points"
      >
        <Timeline>
          <Timeline.Item>
            Organize a Bonfire: <span>500 points</span>
          </Timeline.Item>
          <Timeline.Item>
            Join a Bonfire: <span>200 points</span>
          </Timeline.Item>
          <Timeline.Item>
            Invite a friend: <span>100 points</span>
            (When your colleagues joins, <span>500 more points!</span>)
          </Timeline.Item>
          <Timeline.Item>
            Add your first session to your personalizated agenda:{" "}
            <span>50 points</span>
          </Timeline.Item>
          <Timeline.Item>
            Every session you add to your agenda: <span>20 points</span>
          </Timeline.Item>
        </Timeline>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...sessionSelector(state),
});

const mapDispatchToProps = {
  getParticipants,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceLeaderboard);
