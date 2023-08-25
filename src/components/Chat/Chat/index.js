import { CloseOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Avatar, Button, Tooltip } from "antd";
import { SOCKET_EVENT_TYPE } from "enum";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import { connect } from "react-redux";
import { getMoreMessages } from "redux/actions/conversation-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import SocketIO from "services/socket";
import FormMessage from "../FormMessage";

const Chat = React.memo(
  ({
    userProfile,
    currentConversation,
    closeConversation,
    getMoreMessages,
    ...rest
  }) => {
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const refChatMessages = useRef(null);

    const setRefFirstMessage = useRef(null);

    const setRef = useCallback((node) => {
      if (node) {
        node.scrollIntoView({ smooth: true });
      }
    }, []);

    const handleSendMessage = (message) => {
      const { files } = message;

      let data = {
        ConversationId: currentConversation.id,
        sender: userProfile.id,
        text: message.message,
        viewedUser: [userProfile.id],
      };
      if (files) {
        data = {
          ...data,
          files,
        };
      }

      SocketIO.emit(SOCKET_EVENT_TYPE.SEND_MESSAGE, data);
    };

    const handleScroll = () => {
      if (refChatMessages.current) {
        const { scrollTop } = refChatMessages.current;
        if (scrollTop === 0 && currentConversation.messages?.length >= 15) {
          getMoreMessages(
            currentConversation.messages?.length,
            currentConversation.id
          );
          setRefFirstMessage.current.scrollIntoView();
        }
      }
    };

    const otherUser = currentConversation.members.find(
      (member) => member.id !== userProfile.id
    );
    return (
      <div className="chat" {...rest}>
        <div className="chat-user-info">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "50px",
            }}
          >
            {otherUser.img ? (
              <div
                className={`${
                  otherUser.isOnline === true ? "avatar-container" : ""
                }`}
              >
                <Avatar size={40} src={otherUser.img} />
              </div>
            ) : (
              <div
                className={`${
                  otherUser.isOnline === true ? "avatar-container" : ""
                }`}
              >
                <Avatar
                  size={40}
                  style={{ fontSize: "1.5rem" }}
                  className="avatar"
                >
                  {otherUser.abbrName}
                </Avatar>
              </div>
            )}

            <div className="chat-user-names">
              <p style={{ marginBottom: 0 }}>
                {otherUser.firstName} {otherUser.lastName}
              </p>

              {otherUser.isOnline && (
                <p style={{ marginBottom: 0, fontSize: ".7rem" }}>Active now</p>
              )}
            </div>
          </div>

          <CloseOutlined
            style={{ fontSize: "1rem", cursor: "pointer" }}
            onClick={() => closeConversation(currentConversation)}
          />
        </div>

        <div
          className="chat-messages"
          ref={refChatMessages}
          onScroll={handleScroll}
        >
          {currentConversation.messages?.length > 0 ? (
            currentConversation?.messages?.map((message, i) => {
              const user = currentConversation.members.find(
                (member) => member?.id === message?.sender
              );
              const firstMessage =
                currentConversation.messages.indexOf(message) === 0;

              const lastMessage = currentConversation.messages.length - 1 === i;

              return (
                <div
                  ref={
                    firstMessage
                      ? setRefFirstMessage
                      : lastMessage
                      ? setRef
                      : null
                  }
                  style={{
                    textAlign: `${
                      user?.id !== userProfile?.id ? "left" : "right"
                    }`,
                    marginBottom: "5px",
                  }}
                  key={message?.id}
                  visible="true"
                >
                  <Tooltip
                    placement={
                      user?.id !== userProfile?.id
                        ? "bottomRight"
                        : "bottomLeft"
                    }
                    title={
                      <p className="date-messages">
                        {moment(message.messageDate).format(
                          "MMM DD YYYY hh:mm A"
                        )}
                      </p>
                    }
                  >
                    {message.type === "image" ? (
                      <div
                        className={`chat-message ${
                          user?.id !== userProfile?.id
                            ? "chat-message-contact-image"
                            : "chat-message-user-image"
                        }`}
                      >
                        <img src={message.documentFileUrl} alt="Hacking hr" />
                      </div>
                    ) : message.type === "document" ? (
                      <div
                        className={`chat-message ${
                          user?.id !== userProfile?.id
                            ? "chat-message-contact"
                            : "chat-message-user"
                        }`}
                      >
                        <a
                          href={message.documentFileUrl}
                          className="link-document-container"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            shape="circle"
                            icon={
                              <FilePdfOutlined
                                style={{ marginBottom: "0px" }}
                              />
                            }
                            className="pdf-icon"
                          />

                          <p>
                            {message.documentFileUrl.replace(
                              "https://upload-files-lab.s3.amazonaws.com/",
                              ""
                            )}
                          </p>
                        </a>
                      </div>
                    ) : (
                      <div
                        className={`chat-message ${
                          user?.id !== userProfile?.id
                            ? "chat-message-contact"
                            : "chat-message-user"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    )}
                  </Tooltip>
                  {currentConversation?.messages[i + 1]?.sender !==
                  message?.sender ? (
                    <>
                      {user?.img ? (
                        <Avatar
                          src={user?.img}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          size={25}
                        />
                      ) : (
                        <Avatar size={25} style={{ marginTop: "10px" }}>
                          {user?.abbrName}
                        </Avatar>
                      )}
                    </>
                  ) : null}
                </div>
              );
            })
          ) : (
            <h3>Send the first message of conversation</h3>
          )}
        </div>
        <FormMessage
          handleSendMessage={handleSendMessage}
          openEmojiPicker={openEmojiPicker}
          setOpenEmojiPicker={setOpenEmojiPicker}
        />
      </div>
    );
  }
);

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getMoreMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
