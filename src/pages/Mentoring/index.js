import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Emitter from "services/emitter";

import { Tabs } from "components";
import MentorPanel from "./Mentor";
import MenteePanel from "./Mentee";
import MenteeSetting from "./MenteeSetting";
import MentorSetting from "./MentorSetting";
import MentorList from "./MentorList";
import MenteeList from "./MenteeList";
import { homeSelector } from "redux/selectors/homeSelector";
import { mentoringSelector } from "redux/selectors/mentoringSelector";
import MemberDrawer from "containers/MemberDrawer";
import {
  setMentoringInfo,
  getMentoringInfo,
  updateMentoringInfo,
  getMentorList,
  getMenteeList,
  getMoreMentorList,
  getMoreMenteeList,
  setMatch,
} from "redux/actions/mentoring-actions";
import { EVENT_TYPES, INTERNAL_LINKS, SETTINGS } from "enum";
import IconBack from "images/icon-back.svg";

import "./style.scss";
import { Link } from "react-router-dom";

const Mentoring = ({
  isMentor,
  mentorInfo,
  isMentee,
  menteeInfo,
  allMentors,
  allMentees,
  countOfResults1,
  countOfResults2,
  currentPage1,
  currentPage2,
  mentorLoading,
  menteeLoading,
  setMentoringInfo,
  updateMentoringInfo,
  getMentoringInfo,
  getMentorList,
  getMenteeList,
  getMoreMentorList,
  getMoreMenteeList,
  setMatch,
  isUserPremium,
}) => {
  const [openSetting, setOpenSetting] = useState(false);
  const [selectedType, setSelectedType] = useState("mentor");
  const [drawerState, setDrawerState] = useState({});
  const [showFirewall, setShowFirewall] = useState(false);

  const showSetting = (type) => {
    if (isUserPremium) {
      setOpenSetting(true);
      setSelectedType(type);
    } else {
      setShowFirewall(true);
    }
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onSaveMentorSetting = (data) => {
    setOpenSetting(false);
    if (isMentor) {
      updateMentoringInfo(
        {
          id: mentorInfo.id,
          title: data.title,
          about: data.reason,
          areas: data.specialties,
          blockMatchAsMentor: data.blockMatchAsMentor,
          isMentor: 1,
        },
        () => {
          getMenteeList();
        }
      );
    } else {
      setMentoringInfo(
        {
          title: data.title,
          about: data.reason,
          areas: data.specialties,
          isMentor: 1,
        },
        () => {
          getMenteeList();
        }
      );
    }
  };

  const onSaveMenteeSetting = (data) => {
    setOpenSetting(false);
    if (isMentee) {
      updateMentoringInfo(
        {
          id: menteeInfo.id,
          title: data.title,
          about: data.reason,
          areas: data.specialties,
          blockMatchAsMentee: data.blockMatchAsMentee,
          isMentor: 0,
        },
        () => {
          getMentorList();
        }
      );
    } else {
      setMentoringInfo(
        {
          title: data.title,
          about: data.reason,
          areas: data.specialties,
          isMentor: 0,
        },
        () => {
          getMentorList();
        }
      );
    }
  };

  const TabData = [
    {
      title: "Mentor",
      content: () => (
        <MentorPanel
          setting={mentorInfo}
          isMentor={isMentor}
          openSetting={() => showSetting("mentor")}
          onEdit={() => showSetting("mentor")}
        />
      ),
    },
    {
      title: "Mentee",
      content: () => (
        <MenteePanel
          setting={menteeInfo}
          isMentee={isMentee}
          openSetting={() => showSetting("mentee")}
          onEdit={() => showSetting("mentee")}
        />
      ),
    },
  ];

  const onTabChange = (tab) => {
    setSelectedType(tab === "1" ? "mentee" : "mentor");
  };

  const onShowMore = (who) => {
    if (who) {
      // in case of mentee
      getMoreMenteeList({
        page: currentPage2 + 1,
      });
    } else {
      // in case of mentor
      getMoreMentorList({
        page: currentPage1 + 1,
      });
    }
  };

  const onSetMatch = (source, match, target) => {
    setMatch(source, match, target);
  };

  const onMemberClick = (member) => {
    setDrawerState((prev) => ({
      visible: true,
      member,
      match: member.isMentor ? menteeInfo.areas || [] : mentorInfo.areas || [],
    }));
  };

  const onDrawerClose = () => {
    setDrawerState((prev) => ({ ...prev, visible: false }));
  };

  const onMatchFromDrawer = () => {
    if (drawerState.member.isMentor) {
      setMatch(menteeInfo.id, true, drawerState.member.mid);
    } else {
      setMatch(mentorInfo.id, true, drawerState.member.mid);
    }
  };

  useEffect(() => {
    Emitter.on(EVENT_TYPES.MEMBER_CHANGED, (member) => {
      if (member.ismemtor) {
        setMatch(menteeInfo.id, true, member.mid);
      } else {
        setMatch(mentorInfo.id, true, member.mid);
      }
    });

    return () => {
      Emitter.off(EVENT_TYPES.MEMBER_CHANGED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menteeInfo, mentorInfo]);

  useEffect(() => {
    getMentoringInfo();
    getMentorList();
    getMenteeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mentoring-page">
      <div className="back-link-container">
        <Link to={INTERNAL_LINKS.COMMUNITIES}>
          <div className="council-page__content-top">
            <div className="council-page__content-top-back">
              <img src={IconBack} alt="icon-back" />
            </div>
            <h4>Back to Communities</h4>
          </div>
        </Link>
      </div>
      <div className="mentoring-page-container">
        {!openSetting && (
          <Tabs
            current={selectedType === "mentor" ? "0" : "1"}
            data={TabData}
            onChange={onTabChange}
          />
        )}
        {openSetting && selectedType === "mentor" && (
          <MentorSetting
            setting={mentorInfo}
            onCancel={() => setOpenSetting(false)}
            onSave={onSaveMentorSetting}
          />
        )}
        {openSetting && selectedType === "mentee" && (
          <MenteeSetting
            setting={menteeInfo}
            onCancel={() => setOpenSetting(false)}
            onSave={onSaveMenteeSetting}
          />
        )}
      </div>
      {!openSetting && selectedType === "mentor" && isMentor && (
        <div className="mentoring-page-list">
          <div className="mentoring-page-container">
            <MenteeList
              user={mentorInfo}
              total={
                allMentees && allMentees.length > 0
                  ? parseInt(allMentees[0].total, 10)
                  : 0
              }
              data={allMentees}
              loading={menteeLoading}
              hideMore={
                currentPage2 * SETTINGS.MAX_SEARCH_ROW_NUM >= countOfResults2
              }
              onShowMore={() => onShowMore(true)}
              onSetMatch={(match, target) =>
                onSetMatch(mentorInfo.id, match, target)
              }
              onMemberClick={onMemberClick}
            />
          </div>
        </div>
      )}
      {!openSetting && selectedType === "mentee" && isMentee && (
        <div className="mentoring-page-list">
          <div className="mentoring-page-container">
            <MentorList
              user={menteeInfo}
              total={
                allMentors && allMentors.length > 0
                  ? parseInt(allMentors[0].total, 10)
                  : 0
              }
              data={allMentors}
              loading={mentorLoading}
              hideMore={
                currentPage1 * SETTINGS.MAX_SEARCH_ROW_NUM >= countOfResults1
              }
              onShowMore={() => onShowMore(false)}
              onSetMatch={(match, target) =>
                onSetMatch(menteeInfo.id, match, target)
              }
              onMemberClick={onMemberClick}
            />
          </div>
        </div>
      )}
      {showFirewall && (
        <div
          className="mentoring-firewall"
          onClick={() => setShowFirewall(false)}
        >
          <div className="upgrade-notification-panel" onClick={planUpgrade}>
            <h3>
              Upgrade to a PREMIUM Membership and get unlimited access to the
              LAB features
            </h3>
          </div>
        </div>
      )}
      <MemberDrawer
        {...drawerState}
        onClose={onDrawerClose}
        onMatch={onMatchFromDrawer}
      />
    </div>
  );
};

Mentoring.propTypes = {
  title: PropTypes.string,
};

Mentoring.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => {
  return {
    isMentor: !!homeSelector(state).userProfile.mentor,
    isMentee: !!homeSelector(state).userProfile.mentee,
    isUserPremium: homeSelector(state).userProfile.memberShip === "premium",
    ...mentoringSelector(state),
  };
};

const mapDispatchToProps = {
  setMentoringInfo,
  getMentoringInfo,
  updateMentoringInfo,
  getMentorList,
  getMenteeList,
  getMoreMentorList,
  getMoreMenteeList,
  setMatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mentoring);
