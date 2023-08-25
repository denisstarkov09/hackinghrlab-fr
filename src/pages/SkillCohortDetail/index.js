import { Space } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { INTERNAL_LINKS, EVENT_TYPES } from "enum";
import moment from "moment-timezone";
import { CustomButton, CustomModal } from "components";
import Emitter from "services/emitter";
import IconBack from "images/icon-back.svg";
import { isEmpty } from "lodash";

import { homeSelector } from "redux/selectors/homeSelector";
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";
import { skillCohortParticipantSelector } from "redux/selectors/skillCohortParticipantSelector";

import { actions as skillCohortActions } from "redux/actions/skillCohort-actions";
import { actions as skillCohortParticipantActions } from "redux/actions/skillCohortParticipant-actions";

import "./style.scss";

const SkillCohortDetail = ({
  getSkillCohort,
  skillCohort,
  userProfile,
  createSkillCohortParticipant,
  getSkillCohortParticipant,
  skillCohortParticipant,
  withdrawParticipation,
}) => {
  const [showPremiumFirewall, setShowPremiumFirewall] = useState(false);
  const [showProfileCompletionFirewall, setShowProfileCompletionFirewall] =
    useState(false);
  const [hasCohortStarted, setHasCohortStarted] = useState(false);
  const [confirmJoinModal, setConfirmJoinModal] = useState(false);
  const [confirmWithdrawModal, setConfirmWithdrawModal] = useState(false);
  const [isDayBeforeStartDate, setIsDayBeforeStartDate] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const dateToday = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ssZ");

  useEffect(() => {
    getSkillCohort(id);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isEmpty(skillCohort)) {
      const { startDate } = skillCohort;

      if (
        dateToday ===
        moment(startDate)
          .tz("America/Los_Angeles")
          .startOf("day")
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ssZ")
      ) {
        setHasCohortStarted(true);
        setIsDayBeforeStartDate(true);
      } else if (
        dateToday >=
        moment(startDate)
          .tz("America/Los_Angeles")
          .format("YYYY-MM-DD HH:mm:ssZ")
      ) {
        setHasCohortStarted(true);
      } else {
        setHasCohortStarted(false);
      }
    }

    // eslint-disable-next-line
  }, [skillCohort]);

  useEffect(() => {
    if (userProfile.id) {
      getSkillCohortParticipant(id, userProfile.id);
    }
    // eslint-disable-next-line
  }, [userProfile]);

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const completeProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
  };

  const handleOnJoin = () => {
    if (hasCohortStarted && skillCohortParticipant.hasAccess) {
      history.push(`${INTERNAL_LINKS.PROJECTX}/${id}/resources`);
    } else {
      if (!userProfile.completed) {
        return setShowProfileCompletionFirewall(true);
      }

      const hasFreeTrial =
        userProfile.hasOwnProperty("projectXFreeTrialAvailability") &&
        userProfile.projectXFreeTrialAvailability;

      const isUserPremium =
        userProfile.hasOwnProperty("memberShip") &&
        userProfile.memberShip === "premium";

      if (hasFreeTrial || isUserPremium) {
        setConfirmJoinModal(true);
      } else {
        setShowPremiumFirewall(true);
      }
    }
  };

  const displayPremiumFirewall = showPremiumFirewall && (
    <div
      className="skill-cohort-firewall"
      onClick={() => setShowPremiumFirewall(false)}
    >
      <div className="upgrade-notification-panel" onClick={planUpgrade}>
        <h3>
          Upgrade to a PREMIUM Membership and get unlimited access to the LAB
          features. Click here to upgrade to PREMIUM Membership.
        </h3>
      </div>
    </div>
  );

  const displayProfileCompletionFirewall = showProfileCompletionFirewall && (
    <div
      className="skill-cohort-firewall"
      onClick={() => setShowProfileCompletionFirewall(false)}
    >
      <div className="upgrade-notification-panel" onClick={completeProfile}>
        <h3>
          You must fully complete your profile before joining the Project-X
          feature. Click here to complete your profile.
        </h3>
      </div>
    </div>
  );

  const withdraw = () => {
    setConfirmWithdrawModal(true);
  };

  let displayBtn;

  if (!isEmpty(skillCohort)) {
    if (hasCohortStarted) {
      if (skillCohortParticipant.hasAccess) {
        if (isDayBeforeStartDate) {
          displayBtn = `Starting on ${moment(skillCohort.startDate).format(
            "LL"
          )}`;
        } else {
          displayBtn = "Enter Dashboard";
        }
      } else {
        if (!isEmpty(skillCohortParticipant)) {
          displayBtn = "You missed this cohort";
        } else {
          displayBtn = "Cohort has started.";
        }
      }
    } else {
      if (skillCohortParticipant.hasAccess) {
        displayBtn = `Starting on ${moment(skillCohort.startDate).format(
          "LL"
        )}`;
      } else {
        displayBtn = "Join";
      }
    }
  } else {
    displayBtn = "";
  }

  const handleJoinSkillCohort = () => {
    setConfirmJoinModal(false);
    createSkillCohortParticipant(skillCohort.id, userProfile.id);
  };

  const handleWithdrawParticipation = () => {
    setConfirmWithdrawModal(false);
    withdrawParticipation(skillCohortParticipant.id);
  };

  const disabled =
    (hasCohortStarted && !skillCohortParticipant.hasAccess) ||
    (!hasCohortStarted && skillCohortParticipant.hasAccess);

  return (
    <>
      <div className="skill-cohort-detail-page">
        <div className="skill-cohort-detail-page-header">
          <div className="skill-cohort-detail-page-header-content">
            <div>
              <div
                className="skill-cohort-detail-page-header-content-back-btn"
                onClick={() => history.push(INTERNAL_LINKS.PROJECTX)}
              >
                <div className="skill-cohort-detail-page-header-content-back">
                  <div className="skill-cohort-detail-page-header-content-back-img">
                    <img src={IconBack} alt="icon-back" />
                  </div>
                  <h4>Back to List</h4>
                </div>
              </div>
              <div className="title">
                <h2>{skillCohort.title}</h2>
              </div>
            </div>
          </div>
          <div className="skill-cohort-btn">
            <CustomButton
              text={displayBtn}
              htmlType="button"
              onClick={handleOnJoin}
              disabled={disabled || isDayBeforeStartDate}
            />
          </div>
        </div>
        <div className="skill-cohort-detail-page-body">
          <div className="skill-cohort-detail-page-body-content">
            <Space direction="vertical" size="large">
              <Space direction="vertical" size="large">
                <h3>How ProjectX Works</h3>
                <div
                  className="details"
                  dangerouslySetInnerHTML={{
                    __html: (skillCohort.howProjectXWorks || {}).html || "",
                  }}
                />
              </Space>
              <Space direction="vertical" size="large">
                <h3>Description </h3>
                <div
                  className="details"
                  dangerouslySetInnerHTML={{
                    __html: (skillCohort.description || {}).html || "",
                  }}
                />
              </Space>
              {/* <Space direction="vertical">
                <h3>Learning Objectives</h3>
                <div className="details">{skillCohort.objectives}</div>
              </Space> */}
              <Space direction="vertical" size="large">
                <h3>Schedule</h3>
                <div className="details">
                  Starting on {moment(skillCohort.startDate).format("LL")}
                </div>
                <div className="details">
                  Finishing on {moment(skillCohort.endDate).format("LL")}
                </div>
              </Space>
              {skillCohortParticipant.hasAccess &&
                moment(skillCohort.startDate)
                  .tz("America/Los_Angeles")
                  .startOf("day")
                  .format("YYYY-MM-DD HH:mm:ssZ") > dateToday && (
                  <div className="withdraw-btn">
                    <CustomButton
                      text="Withdraw"
                      htmlType="button"
                      type="ghost"
                      onClick={withdraw}
                    />
                  </div>
                )}
            </Space>
          </div>
        </div>
        {displayPremiumFirewall}
        {displayProfileCompletionFirewall}
        <CustomModal
          visible={confirmJoinModal}
          title="Join this cohort?"
          subTitle="Click confirm if you want to join"
          onCancel={() => setConfirmJoinModal(false)}
          width={376}
        >
          <div className="confirm-modal">
            <CustomButton
              text="Cancel"
              type="primary outlined"
              htmlType="button"
              onClick={() => setConfirmJoinModal(false)}
            />
            <CustomButton
              text="Confirm"
              type="primary"
              htmlType="button"
              onClick={handleJoinSkillCohort}
            />
          </div>
        </CustomModal>
        <CustomModal
          visible={confirmWithdrawModal}
          title="Withdraw participation?"
          subTitle="Click confirm if you want to withdraw"
          onCancel={() => setConfirmWithdrawModal(false)}
          width={376}
        >
          <div className="confirm-modal">
            <CustomButton
              text="Cancel"
              type="primary outlined"
              htmlType="button"
              onClick={() => setConfirmWithdrawModal(false)}
            />
            <CustomButton
              text="Confirm"
              type="primary"
              htmlType="button"
              onClick={handleWithdrawParticipation}
            />
          </div>
        </CustomModal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...skillCohortSelector(state),
  ...skillCohortParticipantSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...skillCohortActions,
  ...skillCohortParticipantActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SkillCohortDetail);
