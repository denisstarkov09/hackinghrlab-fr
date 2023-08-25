import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";

import { actions as speaker } from "redux/actions/speaker-actions";
import { getUser } from "redux/actions/home-actions";

import {
  CustomButton
} from "components";

import {
  notification
} from "antd";

import "./style.scss";

const ButtonsCouncilEvents = ({
    withdraw,
    withdrawAdmin,
    join,
    panel,
    userProfile,
    completeProfile,
    limit2
  }) => {

    const [hasJoined, setHasJoined] = useState(false)
    const [selectType, setSelectType] = useState('')

    const isFull = panel?.CouncilEventPanelists.filter((user) => 
      user.isModerator === false
    )?.length >= +panel.numberOfPanelists;

    useEffect(() => {

      if(panel.arrayControlIdsEvents.length > 0){

        const councilAwait = panel.arrayControlIdsEvents.find(
          (panelList) => Number(panelList.id) === Number(userProfile.id)
        )

        if(!councilAwait){
          const councilEventPanelist = panel.CouncilEventPanelists.find(
            (panelist) => panelist.User.id === userProfile.id
          );
          
          setHasJoined(!!councilEventPanelist);
          setSelectType('sure')
        }else{
          setHasJoined(!!councilAwait);
          setSelectType('await')
        }
        
      }else{
        const councilEventPanelist = panel.CouncilEventPanelists.find(
          (panelist) => panelist.User.id === userProfile.id
        );
        
        setHasJoined(!!councilEventPanelist);
        setSelectType('sure')
      }

    },[panel, setHasJoined, setSelectType, userProfile])
  
  
    return (
      <>
        {hasJoined ? (
          <CustomButton
            text="Withdraw"
            onClick={() => {
              if(selectType === 'sure'){
                withdrawAdmin()
              }
              if(selectType === 'await'){
                withdraw()
              }
              setHasJoined(false);
            }}
            type="third"
            size="small"
          />
        ) : (
          <CustomButton
            text={isFull ? "Already Full" : "Join"}
            disabled={isFull}
            onClick={() => {
              if(userProfile.percentOfCompletion !== 100){
                completeProfile()
              }else{
                if(limit2){
                  notification.info({
                    message: "You can only join up to 1 panels."
                  })
                }else{
                  join()
                  setHasJoined(true);
                }
              }
            }}
            size="small"
          />
        )}
    </>
    );
  };
  
  const mapStateToProps = (state, props) => ({
    allPanelSpeakers: speakerAllPanelSpeakerSelector(state).allPanelSpeakers,
    allUserSpeaker: speakerAllPanelSpeakerSelector(state).allUserSpeakers,
  });
  
  const mapDispatchToProps = {
    removeUserSpeakerToPanel: speaker.removeUserSpeakerToPanel,
    addUserSpeakerToPanel: speaker.addUserSpeakerToPanel,
    getUser
  };

  ButtonsCouncilEvents.propTypes = {
    userProfile: PropTypes.object,
    withdraw: PropTypes.func,
    join: PropTypes.func,
    completeProfile: PropTypes.func,
    isFull: PropTypes.bool
  };
  
  ButtonsCouncilEvents.defaultProps = {
    userProfile: {},
    isFull: false,
    withdraw: () => {},
    join: () => {},
    completeProfile: () => {}
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ButtonsCouncilEvents);
  