import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { actions as speaker } from "redux/actions/speaker-actions";
import { CustomButton} from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import { Modal } from "antd"
import IconLogo from "images/logo-sidebar.svg";
import clsx from "clsx";
import { CloseCircleFilled } from "@ant-design/icons";

const SpeakerButtons = ({
    addedToPersonalAgenda,
    userProfile,
    id, 
    startDate,
    endDate,
    type,
    usersAddedToThisAgenda,
    getAllPanelSpeakers,
    setActiveMessages
}) => {

    const [bulAddedToMyAgenda, setBulAddedToMyAgenda] = useState(false)
    const [toMyPersonalAgenda,setToMyPersonalAgenda] = useState(false)

    const functionAddedToMyAgenda = () => {

        const data = {
            PanelId: id,
            startTime: startDate,
            endTime: endDate,
            panelType: type,
            type: "Added",
        }

        if(userProfile.registerConference2023){
            addedToPersonalAgenda(data, () => {
                setBulAddedToMyAgenda(true)
            })
        }else{
            setActiveMessages(true)
            setTimeout(() => {
                setActiveMessages(false)
            }, 2000);
        }
    }

    const functionRemoveToMyAgenda = (data) => {
        addedToPersonalAgenda(data)
        getAllPanelSpeakers("All")
    }

    useEffect(() => {
        if(userProfile.id !== undefined){
            setBulAddedToMyAgenda(false)
            if(usersAddedToThisAgenda?.length !== undefined){
                for(let i = 0 ; i < usersAddedToThisAgenda?.length ; i++ ){
                    if(Number(usersAddedToThisAgenda[i]) === Number(userProfile.id)){
                        setBulAddedToMyAgenda(true)
                    }
                }
            }
        }
    },[userProfile,setBulAddedToMyAgenda,usersAddedToThisAgenda])
    
    return (
        <>
            <button
                className={bulAddedToMyAgenda ? "button-added" : "button-add"}
                onClick={(e) => {
                    e.preventDefault()
                    if(bulAddedToMyAgenda){
                        functionRemoveToMyAgenda({
                            PanelId: id,
                            type: "Remove"
                        })
                        setBulAddedToMyAgenda(false)
                    }else{
                        setToMyPersonalAgenda(true)
                    }
                }}
            >
                {bulAddedToMyAgenda ? `ADDED TO MY PERSONAL AGENDA` : `ADD TO MY PERSONAL AGENDA`}
            </button>
            <div style={{height: "10px", width: "200px"}}></div>
            <Modal
                title={
                    <div className="custom-modal-title">
                    <h3>Are you sure?</h3>
                    <div className="custom-modal-logo">
                        <img src={IconLogo} alt="custom-logo" />
                    </div>
                    </div>
                }
                centered
                visible={toMyPersonalAgenda}
                onCancel={() => setToMyPersonalAgenda(false)}
                closable={true}
                footer={[]}
                width={"300px"}
                closeIcon={<CloseCircleFilled className="custom-modal-close" />}
                className={clsx("custom-modal")}
                wrapClassName={clsx("custom-modal-wrap")}
            >
                <div className="container-buttons">
                    <CustomButton
                        key="Cancel"
                        text="Cancel"
                        type="primary outlined"
                        size="xs"
                        className="button-modal"
                        style={{padding: "0px 10px"}}
                        onClick={() => setToMyPersonalAgenda(false)}
                    />,
                    <CustomButton
                        key="Confirm"
                        text="Confirm"
                        type="primary"
                        size="xs"
                        className="button-modal"
                        style={{padding: "0px 10px", marginLeft: "10px"}}
                        onClick={() => {
                            functionAddedToMyAgenda()
                            setToMyPersonalAgenda(false)
                        }}
                    />
                </div>
            </Modal>
        </>
    );
  };
  
  const mapStateToProps = (state, props) => ({
    allPanelSpeakers: speakerAllPanelSpeakerSelector(state).allPanelSpeakers,
    userProfile: homeSelector(state).userProfile,
  });
  
  const mapDispatchToProps = {
    getAllPanelSpeakers: speaker.getAllPanelSpeakers,
    addedToPersonalAgenda: speaker.addedToPersonalAgenda,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SpeakerButtons);