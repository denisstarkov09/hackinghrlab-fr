import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  getMoreMessages,
  getConversations,
} from "redux/actions/conversation-actions";
import {
  setConversations,
  readMessages,
} from "redux/actions/conversation-actions";
import { FilePdfOutlined, MessageOutlined } from "@ant-design/icons";
import { Affix, Avatar, Badge, Button, Tooltip } from "antd";
import moment from "moment";
import SocketIO from "services/socket";
import { SOCKET_EVENT_TYPE } from "enum";
import Conversation from "./Conversations";
import FormMessage from "./FormMessage";

import "./style.scss";
import { CustomDrawer } from "components";
import { useRef } from "react";
import { conversationsSelector } from "redux/selectors/conversationSelector";

const ChatMobile = ({
  conversations,
  userProfile,
  openChat,
  setOpenChat,
  setConversations,
  readMessages,
  getMoreMessages,
  getConversations,
}) => {
  const [currentConversation, setCurrentConversation] = useState({});
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const refChatMessages = useRef(null);

  const setRefFirstMessage = useRef(null);
  const setRefLastMessage = useRef(null);

  let messasgesNotViewed = 0;

  if (conversations.length > 0) {
    for (const conversation of conversations) {
      messasgesNotViewed += conversation.messages.filter(
        (message) => !message.viewedUser.includes(userProfile.id)
      ).length;
    }
  }

  useEffect(() => {
    getConversations(userProfile.id);
  }, [getConversations, userProfile]);

  useEffect(() => {
    const lastConversationId = localStorage.getItem("lastConversationOpen");

    const lastConversation = conversations.find(
      (conversation) => conversation.id === +lastConversationId
    );

    if (lastConversation) {
      setCurrentConversation(lastConversation);
      if (
        lastConversation.messages.find(
          (message) => !message.viewedUser.includes(userProfile.id)
        ) &&
        openChat
      ) {
        readMessages(userProfile.id, lastConversation.id);
      }
    } else {
      setCurrentConversation(conversations[0]);
      if (
        conversations[0]?.messages?.find(
          (message) => !message?.viewedUser?.includes(userProfile.id)
        ) &&
        openChat
      ) {
        readMessages(userProfile.id, conversations[0].id);
      }
    }
  }, [conversations, userProfile, readMessages, openChat]);

  useEffect(() => {
    if (userProfile?.isOnline === false) {
      SocketIO.emit(SOCKET_EVENT_TYPE.USER_ONLINE, {
        id: userProfile.id,
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (setRefLastMessage.current) {
      setRefLastMessage.current.scrollIntoView();
    }
  });

  useEffect(() => {
    SocketIO.on(SOCKET_EVENT_TYPE.NEW_CONVERSATION, (newConversation) => {
      if (conversations.length > 0) {
        if (
          !newConversation.members.includes(userProfile.id) &&
          !newConversation.members.some(
            (member) => member.id === userProfile.id
          )
        )
          return;

        const conversation = conversations.find(
          (conversation) => conversation.id === newConversation.id
        );

        if (!conversation) {
          setConversations([
            ...conversations,
            { ...newConversation, messages: [] },
          ]);

          return;
        }

        if (
          conversation.messages.find(
            (message) => !message.viewedUser.includes(userProfile.id)
          )
        ) {
          readMessages(userProfile.id, conversation.id);
        }
      }
    });
  }, [conversations, readMessages, userProfile.id, setConversations]);

  const handleConversation = (conversation) => {
    if (
      conversation.messages.find(
        (message) => !message.viewedUser.includes(userProfile.id)
      )
    ) {
      readMessages(userProfile.id, conversation.id);
    }

    localStorage.setItem("lastConversationOpen", `${conversation.id}`);

    setCurrentConversation(conversation);
  };

  const handleSendMessage = (message) => {
    SocketIO.emit(SOCKET_EVENT_TYPE.SEND_MESSAGE, {
      ConversationId: currentConversation.id,
      sender: userProfile.id,
      text: message,
      viewedUser: [userProfile.id],
    });
  };

  const BadgeProps = {
    count: messasgesNotViewed > 0 ? messasgesNotViewed : null,
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

  const otherUser = currentConversation?.members?.find(
    (member) => member.id !== userProfile.id
  );

  return (
    <>
      {!openChat ? (
        <Affix offsetBottom={!openChat ? 150 : 40} className="affix">
          <Badge
            {...BadgeProps}
            style={{
              position: "absolute",
              right: -380,
              top: 5,
            }}
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<MessageOutlined style={{ fontSize: "2rem" }} />}
              onClick={() => setOpenChat()}
              style={{
                width: 80,
                height: 80,
                position: "absolute",
                right: -400,
              }}
            />
          </Badge>
        </Affix>
      ) : (
        <CustomDrawer
          className=""
          title="Messages"
          width="90%"
          visible={openChat}
          onClose={() => setOpenChat(false)}
          destroyOnClose={true}
        >
          <div className="chat-mobile">
            <div className="chat-mobile-messages-container">
              <div className="chat-mobile-user-info">
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

                  <div className="chat-mobile-user-names">
                    <p style={{ marginBottom: 0 }}>
                      {otherUser.firstName} {otherUser.lastName}
                    </p>

                    {otherUser.isOnline && (
                      <p style={{ marginBottom: 0, fontSize: ".7rem" }}>
                        Active now
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="chat-mobile-messages"
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

                    const lastMessage =
                      currentConversation.messages.length - 1 === i;

                    return (
                      <div
                        ref={
                          firstMessage
                            ? setRefFirstMessage
                            : lastMessage
                            ? setRefLastMessage
                            : null
                        }
                        style={{
                          textAlign: `${
                            user.id !== userProfile.id ? "left" : "right"
                          }`,
                          marginBottom: "5px",
                        }}
                        key={message.id}
                      >
                        <Tooltip
                          placement={
                            user.id !== userProfile.id
                              ? "bottomRight"
                              : "bottomLeft"
                          }
                          title={
                            <p className="date-messages">
                              {moment(message.messageDate).format(
                                "MMM DD YYYY hh:mm"
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
                              <img
                                src={message.documentFileUrl}
                                alt="Hacking hr"
                              />
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
                            {user.img ? (
                              <Avatar
                                src={user.img}
                                alt={`${user.firstName} ${user.lastName}`}
                                size={25}
                              />
                            ) : (
                              <Avatar size={25} style={{ marginTop: "10px" }}>
                                {user.abbrName}
                              </Avatar>
                            )}
                          </>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "calc(100vh - 300px)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>Send the first message of conversation</h2>
                  </div>
                )}
              </div>
              <FormMessage
                handleSendMessage={handleSendMessage}
                openEmojiPicker={openEmojiPicker}
                setOpenEmojiPicker={setOpenEmojiPicker}
              />
            </div>

            <div className="conversations-mobile">
              {conversations.map((conversation) => {
                const otherMember = conversation.members.find(
                  (member) => member.id !== userProfile.id
                );

                return (
                  <Conversation
                    key={conversation.id}
                    user={otherMember}
                    conversation={conversation}
                    handleConversation={handleConversation}
                  />
                );
              })}
            </div>
          </div>
        </CustomDrawer>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  conversations: conversationsSelector(state).conversations,
});

const mapDispatchToProps = {
  setConversations,
  readMessages,
  getMoreMessages,
  getConversations,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMobile);
