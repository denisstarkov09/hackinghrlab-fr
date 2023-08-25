import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { bonfireSelector } from "redux/selectors/bonfireSelector";
import { getBonfires, inviteUser } from "redux/actions/bonfire-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { getParticipants } from "redux/actions/session-actions";
import { CustomButton, ParticipantCard } from "components";
import { Modal, List, Skeleton, notification, Pagination } from "antd";

const Participants = ({
  participants,
  bonfires,
  userProfile,
  getParticipants,
  getBonfires,
  inviteUser,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [participantToInvite, setParticipantToInvite] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userProfile.topicsOfInterest.length > 0) {
      getParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
      });

      getBonfires();
    }
  }, [getParticipants, getBonfires, userProfile]);

  const onOpenModalBonfires = (participantId) => {
    setOpenModal(true);
    setParticipantToInvite(participantId);
  };

  const onInviteUser = (bonfireId, participantId) => {
    inviteUser(bonfireId, participantId, (error) => {
      if (error) {
        notification.error({
          message: error || "Something went wrong. Please try again.",
        });
      } else {
        getBonfires();
        notification.success({
          message: "Participant has been invited",
        });
      }
    });
  };

  const handlePaginated = (value) => {
    setPage(value);
  };

  return (
    <>
      <div className="speakers-list">
        <h2 style={{ textAlign: "center" }}>
          {participants.length} Recommended Participants To Connect With
        </h2>
        <div className="speakers-list-container">
          {participants.length > 0 &&
            participants
              .slice((page - 1) * 20, page * 20)
              .map((participant, i) => (
                <ParticipantCard
                  key={i}
                  participant={participant}
                  onOpenModalBonfires={onOpenModalBonfires}
                  invitedAllBonfires={bonfires
                    .filter(
                      (bonfire) => bonfire.bonfireCreator === userProfile.id
                    )
                    .every(
                      (bonfire) =>
                        bonfire.invitedUsers.includes(participant.id) ||
                        bonfire.uninvitedJoinedUsers.includes(participant.id) ||
                        bonfire?.usersInvitedByOrganizer?.includes(
                          participant.id
                        )
                    )}
                />
              ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "1rem 0rem",
          }}
        >
          <Pagination
            defaultCurrent={page}
            defaultPageSize={20}
            total={participants.length}
            showSizeChanger={false}
            onChange={handlePaginated}
            style={{ marginTop: "1.5rem" }}
          />
        </div>
      </div>

      <Modal
        title="Bonfires creators for you"
        centered
        visible={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        width={800}
      >
        <List
          itemLayout="horizontal"
          dataSource={bonfires.filter(
            (bonfire) => bonfire.bonfireCreator === userProfile.id
          )}
          renderItem={(bonfire) => {
            if (
              bonfire.invitedUsers.includes(participantToInvite) ||
              bonfire.uninvitedJoinedUsers.includes(participantToInvite) ||
              bonfire?.usersInvitedByOrganizer?.includes(participantToInvite)
            ) {
              return (
                <List.Item
                  actions={[
                    <CustomButton
                      size="sm"
                      text="User Already Invited or Joined"
                      disabled={true}
                    />,
                  ]}
                >
                  <Skeleton title={false} loading={false}>
                    <List.Item.Meta
                      title={bonfire.title}
                      description={bonfire.description}
                    />
                  </Skeleton>
                </List.Item>
              );
            }

            return (
              <List.Item
                extra={
                  <CustomButton
                    size="sm"
                    text="Invite User"
                    onClick={() =>
                      onInviteUser(bonfire.id, participantToInvite)
                    }
                  />
                }
              >
                <Skeleton title={false} loading={false}>
                  <List.Item.Meta
                    title={bonfire.title}
                    description={bonfire.description}
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...sessionSelector(state),
  userProfile: homeSelector(state).userProfile,
  bonfires: bonfireSelector(state).bonfires,
});

const mapDispatchToProps = {
  getParticipants,
  getBonfires,
  inviteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Participants);
