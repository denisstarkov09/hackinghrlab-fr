import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CustomButton, CustomModal} from "components";
import NoItemsMessageCard from "components/NoItemsMessageCard";

import "./style.scss";

const Collapse = ({
    panels,
    members,
    isAdmin,
    searchUser,
    setId,
    joinUser,
    UserProfile,
    removeUserFunction,
    setBulCompleteProfile,
    contentText,
    bulJoin,
    typeCard,
    bulDescription,
    bulPersonalAgenda,
    setDataForAdded,
    functionRemoveToMyAgenda,
    functionAddedToMyAgenda,
}) => {

    const {panelName, startDate, endDate, id, description, usersAddedToThisAgenda} = panels
    
    const [visibleConfirmApply, setVisibleConfirmApply] = useState(false);
    const [withdraw, setWithdraw] = useState(false)
    const [idWithdraw, setIdWithdraw] = useState(-1)
    const [bulJoinOrWithdraw, setBulJoinOrWithdraw] = useState(false)
    const memberRef = useRef();
    const [bulAddedToMyAgenda, setBulAddedToMyAgenda] = useState(false)
    const [toMyPersonalAgenda,setToMyPersonalAgenda] = useState(false)


    const collapseFunction = () => {
        if(visibleConfirmApply !== true){
            memberRef.current.scroll(0,0)
            setVisibleConfirmApply(true)
        }else{
            setVisibleConfirmApply(false)
        }
    }

    members.props.children.forEach((data) => {
        if(withdraw !== true && bulJoinOrWithdraw !== true){
            if(UserProfile.id === data.props.usersPanel.User.id){
                setWithdraw(true)
                setIdWithdraw(data.props.usersPanel.id)
            }
        }
    })

    const takeActionWithdrawOrJoinUser = () => {
        if(withdraw){
            setBulJoinOrWithdraw(true)
            removeUserFunction(idWithdraw,"",panelName)
            setWithdraw(false)
            setIdWithdraw(-1)
        }else{
            if(UserProfile.percentOfCompletion === 100){
                setBulJoinOrWithdraw(false)
                joinUser({
                    id:id,
                    startDate: startDate,
                    endDate: endDate, 
                    panelName: panelName
                })
            }else{
                setBulCompleteProfile(true)
            }
        }
    }

    useEffect(() => {
        if(UserProfile.id !== undefined){
            for(let i = 0 ; i < usersAddedToThisAgenda.length ; i++ ){
                if(Number(usersAddedToThisAgenda[i]) === Number(UserProfile.id)){
                    setBulAddedToMyAgenda(true)
                }
            }
        }
    },[UserProfile,setBulAddedToMyAgenda,usersAddedToThisAgenda])

    return (
      <>
        <div className={typeCard} key={id}>
            {contentText}
            <div style={{width:"100%", height:"50px"}}></div>
            <div className="container-button">
                {bulJoin &&
                    <CustomButton
                        className="button-speaker"
                        text={(withdraw) ? "Withdraw" : "Join"}
                        size="md"
                        type={(withdraw) ? "third" : "secondary"}
                        onClick={() => takeActionWithdrawOrJoinUser()}
                    />  
                }
                {isAdmin && 
                    <CustomButton
                        className="button-speaker"
                        text="Add user"
                        size="md"
                        type="primary"
                        onClick={() => {
                            setId({
                                id:id,
                                startDate: startDate,
                                endDate: endDate, 
                                panelName: panelName
                            })
                            searchUser(true) 
                        }}
                    /> 
                }
                {bulPersonalAgenda &&
                    <CustomButton
                        className="button-speaker"
                        text={bulAddedToMyAgenda ? "ADDED TO MY PERSONAL AGENDA" : "ADD TO MY PERSONAL AGENDA"}
                        size="md"
                        type={bulAddedToMyAgenda ? "secondary" : "primary"}
                        onClick={() => {
                            if(bulAddedToMyAgenda){
                                functionRemoveToMyAgenda({
                                    PanelId: id,
                                    type: "Remove"
                                })
                                setBulAddedToMyAgenda(false)
                            }else{
                                setToMyPersonalAgenda(true)
                                setDataForAdded(id) 
                            }
                        }}
                    /> 
                }
                {bulAddedToMyAgenda &&
                    <CustomButton
                        className="button-speaker"
                        text={`DOWNLOAD CALENDAR REMINDER`}
                        size="md"
                        type="primary"
                        onClick={() => {}}
                    /> 
                }
                <CustomButton
                    className="button-speaker"
                    text={`${visibleConfirmApply ? "Less" : "More" } information`}
                    size="md"
                    type="information"
                    onClick={() => {collapseFunction()}}
                /> 
            </div>
            <div 
                className={`${visibleConfirmApply ? "collapseContaintTrue" : "collapseContaintFalse"}`} 
                ref={memberRef}
                style={{opacity: `${visibleConfirmApply ? "100%" : "0%"}`}}
            >
                {
                    (members.props.children.length > 0) ? (
                        <>
                            {bulDescription && <p className="container-panel-speaker-parraf" style={{marginBottom: "40px"}}>Description: <span className="not-bold">{description}</span></p>}
                            {members}
                        </>
                    ) : (
                        <NoItemsMessageCard
                            message={`There aren't members in this panel.`}
                        />
                    )
                }
            </div>
        </div>
        <CustomModal
            title="Are you sure?"
            visible={toMyPersonalAgenda}
            centered
            onCancel={() => setToMyPersonalAgenda(false)}
        >
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
                    setBulAddedToMyAgenda(true)
                }}
            />
        </CustomModal>
      </>
    );
  };
  
  const mapStateToProps = (state, props) => ({

  });
  
  const mapDispatchToProps = {

  };

  Collapse.propTypes = {
    panels: PropTypes.object,
    members: PropTypes.element,
    isAdmin: PropTypes.bool,
    searchUser: PropTypes.func,
    setId: PropTypes.func,
    joinUser: PropTypes.func,
    UserProfile: PropTypes.object,
    removeUserFunction: PropTypes.func,
    setBulCompleteProfile: PropTypes.func,
    contentText: PropTypes.element,
    bulJoin: PropTypes.bool,
    typeCard: PropTypes.string,
    bulDescription: PropTypes.bool,
    bulPersonalAgenda: PropTypes.bool,
    setDataForAdded: PropTypes.func,
    functionRemoveToMyAgenda: PropTypes.func,
    functionAddedToMyAgenda: PropTypes.func
  };
  
  Collapse.defaultProps = {
    panels: {},
    members: <></>,
    isAdmin: false,
    searchUser: () => {},
    setId: () => {},
    joinUser: () => {},
    UserProfile: {},
    removeUserFunction: () => {},
    setBulCompleteProfile: () => {},
    contentText: <></>,
    bulJoin: false,
    typeCard: "",
    bulDescription: false,
    bulPersonalAgenda: false,
    setToPersonalAgenda: () => {},
    setDataForAdded: () => {},
    functionRemoveToMyAgenda: () => {},
    functionAddedToMyAgenda: () => {},
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Collapse);
  