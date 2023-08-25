import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";

import { homeSelector } from "redux/selectors/homeSelector";
import { actions as homeActions } from "redux/actions/home-actions";

import { Tabs } from "components";
import NoItemsMessageCard from "components/NoItemsMessageCard";
import PanelSpeakers from "./Panels";
import Speakers from "pages/Conference2023/Conference2023Speakers/SpeakersContainer";

import "./style.scss";

const Speaker2023 = ({
  userProfile,
  sendEmailAuthorization,
  activeOrDenyAuthorization
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [currentTab, setCurrentTab] = useState(query.get("tab") || "0");
  const [visibleConfirmApply, setVisibleConfirmApply] = useState(true);
  const id = query?.get("id");
  const accepted = query?.get("accepted");

  const TabData = [
    {
      title: "Panels",
      key: 1,
      content: () => (<PanelSpeakers type={'panels'} />)
    },
    {
      title: "My panels",
      key: 2,
      content: () => (<PanelSpeakers type={'myPanels'} />)
    },
    {
      title: "Speakers",
      key: 3,
      content: () => (<Speakers className={"container-users-speakers"} type={"speakers"} />)
    },
  ];

  const onApplySpeaker = () => {
    sendEmailAuthorization({ userId: userProfile?.id});
  };

  useEffect( () => {
    if(id !== null){
      if(accepted === "true" || accepted === "false"){
        activeOrDenyAuthorization({userId: id , typeAuthorization: (accepted === "true") ? "accepted" : "reject"})
      }
    }
  },[id,accepted,activeOrDenyAuthorization])

  const responseAuthorization = (userProfile?.speakersAuthorization === "reject") ? (
    <div className="council-page__list-wrap">
        <NoItemsMessageCard
          message={`You must be a proud speaker member to see this view.`}
        />
      </div>
  ) : (
    (userProfile?.speakersAuthorization === "pending") ? (
      <div className="council-page__list-wrap">
          <NoItemsMessageCard
            message={`Your application is pending for approval`}
          />
        </div>
    ) : (
      <Modal
        visible={visibleConfirmApply}
        title="Apply to Speakers 2023"
        width={500}
        onCancel={() => setVisibleConfirmApply(false)}
        onOk={() => {
          onApplySpeaker()
          setVisibleConfirmApply(false)
        }}
        okText="Yes"
      >
        Thank you for applying to be a speaker in Hacking HR's "FORWARD 2023". Your application has been sent and will be approved very soon. You will receive a confirmation email once the application is approved. After that you will be able to select the panels you want to join. Thank you!
      </Modal>
    )
  )

  return (
    <>
      {userProfile?.speakersAuthorization === "accepted" ? (
        <div className="speaker2023-page">
          <Tabs
            data={TabData}
            current={currentTab}
            onChange={setCurrentTab}
          />
        </div>
      ) : (
        <div>
          {responseAuthorization}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile
});

const mapDispatchToProps = {
  sendEmailAuthorization: homeActions.sendEmailAuthorizationSpeakers,
  activeOrDenyAuthorization: homeActions.activeOrDenyAuthorization
};

export default connect(mapStateToProps, mapDispatchToProps)(Speaker2023);
