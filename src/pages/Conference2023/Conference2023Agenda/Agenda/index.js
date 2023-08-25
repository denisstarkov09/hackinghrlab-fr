import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import MemberSpeakers from "./MembersSpeakers";
import ButtonsAgenda from "./ButtonsAgenda";
import { actions as speaker } from "redux/actions/speaker-actions";
import { CollapseComponent, CustomButton } from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import { CloseCircleFilled } from "@ant-design/icons";
import { convertToLocalTime } from "utils/format";
import NoItemsMessageCard from "components/NoItemsMessageCard";
import TimeZoneList from "enum/TimezoneList";
import { INTERNAL_LINKS } from "enum";
import Arrow from "../../../../images/arrow-conference.svg"
import { authSelector } from "redux/selectors/authSelector";
import moment from 'moment'
import clsx from "clsx";
import { Modal } from "antd"
import Login from "../../../Login2";
import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";
import { useCallback } from "react";

const AgendaConference2023 = ({
    getAllPanelSpeakers,
    getAllPanelsOfOneUser,
    allPanelSpeakersFormat,
    allPanelsOfOneUserFormat,
    allPanelsOfOneUser,
    userProfile,
    maxLength,
    mySessions,
    setActiveMessages,
    allCategories,
    isAuthenticated
}) => {

    const [dataCategoriesState, setDataCategoriesState] = useState()
    const [bulModalConfirmDetail, setBulModalConfirmDetail] = useState(false)
    const [bulModal, setBulModal] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [changeSituation, setChangeSituation] = useState(false)
    const [timeZone, setTmeZone] = useState('')
    const [statePanel, setStatePanel] = useState({
        id: '',
        link: '',
        type: ''
    })

    let clockAnimation
    let clockAnimation2

    useEffect(() => {
        let objectAllCategories = {}

        allCategories.forEach((category) => {
            objectAllCategories[`${category.value}`] = category.title
        })

        setDataCategoriesState(objectAllCategories)
    }, [allCategories, setDataCategoriesState])

    useEffect(() => {
        if (userProfile.id !== undefined) {
            getAllPanelsOfOneUser({ id: userProfile.id, type: "mySessions" })
        }
        getAllPanelSpeakers("All")
    }, [getAllPanelSpeakers, userProfile, getAllPanelsOfOneUser, mySessions])

    const updateData = () => {
        if (userProfile.id !== undefined) {
            getAllPanelsOfOneUser({ id: userProfile.id, type: "mySessions" })
        }
    }

    const searchTimeZone = (timezone) => {
        let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

        if (currentTimezone) {
            currentTimezone = currentTimezone.utc[0];
        } else {
            currentTimezone = timezone;
        }

        return currentTimezone
    }

    const functionRedirect = useCallback(() => {
        if (statePanel?.type === 'Panels') {
            window.open(`${INTERNAL_LINKS.MICRO_CONFERENCE}/${statePanel?.id}?type=2023`, "_blank");
        } else {
            window.open(`${statePanel?.link}`, "_blank");
        }
    }, [statePanel])

    useEffect(() => {
        console.log(changeSituation)
        if (localStorage.getItem("community") !== null && changeSituation) {
            functionRedirect();
        }
    }, [changeSituation, functionRedirect, isAuthenticated])

    const content = (panels) => {

        let categories

        if (dataCategoriesState !== undefined) {
            categories = panels?.category?.map((data, index) => {
                if (panels?.category?.length !== index + 1) {
                    return (<span className="date-panels" key={index}> {dataCategoriesState[data]} |</span>)
                } else {
                    return (<span className="date-panels" key={index}> {dataCategoriesState[data]}</span>)
                }
            })
        }

        const dateNow = moment(moment.utc(), 'YYYY-MM-DD hh:mm a').tz(searchTimeZone(panels?.timeZone))?.format('YYYYMMDDHHmm')

        const bulTime = ((Number(dateNow) > Number(moment(panels?.startDate, "YYYY-MM-DD hh:mm a")?.subtract(5, 'minute')?.format('YYYYMMDDHHmm'))) === true
            && (Number(dateNow) < Number(moment(panels?.endDate, "YYYY-MM-DD hh:mm a")?.add(1, 'minute')?.format('YYYYMMDDHHmm'))) === true)

        return (
            <div className="content-collapse" key={panels?.id}>
                <p className="title-collapse">{panels?.panelName}</p>
                <div className="content-information">
                    <div className="content-first-information">
                        <button
                            className={"button-add-2"}
                            style={{ marginTop: '-5px', marginBottom: '15px' }}
                            onClick={(e) => {
                                e.preventDefault()
                                if (bulTime) {
                                    if (localStorage.getItem("community") === null) {
                                        setStatePanel({
                                            id: panels?.id,
                                            link: panels?.link,
                                            type: panels?.type
                                        })
                                        setChangeSituation(true)
                                        setBulModal(true)
                                    } else {
                                        if (panels?.type === 'Panels') {
                                            window.open(`${INTERNAL_LINKS.MICRO_CONFERENCE}/${panels?.id}?type=2023`, "_blank");
                                        } else {
                                            window.open(`${panels?.link}`, "_blank");
                                        }
                                    }
                                } else {
                                    setTmeZone(panels?.timeZone)
                                    setStartDate(panels?.startDate)
                                    setBulModalConfirmDetail(true)
                                }
                            }}
                        >JOIN SESSION</button>
                        <p className="p-content">Start Time:
                            <span className="date"> {convertToLocalTime(panels?.startDate, panels?.timeZone).format("MM-DD-YYYY hh:mm a")}</span>
                        </p>
                        <p className="p-content">End Time:
                            <span className="date"> {convertToLocalTime(panels?.endDate, panels?.timeZone).format("MM-DD-YYYY hh:mm a")}</span>
                        </p>
                        <p className="p-content">Timezone:
                            <span className="date2">{moment.tz.guess()}</span>
                        </p>
                        <p className="p-content">Session type:
                            <span className="date">{panels?.type}</span>
                        </p>
                        {(panels.type === "Panels") &&
                            <p className="p-content">Panel Topics: {categories}</p>
                        }
                        {(panels.type === "Simulations") &&
                            <p className="p-content">Simulation Topics: {categories}</p>
                        }
                    </div>

                </div>
            </div>
        )
    }

    const dataIterated = (panels) => (
        <div className="ajust-contain">
            {panels?.SpeakerMemberPanels?.map((user) => {
                return (
                    <MemberSpeakers
                        key={user?.id}
                        usersPanel={user}
                    />
                )
            })}
        </div>
    )

    const dataStatic = (panels) => (
        <p className="container-panel-speaker-parraf" style={{ marginBottom: "40px", fontSize: "18px" }}>
            Description: <span className="not-bold">{panels?.description}</span>
        </p>
    )

    const activeCollapse = (e) => {
        let targetContainer = e?.target?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]
        let targetHeight = e?.target?.parentElement?.parentElement?.parentElement?.children[1]
        let targetContainerHeight = targetContainer?.clientHeight

        targetHeight.style.cssText = `height: ${targetContainerHeight}px;`

        if (e.target.className === "arrow-title") {
            clearTimeout(clockAnimation)
            clockAnimation2 = setTimeout(() => {
                targetHeight.style.cssText = `height: auto;`
            }, 500);
            targetContainer.style.cssText = 'position:relative;'
            e.target.className = "arrow-title-change"
            targetContainer.className = "container-collapse-title"
        } else {
            clockAnimation = setTimeout(() => {
                targetContainer.style.cssText = 'position:absolute;'
            }, 490);
            clearTimeout(clockAnimation2)
            setTimeout(() => {
                targetHeight.style.cssText = `height: 0px;`
            }, 10);
            e.target.className = "arrow-title"
            targetContainer.className = "container-collapse-title-change"
        }
    }

    let myPanelsAgenda = allPanelsOfOneUserFormat?.map((panels, index) => {

        if (maxLength !== undefined) {
            if (maxLength < index + 1) {
                return (<div key={index}></div>)
            }
        }

        let startTime = convertToLocalTime(panels[0]?.startDate, panels[0]?.timeZone)

        return (
            <div key={index} id={index}>
                <p className="title-date">
                    <div className="container-arrow-title">
                        <img src={Arrow} className="arrow-title" alt="arrow-title" onClick={(e) => activeCollapse(e)} />
                    </div>
                    {startTime.format("dddd, MMMM DD")}<sup>{startTime.format("Do").slice(-2)}</sup>
                </p>
                <div className="data-height" style={{ height: "0px" }}>
                    <div className="container-collapse-title-change" style={{ position: "absolute" }}>
                        {panels?.map((panel) => {
                            return (
                                <CollapseComponent
                                    index={panel?.id}
                                    informationCollapse={content(panel)}
                                    buttons={
                                        <ButtonsAgenda
                                            setActiveMessages={setActiveMessages}
                                            panels={panel}
                                            allMySessions={allPanelsOfOneUser}
                                            updateData={updateData}
                                        />
                                    }
                                    className={"container-panel"}
                                    dataIterated={dataIterated(panel)}
                                    dataStatic={dataStatic(panel)}
                                    bulMessage={(panel?.type === "Simulations") ? false : true}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    })

    const panelsAgenda = allPanelSpeakersFormat?.map((panels, index) => {

        if (maxLength !== undefined) {
            if (maxLength < index + 1) {
                return (<div key={index}></div>)
            }
        }

        let startTime = convertToLocalTime(panels[0]?.startDate, panels[0]?.timeZone)

        return (
            <div key={index} id={index}>
                <p className="title-date">
                    <div className="container-arrow-title">
                        <img src={Arrow} className="arrow-title" alt="arrow-title" onClick={(e) => activeCollapse(e)} />
                    </div>
                    {startTime.format("dddd, MMMM DD")}<sup>{startTime.format("Do").slice(-2)}</sup>
                </p>
                <div className="data-height" style={{ height: "0px" }}>
                    <div className="container-collapse-title-change" style={{ position: "absolute" }}>
                        {panels?.map((panel) => {
                            return (
                                <CollapseComponent
                                    index={panel?.id}
                                    informationCollapse={content(panel)}
                                    buttons={
                                        <ButtonsAgenda
                                            setActiveMessages={setActiveMessages}
                                            panels={panel}
                                            allMySessions={allPanelsOfOneUser}
                                            updateData={updateData}
                                        />
                                    }
                                    className={"container-panel"}
                                    dataIterated={dataIterated(panel)}
                                    dataStatic={dataStatic(panel)}
                                    bulMessage={(panel?.type === "Simulations") ? false : true}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    })

    if (userProfile.id === undefined) {
        myPanelsAgenda = (
            <NoItemsMessageCard
                message={`You need to sing up.`}
            />
        )
    }

    return (
        <div className="container-agenda-data">
            {mySessions
                ? myPanelsAgenda
                : panelsAgenda}
            <Modal
                className={clsx("custom-modal")}
                wrapClassName={clsx("custom-modal-wrap")}
                title={
                    <div className="custom-modal-title">
                        <h3>This session has not started yet.</h3>
                        <div className="custom-modal-logo">
                            <img src={IconLogo} alt="custom-logo" />
                        </div>
                        <p style={{ margin: '0px', padding: '40px' }}>It will start on {convertToLocalTime(startDate, timeZone).format("MM-DD-YYYY hh:mm a")}. The session will be open five minutes before the start time mentioned. Thank you!</p>
                    </div>
                }
                centered
                onCancel={() => setBulModalConfirmDetail(false)}
                visible={bulModalConfirmDetail}
                closable={true}
                footer={[]}
                width={"400px"}
                style={{ padding: '20px' }}
                closeIcon={<CloseCircleFilled className="custom-modal-close" />}
            >
                <div className="container-buttons">
                    <CustomButton
                        key="Ok"
                        text="Ok"
                        type="primary"
                        size="xs"
                        className="button-modal"
                        style={{ padding: "0px 10px", marginLeft: "10px" }}
                        onClick={() => { setBulModalConfirmDetail(false) }}
                    />
                </div>
            </Modal>
            <Modal
                visible={bulModal}
                footer={null}
                width={400}
                bodyStyle={{ overflow: "auto", padding: "20px" }}
                className="modal-container-login"
                onCancel={() => {
                    setBulModal(false);
                    if (localStorage.getItem("community") !== null) {
                        setChangeSituation(false);
                    }
                }}
            >
                <Login
                    login={true}
                    signup={false}
                    type={'ladingPague'}
                    history={null}
                    confirm={() => { }}
                    match={{ params: {} }}
                    modal={() => {
                        setBulModal(false);
                        if (localStorage.getItem("community") !== null) {
                            setChangeSituation(false);
                        }
                    }}
                    onClose={() => {
                        setBulModal(false);
                        if (localStorage.getItem("community") !== null) {
                            setChangeSituation(false);
                        }
                    }}
                />
            </Modal>
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    allPanelSpeakers: speakerAllPanelSpeakerSelector(state).allPanelSpeakers,
    allPanelsOfOneUser: speakerAllPanelSpeakerSelector(state).allPanelsOfOneUser,
    allPanelSpeakersFormat: speakerAllPanelSpeakerSelector(state).allPanelSpeakersFormat,
    allPanelsOfOneUserFormat: speakerAllPanelSpeakerSelector(state).allPanelsOfOneUserFormat,
    allCategories: categorySelector(state).categories,
    userProfile: homeSelector(state).userProfile,
    isAuthenticated: authSelector(state).isAuthenticated,
});

const mapDispatchToProps = {
    getAllPanelSpeakers: speaker.getAllPanelSpeakers,
    getAllPanelsOfOneUser: speaker.getAllPanelsOfOneUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AgendaConference2023);