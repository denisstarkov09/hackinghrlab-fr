import React from "react";
import { Avatar, Badge } from "antd";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";
import { hideConversation } from "redux/actions/conversation-actions";

import "./style.scss";
import { transformNames } from "utils/format";
import { CloseOutlined } from "@ant-design/icons";

const Conversation = ({
  user,
  conversation,
  handleConversation,
  userProfile,
  hideConversation,
}) => {
  const messagesNotViewed = conversation.messages.filter(
    (message) => !message?.viewedUser?.includes(userProfile.id)
  ).length;

  return (
    <div className="conversation-container">
      <Badge count={messagesNotViewed} offset={[0, 10]}>
        <div
          onClick={() => handleConversation(conversation)}
          className="conversation"
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

          <p className="user-name">
            {transformNames(user.firstName)} {transformNames(user.lastName)}
          </p>
        </div>
      </Badge>

      <CloseOutlined
        style={{
          position: "absolute",
          right: "20px",
          top: "5px",
        }}
        onClick={() => hideConversation(conversation.id)}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});
const mapDispatchToProps = {
  hideConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
