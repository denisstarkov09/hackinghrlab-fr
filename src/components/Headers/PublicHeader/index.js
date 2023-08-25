import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { CustomButton } from "components";
import IconMenu from "images/icon-menu-outline.svg";
import { homeSelector } from "redux/selectors/homeSelector";
import Login from "pages/Login2";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { registerUserIfNotAreRegisterConference2023, setBulRegister } from "redux/actions/speaker-actions"

import LogoSidebar from "images/logo-sidebar.svg";
// import { PublicMenuPopup } from "components";
// import { PUBLIC_HEADER_MENUS } from "enum";

import "./style.scss";

const PublicHeader = ({
  bulRegister,
  userProfile,
  registerUserIfNotAreRegisterConference2023,
  setBulRegister, 
  activeButton,
  bulChannelPage
}) => {

  const [modalRegister, setModalRegister] = useState(false)
  const [butonState, setButonState] = useState(false)
  const [bulMessageOut, setBulMessageOut] = useState(false)
  const [animation, setAnimation] = useState({opacity:"0%"})
  const [bulKnowRegister, setBulKnowRegister] = useState(false)
  const [bulModal, setBulModal] = useState(false)

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

  useEffect(() => {
    if(userProfile?.registerConference2023){
      setButonState(true)
    }
  }, [userProfile])

  useEffect(() => {
    if(activeButton){
      setButonState(true)
    }
  },[activeButton] )

  const confirm = useCallback(() => {
    setBulKnowRegister(true)
    if(userProfile?.registerConference2023 !== undefined){
      setBulKnowRegister(false)
      if(!userProfile?.registerConference2023){
        registerUserIfNotAreRegisterConference2023(() => {
          setBulMessageOut(true)
          quitMessage()
        })
      }
    }
  }, [setBulKnowRegister, userProfile, registerUserIfNotAreRegisterConference2023, quitMessage, setBulMessageOut])

  useEffect(() => {
    if(bulKnowRegister){
      confirm()
    }
  }, [userProfile,bulKnowRegister, confirm])

  const classNameObject = {
    channel: 'public-header-channel',
    conference: 'public-header-conference',
    event: 'public-header'
  }

  const searchClassname = () => {
    if(window.location.pathname.substring(0,15) === INTERNAL_LINKS.CONFERENCE_2023){
      return classNameObject.conference
    }else{
      if(bulChannelPage === 'event'){
        return classNameObject.event
      }
      if(bulChannelPage === 'channel' || window.location.pathname.substring(0,7) === INTERNAL_LINKS.VERIFY){
        return classNameObject.channel
      } 
    }
    
  }

  return (
    <>
      <div 
        className={searchClassname()}
        style={{width:"calc( 100% )"}}
      >
        {(bulChannelPage !== 'channel' && window.location.pathname.substring(0,7) !== INTERNAL_LINKS.VERIFY) && 
          <Link 
            to={INTERNAL_LINKS.HOME} 
            className={
              (window.location.pathname.substring(0,15) === INTERNAL_LINKS.CONFERENCE_2023) ? 
              "public-header-left-conference" : "public-header-left"
            }
            target="_blank"
          >
            <div className="hr-logo">
              <img src={LogoSidebar} alt="sidebar-logo" />
            </div>
          </Link>
        }
        {/* {PUBLIC_HEADER_MENUS.map((menu, index) => (
          <Link key={index} to={menu.url}>
            <span className="public-header-menu">{menu.text}</span>
          </Link>
        ))} */}
        {/* <PublicMenuPopup>
          <div className="public-header-bar">
            <i className="fal fa-bars" />
          </div>
        </PublicMenuPopup> */}
        {(window.location.pathname.substring(0,15) === INTERNAL_LINKS.CONFERENCE_2023) && 
          <>
            <input id="checkbox" className="checkboxHiden" type="checkbox" style={{zIndex: "100"}} />
            <label htmlFor="checkbox" className="conteiner-icon-menu">
              <img src={IconMenu} alt="icon-menu" />
            </label>
            <div className="public-header-right">
              <div className="public-conference-links">
                <Link 
                  style={
                    (window.location.pathname === INTERNAL_LINKS.CONFERENCE_2023) ? 
                    {textDecoration: "underline black"} : {textDecoration: "none"}
                  } 
                  to={INTERNAL_LINKS.CONFERENCE_2023}
                >
                    <p>Home</p>
                </Link>
              </div>
              <div className="public-conference-links">
                <Link 
                  style={
                    (window.location.pathname === INTERNAL_LINKS.CONFERENCE_2023 + "/highlights") ? 
                    {textDecoration: "underline black"} : {textDecoration: "none"}
                  } 
                  to={INTERNAL_LINKS.CONFERENCE_2023 + "/highlights"}
                >
                    <p>Conference Highlights</p>
                </Link>
              </div>
              <div className="public-conference-links">
                <Link 
                  style={
                    (window.location.pathname === INTERNAL_LINKS.CONFERENCE_2023 + "/speakers") ? 
                    {textDecoration: "underline black"} : {textDecoration: "none"}
                  } 
                  to={INTERNAL_LINKS.CONFERENCE_2023 + "/speakers"}
                >
                    <p>Speakers</p>
                </Link>
              </div>
              <div className="public-conference-links">
                <Link 
                  style={
                    (window.location.pathname === INTERNAL_LINKS.CONFERENCE_2023 + "/agenda") ? 
                    {textDecoration: "underline black"} : {textDecoration: "none"}
                  } 
                  to={INTERNAL_LINKS.CONFERENCE_2023 + "/agenda"}
                >
                    <p>Agenda</p>
                </Link>
              </div>
                {butonState && (
                  <div className="container-you-are-now-register">
                    <div className="div-you-are-now-register">
                      <p>YOU ARE NOW REGISTERED</p>
                    </div>
                  </div>
                )}
                {(!butonState && bulRegister) && (
                    <CustomButton
                      className="button-speaker"
                      text={"REGISTER HERE"}
                      size="md"
                      type={"primary"}
                      onClick={() => {
                        confirm()
                        setButonState(true)
                      }}
                    />
                  )}
                {(!butonState && !bulRegister) && (
                  <CustomButton
                    className="button-speaker"
                    text={"REGISTER HERE"}
                    size="md"
                    type={"primary"}
                    onClick={() => {setModalRegister(true)}}
                  />
                )}
            </div> 
            {(bulMessageOut && bulRegister) && 
              <div className="complete-profile" style={animation}>
                <div className="container-message">
                  <p className="text-message">You are now registered</p>
                </div>
              </div>
            }
            <Modal
              visible={modalRegister}
              footer={null}
              width={400}
              bodyStyle={{ overflow: "auto", padding: "20px" }}
              className="modal-container-login"
              onCancel={() => setModalRegister(false)}
            >
              <Login
                login={true}
                signUp={false}
                history={null}
                confirm={confirm}
                match={{ params: {} }}
                modal={setModalRegister}
                onClose={() => setModalRegister(false)}
              />
            </Modal>
          </>
        }
        {(bulChannelPage === 'channel' || window.location.pathname.substring(0,7) === INTERNAL_LINKS.VERIFY) && 
          <div className="public-header-right-channel">
            <CustomButton
              className="button-speaker"
              text={"log in / sign up"}
              size="md"
              type={"primary"}
              onClick={() => {
                setBulModal(true)
              }}
            />
          </div>
        }
      </div>
      {(bulChannelPage === 'channel' || window.location.pathname.substring(0,7) === INTERNAL_LINKS.VERIFY) && 
        <div className="space-channel"></div>
      }
      <Modal
        visible={bulModal}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => setBulModal(false)}
      >
        <Login
          login={true}
          signup={false}
          history={null}
          confirm={confirm}
          match={{ params: {} }}
          modal={setBulModal}
          onClose={() => setBulModal(false)}
        />
      </Modal>
    </>
  );
};

PublicHeader.propTypes = {
  title: PropTypes.string,
};

PublicHeader.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  bulRegister: speakerAllPanelSpeakerSelector(state).bulRegister,
  activeButton: speakerAllPanelSpeakerSelector(state).activeButton,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setBulRegister,
  registerUserIfNotAreRegisterConference2023
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicHeader);
