import React, {useEffect, useState, useCallback} from "react";
import { connect } from "react-redux";
import { ModalCompleteYourProfile } from "components";
import { authSelector } from "redux/selectors/authSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { getUser } from "redux/actions/home-actions";
import { registerUserIfNotAreRegisterConference2023, setBulRegister, setActiveBoton } from "redux/actions/speaker-actions"
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";

import "./style.scss";

const MessagesGeneral = ({
  isAuthenticated,
  userProfile,
  getUser,
  setBulRegister,
  bulRegister,
  setActiveBoton,
  registerUserIfNotAreRegisterConference2023
}) => {

  const [bulCompleteProfile,setBulCompleteProfile] = useState(false)
  const [bulKnowRegister, setBulKnowRegister] = useState(false)
  const [bulMessageOut, setBulMessageOut] = useState(false)
  const [animation, setAnimation] = useState({opacity:"0%"})
  const [porcentCompletion, setPorcentCompletion] = useState(-1)

  useEffect(() => {
    if(isAuthenticated !== false){
        getUser();   
    }
  }, [isAuthenticated, getUser]);

  const quitMessage = useCallback(() => {
    setAnimation({opacity:"100%"})
    setTimeout(() => {
      setAnimation({opacity:"0%"})
    }, 22000);
    setTimeout(() => {
      setBulMessageOut(false)
      setBulRegister(false)
    }, 2400);
  },[setBulMessageOut,setBulRegister])

  const confirm = useCallback(() => {
    if(userProfile.registerConference2023 !== undefined){
      setBulKnowRegister(false)
      if(!userProfile.registerConference2023){
        setActiveBoton(true)
        setBulMessageOut(true)
        quitMessage()
        registerUserIfNotAreRegisterConference2023()
      }
    }
  }, [quitMessage,registerUserIfNotAreRegisterConference2023,setBulMessageOut, setActiveBoton, userProfile.registerConference2023])

  const functionPorcentProfile = useCallback(() => {
    if(userProfile.percentOfCompletion !== undefined){
      if(userProfile.percentOfCompletion === 100){
        return true
      }else{
        return false
      }
    }else{
      return
    }
  },[userProfile])

  const functionActive = useCallback(async () => {
    const bulWait = functionPorcentProfile()

    if(!bulWait){
      setBulCompleteProfile(true)
      setPorcentCompletion(userProfile.percentOfCompletion)
    }
  },[functionPorcentProfile, setBulCompleteProfile, setPorcentCompletion, userProfile])

  useEffect(() => {

    const bulWait = functionPorcentProfile()

    if(bulWait){
      setBulCompleteProfile(false)
      setBulRegister(true)
      if(bulKnowRegister){
        confirm()
      }
    }

    if(userProfile.percentOfCompletion !== undefined){
        if(userProfile.percentOfCompletion !== 100 && userProfile.percentOfCompletion !== 0){
          if(porcentCompletion !== userProfile.percentOfCompletion){
            functionActive()
          }
        }
    }

  }, [
    userProfile,
    setBulCompleteProfile,
    setBulRegister,
    bulKnowRegister,
    confirm,
    porcentCompletion,
    setPorcentCompletion,
    functionActive,
    functionPorcentProfile
  ])

  return (
    <>
      {isAuthenticated && 
        <>
          {((userProfile.firstName !== undefined && userProfile.firstName !== '' && bulCompleteProfile)) && 
            <div className="complete-profile">
              <ModalCompleteYourProfile
                userProfile={userProfile}
                get={getUser}
                setBulKnowRegister={setBulKnowRegister}
                setBulCompleteProfile={setBulCompleteProfile}
              />
            </div>
          }
          {(bulMessageOut && bulRegister) && 
            <div className="complete-profile" style={animation}>
              <div className="container-message">
                <p className="text-message">You are now registered</p>
              </div>
            </div>
          }
        </>
      }
    </>
  );
  };
  
  const mapStateToProps = (state, props) => ({
    isAuthenticated: authSelector(state).isAuthenticated,
    userProfile: homeSelector(state).userProfile,
    bulRegister: speakerAllPanelSpeakerSelector(state).bulRegister
  });
  
  const mapDispatchToProps = {
    getUser,
    setBulRegister,
    registerUserIfNotAreRegisterConference2023,
    setActiveBoton
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MessagesGeneral);