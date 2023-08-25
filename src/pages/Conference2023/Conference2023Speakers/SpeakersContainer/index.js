import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { actions as speaker } from "redux/actions/speaker-actions";
import { convertToLocalTime } from "utils/format";
import { homeSelector } from "redux/selectors/homeSelector";
import { Avatar } from "antd";
import SpeakerButtons from "./SpeakerButtons";

import IconPlus from "images/icon-plus.svg";

import "./style.scss";

const SpeakerContainer = ({
    allUserSpeaker,
    getAllUserSpeaker,
    getAllPanelsOfOneUser,
    allPanelsOfOneUser,
    maxLength,
    className,
    setActiveMessages,
    type
}) => {

    const [windowPopUpForSpeaker, setWindowPopUpForSpeaker] = useState(false)
    const [speakerSelect, setSpeakerSelect] = useState({})

    useEffect(() => {
        getAllUserSpeaker(type)
    },[ getAllUserSpeaker, type])

    const loadDataForPopUpSpeaker = (id) => {
        getAllPanelsOfOneUser({id:id, type: "speakers"}, (error) => {
            if(!error){
                setWindowPopUpForSpeaker(true)
            }
        })
    }

    const speakers = allUserSpeaker?.userSpeakers?.map((user, index) => {
                
        if(maxLength !== undefined){
            if(maxLength < index+1){
                return (<div key={index} ></div>)
            }
        }

        let userImg;

        if(user?.img){
            userImg = (
                <div className="container-avatar">
                    <Avatar src={user.img} style={{position: "absolute", background: "rgba(255, 255, 255, 0.15)", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} />
                </div>
            ) 
        }else{
            userImg = (
                <div className="container-avatar">
                    <Avatar style={{fontSize:"40px", position: "absolute", background: "rgba(255, 255, 255, 0.15)",  width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}> 
                        {user?.abbrName}
                    </Avatar>
                </div>
            )
        }
        
        return (
            <div 
                className={className} 
                key={index} 
                onClick={(e) => {
                    if(e.target.className !== "button-linkedin"){
                        loadDataForPopUpSpeaker(user?.id)
                        setSpeakerSelect({name: user?.firstName,lastName:user?.lastName, link: user?.personalLinks?.contact, about: user?.about})
                    }
                }}
            >
                <div className="container-picture" style={{background: "none", overflow: "visible"}}>
                    {userImg}
                </div>
                <div className="container-text">
                    <p className="p-users-name">{user?.firstName} {user?.lastName}</p>
                    <p className="p-users-profession">{user?.titleProfessions} / {user?.company}</p>
                </div>
                <a 
                    className="button-linkedin" 
                    href={(user?.personalLinks?.linkedin?.substring(0,7) !== "http://" && user?.personalLinks?.linkedin?.substring(0,8) !== "https://") ? `https://${user?.personalLinks?.linkedin}` : user?.personalLinks?.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <></>
                </a>
                <p className="p-users-more">Click to see bio and sessions</p>
            </div>
        )

    })

    return (
        <>
            <div className={(className === "container-users") ? "container-speakers" : "container-conference-speakers"}>
                {speakers}
            </div>
            {windowPopUpForSpeaker && 
                <div className="window-user">
                    <div className="card-popUp">
                        <div className="container-icon-close" >
                            <img className="icon-close" onClick={() => {setWindowPopUpForSpeaker(false)}} src={IconPlus} alt="icon-close" />
                        </div>
                        <h1 className="title-name">{speakerSelect?.name} {speakerSelect?.lastName}</h1>
                        <p>
                            <span className="bold-subtitle">Link: </span> 
                            {speakerSelect?.link}
                        </p>
                        <p>
                            <span className="bold-subtitle">Biography: </span> 
                            {speakerSelect?.about}
                        </p>
                        <p><span className="bold-subtitle">Sessions: </span></p>
                        {allPanelsOfOneUser?.map((SpeakerPanel, index) => {

                            if(SpeakerPanel.SpeakerPanel !== undefined){
                                
                                return (
                                    <div className="container-sessions-speakers" key={SpeakerPanel.SpeakerPanel.id}>
                                        <h3>{SpeakerPanel.SpeakerPanel.panelName}</h3>
                                        <p>- {convertToLocalTime(SpeakerPanel.SpeakerPanel.startDate, SpeakerPanel.SpeakerPanel.timeZone).format("MM-DD-YYYY hh:mm a")}</p>
                                        <p>- {convertToLocalTime(SpeakerPanel.SpeakerPanel.endDate, SpeakerPanel.SpeakerPanel.timeZone).format("MM-DD-YYYY hh:mm a")}</p>
                                        <SpeakerButtons 
                                            usersAddedToThisAgenda={SpeakerPanel.SpeakerPanel.usersAddedToThisAgenda} 
                                            id={SpeakerPanel.SpeakerPanel.id} 
                                            startDate={SpeakerPanel.SpeakerPanel.startDate}
                                            endDate={SpeakerPanel.SpeakerPanel.endDate}
                                            type={SpeakerPanel.SpeakerPanel.type}
                                            allPanelsOfOneUser={getAllPanelsOfOneUser}
                                            setActiveMessages={setActiveMessages}
                                        />
                                    </div>
                                )

                            }else{

                                return (
                                    <div className="container-sessions-speakers" key={SpeakerPanel.id}>
                                        <h3>{SpeakerPanel.panelName}</h3>
                                        <p>- {convertToLocalTime(SpeakerPanel.startDate, SpeakerPanel.timeZone).format("MM-DD-YYYY hh:mm a")}</p>
                                        <p>- {convertToLocalTime(SpeakerPanel.endDate, SpeakerPanel.timeZone).format("MM-DD-YYYY hh:mm a")}</p>
                                        <SpeakerButtons 
                                            usersAddedToThisAgenda={SpeakerPanel.usersAddedToThisAgenda} 
                                            id={SpeakerPanel.id} 
                                            startDate={SpeakerPanel.startDate}
                                            endDate={SpeakerPanel.endDate}
                                            type={SpeakerPanel.type}
                                            allPanelsOfOneUser={getAllPanelsOfOneUser}
                                            setActiveMessages={setActiveMessages}
                                        />
                                    </div>
                                )

                            }
                
                        })}
                    </div>
                </div>
            }
        </>
    );
  };
  
  const mapStateToProps = (state, props) => ({
    allUserSpeaker: speakerAllPanelSpeakerSelector(state).allUserSpeakers,
    allPanelsOfOneUser: speakerAllPanelSpeakerSelector(state).allPanelsOfOneUser,
    userProfile: homeSelector(state).userProfile,
  });
  
  const mapDispatchToProps = {
    getAllUserSpeaker: speaker.getAllUserSpeaker,
    getAllPanelsOfOneUser: speaker.getAllPanelsOfOneUser
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SpeakerContainer);