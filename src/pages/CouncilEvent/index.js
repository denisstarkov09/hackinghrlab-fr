import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { homeSelector } from "redux/selectors/homeSelector";
import { councilSelector } from "redux/selectors/councilSelector";
import { INTERNAL_LINKS, EVENT_TYPES } from "enum";

import { actions as councilConversation } from "redux/actions/councilConversation-actions";
import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";
import { councilConversationSelector } from "redux/selectors/councilConversationSelector";

import { isEmpty } from "lodash";
import moment from "moment-timezone";

import ButtonsCouncilEvents from "./ButtonsCouncilEvents";
import MemberSpeakers from "./MembersSpeakers";

import { convertToLocalTime } from "utils/format";

import Emitter from "services/emitter";

import {
    CollapseComponent,
} from "components";

import {
    Space,
    notification
} from "antd";

import IconBack from "images/icon-back.svg";

import "./style.scss";

const CouncilPageAdmin = ({
  userProfile,
  getCouncilEvents,
  allCouncilEvents,
  joinCouncilEvent,
  joinCouncilEventWait
}) => {

    const location = useLocation();
    const id = location.pathname.substring(16,location.pathname.length)
    const [event, setEvent] = useState({});
    const [limit, setLimit] = useState(0)
    const [showProfileCompletionFirewall, setShowProfileCompletionFirewall] = useState(false);
    const userTimezone = moment.tz.guess();

    const timezone = !isEmpty(event) && event.timezone;

    useEffect(() => {
        getCouncilEvents();
    },[getCouncilEvents])

    useEffect(() => {
        const _event = allCouncilEvents.find((eve) => eve.id === Number(id));
        setEvent(_event);
    },[allCouncilEvents,id,setEvent])

    useEffect(() => {
        if(userProfile !== undefined){
            const limit1  = event?.CouncilEventPanels?.filter((panel) => {
                return panel?.arrayControlIdsEvents?.some(users => {
                    return Number(users.id) === Number(userProfile.id)
                })
            })

            const limit2  = event?.CouncilEventPanels?.filter((panel) => {
                return panel?.CouncilEventPanelists?.some(users => {
                    return Number(users.UserId) === Number(userProfile.id)
                })
            })

            if(limit1 !== undefined && limit2 !== undefined){
              setLimit([...limit1, ...limit2]?.length)  
            }
            
        }
    }, [event, userProfile])

    const content = (panels) => {

        let startTime = convertToLocalTime(panels?.startDate, event?.timezone);
        let endTime = convertToLocalTime(panels?.endDate, event?.timezone);

        return (
          <div className="content-collapse" key={panels?.id}>
            <p
                style={{margin:'0px',marginTop:'3px', fontSize: '30px', fontWeight: 'bold'}}
            >
                {panels?.panelName}
            </p>
            <p
                style={{margin:'0px',marginTop:'3px'}}
            >
                <b>Panel Date</b>:{` ${startTime.format("LL")}`}
            </p>
            <p className="title-collapse"
                style={{margin:'0px',marginTop:'3px'}}
            >
                <b>Panel Start Time:</b> {startTime.format("HH:mm")} {moment.tz.guess()}
            </p>
            <p className="title-collapse"
                style={{margin:'0px',marginTop:'3px', marginBottom: '10px'}}
            >
                <b>Panel End Time:</b> {endTime.format("HH:mm")} {moment.tz.guess()}
            </p>
          </div>
        )  
    };

    const updateDataInformation = () => {
        getCouncilEvents(() => {
            const _event = allCouncilEvents.find((eve) => eve.id === Number(id));

            const limit1  = event?.CouncilEventPanels?.filter((panel) => {
                return panel?.arrayControlIdsEvents?.some(users => {
                    return Number(users.id) === Number(userProfile.id)
                })
            })

            const limit2  = event?.CouncilEventPanels?.filter((panel) => {
                return panel?.CouncilEventPanelists?.some(users => {
                    return Number(users.UserId) === Number(userProfile.id)
                })
            })

            if(limit1 !== undefined && limit2 !== undefined){
              setLimit([...limit1, ...limit2]?.length)  
            }

            setEvent(_event);
        }); 
    }

    const dataIterated = (panels,users) => {
        let userSelects = users?.map((data) => {
            if(Number(data?.id) === Number(userProfile?.id)){
                return {
                    id: panels?.id, 
                    isModerator: false, 
                    buttonsAccept: true,
                    UserId: data?.id,
                    User: data,
                    pending: true
                } 
            }else{
                return {
                    id: panels?.id, 
                    isModerator: false, 
                    buttonsAccept: true,
                    UserId: data?.id,
                    User: data,
                    pending: (userProfile?.role !== 'admin') ? false : true
                } 
            }  
        })
      
        let usersSelectss = []
        if(userSelects.length > 0){
            usersSelectss = [...panels?.CouncilEventPanelists, ...userSelects]
        }else{
            usersSelectss = [...panels?.CouncilEventPanelists]
        }    

        return (
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyDontent: "space-around",
                flexWrap: "wrap",
            }}>
                {usersSelectss?.map((user,index) => {
                
                    return (
                        <MemberSpeakers
                            key={index}
                            usersPanel={user}
                            isAdmin={userProfile?.role === "admin" ? true : false}
                            remove={() => {
                                joinCouncilEventWait(
                                    panels.id,
                                    user.User,
                                    "Unjoin",
                                    false,
                                    false,
                                    event,
                                    () => updateDataInformation()
                                ); 
                            }}
                            removeAdmin={() => {
                                joinCouncilEvent(
                                    panels.id,
                                    Number(user.UserId),
                                    "Unjoin",
                                    false,
                                    false,
                                    event.id,
                                    () => updateDataInformation()
                                ); 
                            }}
                            joinAdmin={() => {
                                joinCouncilEvent(
                                    panels.id,
                                    Number(user.UserId),
                                    "Join",
                                    false,
                                    false,
                                    event.id,
                                    () => updateDataInformation()
                                );
                            }}
                        />
                    )
                })}
            </div>
        )
    };

    const completeProfile = () => {
        Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
    };

    const functionOrderPanels = (panels) => {
        if(panels !== undefined){
            let newPanels = panels.filter((t) => (t?.typePanel.length !== 0) ? t?.typePanel?.includes('panel') : true)

            let arrayOrderNumer = newPanels.sort((a,b) => {

                let aTime = convertToLocalTime(a?.startDate, event?.timezone).format("YYYYMMDDHHmm");
                let bTime = convertToLocalTime(a?.startDate, event?.timezone).format("YYYYMMDDHHmm");

                return Number(aTime) - Number(bTime)
        
            })

            return arrayOrderNumer
        }else{
            return panels
        }
    }

    const displayPanels = functionOrderPanels(event?.CouncilEventPanels)?.map((panel, index) => {
        return (
            <CollapseComponent
                key={panel?.id}
                informationCollapse={content(panel)}
                className={"container-panel"}
                dataIterated={dataIterated(panel, panel.arrayControlIdsEvents)}
                buttons={
                    <ButtonsCouncilEvents
                        index={index}
                        panel={panel}
                        limit2={limit >= event.maxNumberOfPanelsUsersCanJoin}
                        withdraw={() => {
                            joinCouncilEventWait(
                                panel.id,
                                userProfile,
                                "Unjoin",
                                false,
                                false,
                                event,
                                () => updateDataInformation()
                            );
                        }}
                        join={() => {
                            if(event?.status !== 'closed'){
                                joinCouncilEventWait(
                                    panel.id,
                                    userProfile,
                                    "Join",
                                    false,
                                    false,
                                    event,
                                    () => updateDataInformation()
                                );
                            }else{
                                notification.info({
                                    message: "Sorry, this event is closed"
                                })
                            }
                        }}
                        withdrawAdmin={() => {
                            joinCouncilEvent(
                                panel.id,
                                Number(userProfile.id),
                                "Unjoin",
                                false,
                                false,
                                event.id,
                                () => updateDataInformation()
                            );
                            
                        }}
                        completeProfile={() => setShowProfileCompletionFirewall(true)}
                        userProfile={userProfile}
                    />
                }
            />
        );
    });
  
    return (
        <>
            <div className="council-page-events-3">
            <div className="search-results-container"> 
                <div className="council-page__container">
                <div className="council-page__results">
                    <div className="council-page__row">
                    <div className="council-page__info-column"></div>
                    <div className="council-page__content">
                        <div className="council-filter-panel">
                            <Link to={INTERNAL_LINKS.HOME}>
                                <div className="council-page__content-top">
                                <div className="council-page__content-top-back">
                                    <img src={IconBack} alt="icon-back" />
                                </div>
                                <h4>Back</h4>
                                </div>
                            </Link>
                            <Space direction="vertical" className="new-detail">
                                <h2 style={{paddingTop: '20px'}}>Event Name: {event?.eventName}</h2>
                                <h4>
                                Date:{" "}
                                {convertToLocalTime(event?.startDate, timezone).format("LL")} -{" "}
                                {convertToLocalTime(event?.endDate, timezone).format("LL")} (
                                {userTimezone})
                                </h4>
                                <h4>Description: {event?.description}</h4>
                            </Space>
                            <div className="fix-width">
                                {displayPanels}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            {showProfileCompletionFirewall && (
                <div
                className="skill-cohort-firewall"
                onClick={() => {
                    setShowProfileCompletionFirewall(false);
                }}
                >
                <div className="upgrade-notification-panel" onClick={completeProfile}>
                    <h3>
                        You must fully complete your profile before joining an event.
                    </h3>
                </div>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
  councilResources: councilSelector(state).councilResources,
  ...councilEventSelector(state),
  ...councilConversationSelector(state),
});

const mapDispatchToProps = {
  ...councilConversation,
  ...councilEventActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilPageAdmin);
