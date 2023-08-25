import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import { actions as speaker } from "redux/actions/speaker-actions";
import { getUser } from "redux/actions/home-actions";

import "./style.scss";

const ButtonsSpeakers = ({
    role,
    userProfile,
    setOpenSearchUser,
    panels,
    setBulCompleteProfile,
    setPanel,
    joinUser,
    removeUserFunction,
    setRemoveMembersSpeakers,
    removeMembersSpeakers,
    index,
    allMyPanels
  }) => {

    const {id, startDate, endDate, panelName, SpeakerMemberPanels} = panels
  
    const [bulJoinOrWithdraw, setBulJoinOrWithdraw] = useState(false)
    const [idWithdraw, setIdWithdraw] = useState(-1)
    const [withdraw, setWithdraw] = useState(false)
    const [full, setFul] = useState(false)

    useEffect(() => {
      setWithdraw(false)
    }, [allMyPanels, setWithdraw])

    useEffect(() => {
      let arraySpeakersNotAdmin = SpeakerMemberPanels?.filter((member) => {
        return member?.isModerator === false
      })
      
      if(arraySpeakersNotAdmin?.length > 4){
        setFul(true)
      }else{
        setFul(false)
      }
    },[SpeakerMemberPanels])

    useEffect(() => {
      allMyPanels.forEach((data) => {
        if(withdraw !== true && bulJoinOrWithdraw !== true){
          if(id === data?.SpeakerPanel?.id){
              setWithdraw(true)
              setIdWithdraw(data?.id)
          }
        }
      })
    }, [panels, withdraw, bulJoinOrWithdraw, userProfile, setWithdraw, setIdWithdraw, allMyPanels, id])

    const takeActionWithdrawOrJoinUser = (index) => {
        if(withdraw){
            setBulJoinOrWithdraw(true)
            removeUserFunction(idWithdraw,"",panelName)
            setWithdraw(false)
            setIdWithdraw(-1)
        }else{
            if(userProfile?.percentOfCompletion === 100){
                setBulJoinOrWithdraw(false)
                joinUser({
                    id:id,
                    startDate: startDate,
                    endDate: endDate, 
                    panelName: panelName
                },index)
            }else{
                setBulCompleteProfile(true)
            }
        }
    }

    useEffect(() => {
      if(removeMembersSpeakers){
        setTimeout(() => {
          setRemoveMembersSpeakers(false)
          setWithdraw(false)
          setIdWithdraw(-1)
        }, 100)
      }
    },[removeMembersSpeakers,setRemoveMembersSpeakers,setWithdraw, setIdWithdraw ])
  
    return (
      <>
        {(!full) &&
          <button
            className={(withdraw) ? "button-withdraw" : "button-join"}
            onClick={() => takeActionWithdrawOrJoinUser(index)}
          >
            {(withdraw) ? "Withdraw" : "Join"}
          </button>
        }
        {(full && withdraw) &&
            <button
              className={(withdraw) ? "button-withdraw" : "button-join"}
              onClick={() => takeActionWithdrawOrJoinUser(index)}
            >
              {(withdraw) ? "Withdraw" : "Join"}
            </button>
        }
        {(full === true && withdraw === false) && 
          <div className="button-full">This panel is FULL</div>
        }
        {(role === "admin") &&  
            <button
              className="button-admin"
              onClick={() => {
                setPanel({
                    id:id,
                    startDate: startDate,
                    endDate: endDate, 
                    panelName: panelName
                })
                setOpenSearchUser(true) 
              }}
            >
              Add user
            </button>
        }
    </>
    );
  };
  
  const mapStateToProps = (state, props) => ({
    allPanelSpeakers: speakerAllPanelSpeakerSelector(state).allPanelSpeakers,
    allUserSpeaker: speakerAllPanelSpeakerSelector(state).allUserSpeakers,
    userProfile: homeSelector(state).userProfile,
  });
  
  const mapDispatchToProps = {
    removeUserSpeakerToPanel: speaker.removeUserSpeakerToPanel,
    addUserSpeakerToPanel: speaker.addUserSpeakerToPanel,
    getUser
  };

  ButtonsSpeakers.propTypes = {
    role: PropTypes.string,
    setOpenSearchUser: PropTypes.func,
    joinUser: PropTypes.func,
    removeUserFunction: PropTypes.func
  };
  
  ButtonsSpeakers.defaultProps = {
    role: "",
    setOpenSearchUser: () => {},
    joinUser: () => {},
    removeUserFunction: () => {}
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ButtonsSpeakers);
  