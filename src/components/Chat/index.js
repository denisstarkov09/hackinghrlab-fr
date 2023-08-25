import React, { useEffect } from "react";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";
import { conversationsSelector } from "redux/selectors/conversationSelector";
import {
  setConversations,
  readMessages,
  setCurrentConversations,
  getConversations,
} from "redux/actions/conversation-actions";
import SocketIO from "services/socket";
import { SOCKET_EVENT_TYPE } from "enum";
import Conversation from "./Conversations";
import InternalChat from "./Chat";

import "./style.scss";

const Chat = ({
  conversations,
  userProfile,
  setConversations,
  readMessages,
  currentConversations,
  setCurrentConversations,
  getConversations,
}) => {
  useEffect(() => {
    getConversations(userProfile.id);
  }, [getConversations, userProfile]);

  useEffect(() => {
    if (userProfile?.isOnline === false) {
      SocketIO.emit(SOCKET_EVENT_TYPE.USER_ONLINE, {
        id: userProfile.id,
      });
    }
  }, [userProfile]);

  const handleConversation = (conversation) => {
    if (
      conversation.messages.find(
        (message) => !message?.viewedUser?.includes(userProfile.id)
      )
    ) {
      readMessages(userProfile.id, conversation.id);
    }

    if (
      currentConversations.find(
        (currentConversation) => currentConversation.id === conversation.id
      )
    ) {
      return;
    }

    if (
      (currentConversations.length === 3 && window.screen.width > 1600) ||
      (currentConversations.length === 2 && window.screen.width <= 1600)
    ) {
      const newCurrentConversations = [...currentConversations, conversation];
      newCurrentConversations.splice(0, 1);
      return setCurrentConversations(newCurrentConversations);
    }

    setCurrentConversations([...currentConversations, conversation]);
  };

  const closeConversation = (conversation) => {
    const newConversations = currentConversations.filter(
      (currentConversation) => currentConversation.id !== conversation.id
    );

    setCurrentConversations(newConversations);
  };

  useEffect(() => {
    if (conversations.length > 0 && currentConversations.length > 0) {
      const conversationWithMessageNotViewed = conversations.find(
        (conversation) =>
          conversation.messages.some(
            (message) => !message?.viewedUser?.includes(userProfile.id)
          )
      );

      const existCurrentConversation = currentConversations?.find(
        (currentConversation) =>
          currentConversation?.id === conversationWithMessageNotViewed?.id
      );

      if (existCurrentConversation) {
        readMessages(userProfile.id, existCurrentConversation.id);

        const conversationsData = conversations.map((conversation) => {
          const newConversationMessages = conversation.messages.map(
            (message) => {
              if (!message?.viewedUser?.includes(userProfile.id)) {
                return {
                  ...message,
                  viewedUser: [...message.viewedUser, userProfile?.id],
                };
              }
              return message;
            }
          );

          return {
            ...conversation,
            messages: newConversationMessages,
          };
        });

        setConversations(conversationsData);
      }
    }
  }, [
    conversations,
    userProfile,
    currentConversations,
    readMessages,
    setConversations,
  ]);

  useEffect(() => {
    if (currentConversations.length > 0) {
      const newCurrentConversations = currentConversations.map(
        (conversation) => {
          const newConversation = conversations.find(
            (gConversation) => gConversation.id === conversation.id
          );

          if (
            newConversation?.messages?.length !== conversation?.messages?.length
          ) {
            return newConversation;
          }

          for (let i = 0; i < currentConversations.length; i++) {
            if (
              newConversation?.members[i]?.isOnline !==
              conversation?.members[i]?.isOnline
            ) {
              return newConversation;
            }
          }

          return conversation;
        }
      );

      let canUpdate = false;

      if (currentConversations.length > 0) {
        for (let i = 0; i < currentConversations.length; i++) {
          for (let j = 0; j < currentConversations[i]?.members?.length; j++) {
            if (
              newCurrentConversations[i]?.members[j]?.isOnline !==
              currentConversations[i]?.members[j]?.isOnline
            ) {
              canUpdate = true;
              break;
            }
          }

          if (
            newCurrentConversations[i]?.messages?.length !==
            currentConversations[i]?.messages?.length
          ) {
            canUpdate = true;
            break;
          }
        }
      }

      if (canUpdate) {
        setCurrentConversations(newCurrentConversations);
      }
    }
  }, [conversations, currentConversations, setCurrentConversations]);

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

        if (conversation && newConversation.showConversation === true) {
          setConversations(
            conversations.map((conversation) => {
              if (conversation.id === newConversation.id) {
                return {
                  ...conversation,
                  showConversation: newConversation.showConversation,
                };
              }
              return {
                ...conversation,
              };
            })
          );
          return setCurrentConversations([
            ...currentConversations,
            {
              ...conversation,
              showConversation: newConversation.showConversation,
            },
          ]);
        }

        if (!conversation) {
          setConversations([
            ...conversations,
            { ...newConversation, messages: [] },
          ]);
          setCurrentConversations([
            ...currentConversations,
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

        if (currentConversations.find((c) => c.id === conversation.id)) {
          return;
        }

        if (
          (currentConversations.length === 3 && window.screen.width > 1600) ||
          (currentConversations.length === 2 && window.screen.width <= 1600)
        ) {
          const newCurrentConversations = [
            ...currentConversations,
            conversation,
          ];
          newCurrentConversations.splice(0, 1);
          return setCurrentConversations(newCurrentConversations);
        }

        setCurrentConversations([...currentConversations, conversation]);
      }
    });
  }, [
    conversations,
    currentConversations,
    readMessages,
    userProfile.id,
    setCurrentConversations,
    setConversations,
  ]);

  return (
    <>
      {currentConversations?.length > 0 &&
        currentConversations.map((currentConversation, i) => (
          <InternalChat
            key={currentConversation?.id}
            style={{ right: i === 0 ? "210px" : i === 1 ? "550px" : "890px" }}
            currentConversation={currentConversation}
            closeConversation={closeConversation}
            onClick={() => handleConversation(currentConversation)}
          />
        ))}

      <div className={`conversations`}>
        <>
          {conversations
            .filter((conversation) => conversation.showConversation === true)
            .map((conversation) => {
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
        </>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  currentConversations: conversationsSelector(state).currentConversations,
  conversations: conversationsSelector(state).conversations,
});

const mapDispatchToProps = {
  setConversations,
  readMessages,
  setCurrentConversations,
  getConversations,
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Chat));
