import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { useHistory } from "react-router-dom";
import { CustomButton, CustomModal } from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  acceptTermsAndConditions,
  viewRulesGConference,
} from "redux/actions/home-actions";
import { Timeline } from "antd";
const AcceptTermsAndConditions = ({
  userProfile,
  acceptTermsAndConditions,
  viewRulesGConference,
}) => {
  const [visibleModalTermsCondition, setVisibleModalTermsCondition] =
    useState(false);
  const [visibleModalViewVideo, setVisibleModalViewVideo] = useState(false);

  useEffect(() => {
    if (userProfile.acceptTermsConditionGConference === false) {
      setVisibleModalTermsCondition(true);
    }

    if (userProfile.viewRulesGConference === false) {
      setVisibleModalViewVideo(true);
    }
  }, [userProfile]);

  const rules = [
    {
      title: "Content:",
      description: `The content during and post-event is free for the members of the
        Hacking HR LAB. You can get access to the content at any time.
        However, you must not reproduce totally or partially any part of
        this content outside of the Hacking HR LAB without our explicit
        approval.`,
    },
    {
      title: "Networking tools:",
      description: `There are several networking tools in the conference application.
        Two in particular are very useful: Bonfires and Chat. Bonfires allow
        you to create conversations with participants of the conference, and
        with the chat you can connect individually with other participants.
        The networking tools are for real networking conversations. If you
        use any of the tools for pitching, marketing or selling any product
        or service, your account will be banned from using the tools again
        for the duration of the conference.`,
    },
    {
      title: "Conference sessions:",
      description: `You can’t join more than one session simultaneously with other
    sessions. As soon as you click on JOIN a session, the option to join
    any other session at the same time and same date will be
    deactivated. You can join more sessions at other times/dates.`,
    },
    {
      title: "HR Credits:",
      description: `The conference offers more than 500 SHRM+HRCI credits. 
      The credits ARE NOT FREE and NOT transferable or shareable. 
      You MUST UPGRADE your account and become a PREMIUM member to get access to the credits. 
      Please do not email us asking for credit codes if you are not a PREMIUM user. 
      If you are a PREMIUM user, this is how it’ll work: 
      two weeks after the conference you will receive an email to download your personalized conference participation report. 
      This report will include the sessions you joined and ONLY the corresponding HRCI/SHRM codes to those sessions. 
      There is no need to email us asking for the codes. Also, please note that you SHOULD NOT share the codes with anyone. 
      Please wait until the report is ready no later than March 28th.`,
    },
    {
      title: "Certificate of participation:",
      description: `  A personalized certificate of participation will be available to all
    members of the Hacking HR LAB. You can download it and also share it
    in your social media. This certificate of participation will include
    all the sessions you joined and the amount of hours you invested in
    your learning. The certificate of participation will be available at
    the same time as your conference participation report no later than
    March 28th.`,
    },
  ];

  const history = useHistory();
  return (
    <>
      <CustomModal
        visible={visibleModalTermsCondition}
        title="Before you join the conference"
        width={800}
        onCancel={() => {
          history.goBack();
          setVisibleModalTermsCondition(false);
        }}
      >
        <p>
          The Hacking HR 2022 Global Online Conference brings the most robust
          agenda and largest lineup of speakers ever put together for an HR
          event. The content of this conference during and post-event is
          completely FREE.
        </p>

        <p>
          We do have some rules that you must acknowledge before getting access
          to the conference.
        </p>

        <p>Please read CAREFULLY and click on CONFIRM to continue:</p>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Timeline style={{ padding: "20px" }}>
            {rules.map((rule, i) => (
              <Timeline.Item key={i} dot={<span>{i + 1}</span>}>
                <span style={{ fontWeight: "bold" }}>{rule.title}</span>
                {rule.description}
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <CustomButton
            size="xs"
            text="CONFIRM"
            onClick={() => {
              acceptTermsAndConditions(userProfile.id);
              setVisibleModalTermsCondition(false);
            }}
            style={{ marginTop: "1rem" }}
          />
        </div>
      </CustomModal>
      <CustomModal
        visible={visibleModalViewVideo}
        onCancel={() => {
          viewRulesGConference(userProfile.id);
          setVisibleModalViewVideo(false);
        }}
        width={800}
      >
        <iframe
          width="750"
          height="500"
          src="https://www.youtube.com/embed/L-AGwKr4X-s"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <CustomButton
            size="xs"
            text="Continue"
            onClick={() => {
              viewRulesGConference(userProfile.id);
              setVisibleModalViewVideo(false);
            }}
            style={{ marginTop: "1rem" }}
          />
        </div>
      </CustomModal>
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  acceptTermsAndConditions,
  viewRulesGConference,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptTermsAndConditions);
