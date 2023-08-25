/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Popover, Spin } from "antd";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { INTERNAL_LINKS } from "enum";
import { notificationSelector } from "redux/selectors/notificationSelector";
import {
  getNotifications,
  markNotificationToRead,
} from "redux/actions/notification-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { getAllParticipated } from "redux/actions/skillCohortParticipant-actions";
import { skillCohortParticipantSelector } from "redux/selectors/skillCohortParticipantSelector";

import IconNotification from "images/icon-notification.svg";
import IconLoading from "images/icon-loading.gif";

import "./style.scss";

const MAX_NOTIFICATIONS = 50;

const Notification = ({
  className,
  notificationList,
  loading,
  unreadCount,
  userProfile,
  getNotifications,
  markNotificationToRead,
  allParticipated,
  getAllParticipated,
}) => {
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!isEmpty(userProfile) && userProfile.id) {
      getAllParticipated(userProfile.id);
    }
  }, [userProfile]);

  const renderLoading = () => (
    <div className="loading-container">
      <Spin indicator={<img src={IconLoading} alt="loading-img" />} />
    </div>
  );

  const onVisibleChange = (visible) => {
    setVisible(visible);
  };

  const onClickNotification = (noti) => {
    markNotificationToRead([noti.id], userProfile.id);

    const cohort = allParticipated.find(
      (participant) => participant.SkillCohortId === noti.meta.SkillCohortId
    );

    let cohortLink;
    
    if (cohort) {
      cohortLink = `${INTERNAL_LINKS.PROJECTX}/${noti.meta.SkillCohortId}/resources?key=2&id=${noti.meta.id}`;
    } else {
      cohortLink = `${INTERNAL_LINKS.PROJECTX}/${noti.meta.SkillCohortId}`;
    }

    switch (noti.type) {
      case "marketplace":
        history.push(INTERNAL_LINKS.MARKETPLACE);
        break;
      case "event":
        window.open(noti.meta.publicLink, "_blank");
        break;
      case "podcast":
        history.push(
          `${INTERNAL_LINKS.LIBRARY_ITEM}/podcast/${noti.meta.dataValues.id}`
        );
        break;
      case "content":
        history.push(INTERNAL_LINKS.LEARNING_LIBRARY);
        break;
      case "resource":
        history.push(cohortLink);
        break;
      case "post":
        history.push(`${INTERNAL_LINKS.POST}/${noti.meta.dataValues.PostId}`);
        break;
      case "council-conversation":
        history.push(`${INTERNAL_LINKS.COUNCIL}?id=${noti.meta.dataValues.id}`);
        break;
      case "channelInvit":
        history.push(`${noti?.meta?.linkChannel}`);
        break;
      case "Bonfire":
        history.push(`${INTERNAL_LINKS.BONFIRES}?key=all-bonfires`);
        break;
      default:
        break;
    }
    setVisible(false);
  };

  const renderNotifications = () => (
    <>
      {notificationList.slice(0, 6).map((noti) => (
        <div className="notification-item" key={noti.id}>
          {!noti.readers.includes(userProfile.id) ? (
            <div className="notification-item-circle" />
          ) : (
            <div />
          )}
          <h5
            className="notification-item-message"
            onClick={() => onClickNotification(noti)}
          >
            {noti.message}
          </h5>
        </div>
      ))}
      <div className="notification-item see-more">
        <Link
          to={INTERNAL_LINKS.NOTIFICATIONS}
          onClick={() => setVisible(false)}
        >
          See more ...
        </Link>
      </div>
    </>
  );

  const content = () => (
    <div className="notification-content">
      {notificationList.length > 0 ? (
        loading ? (
          renderLoading()
        ) : (
          renderNotifications()
        )
      ) : (
        <div className="notification-item">
          <div />
          <h5 className="notification-item-message">No notifications.</h5>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    getNotifications(1, MAX_NOTIFICATIONS);
  }, []);
  return (
    <Popover
      placement="bottom"
      title=""
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <Badge className={className} count={unreadCount} overflowCount={999}>
        <div className="notification-icon">
          <img src={IconNotification} alt="icon-notification" />
        </div>
      </Badge>
    </Popover>
  );
};

Notification.propTypes = {
  className: PropTypes.string,
};

Notification.defaultProps = {
  className: "",
};

const mapStateToProps = (state) => ({
  ...notificationSelector(state),
  userProfile: homeSelector(state).userProfile,
  allParticipated: skillCohortParticipantSelector(state).allParticipated,
});

const mapDispatchToProps = {
  getNotifications,
  markNotificationToRead,
  getAllParticipated,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
