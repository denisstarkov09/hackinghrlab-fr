import React from "react";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";

import { Avatar, Badge } from "antd";

import "./style.scss";

const Conversation = ({
  user,
  conversation,
  handleConversation,
  userProfile,
}) => {
  const messagesNotViewed = conversation.messages.filter(
    (message) => !message.viewedUser.includes(userProfile.id)
  ).length;

  return (
    <div className="conversations-mobile-container">
      <Badge count={messagesNotViewed}>
        <div
          onClick={() => handleConversation(conversation)}
          className="conversation-mobile"
        >
          {user.img ? (
            <div
              className={`${user.isOnline === true ? "avatar-container" : ""}`}
            >
              <Avatar size={50} src={user.img} />
            </div>
          ) : (
            <div
              className={`${user.isOnline === true ? "avatar-container" : ""}`}
            >
              <Avatar size={40} style={{ fontSize: "1.5rem" }}>
                {user.abbrName}
              </Avatar>
            </div>
          )}

          <p style={{ marginTop: "15px", marginLeft: "5px" }}>
            {user.firstName} {user.lastName}
          </p>
        </div>
      </Badge>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

export default connect(mapStateToProps)(Conversation);
