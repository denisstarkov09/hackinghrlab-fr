import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { actions as speaker } from "redux/actions/speaker-actions";
import { CustomButton } from "components";
import { CloseCircleFilled } from "@ant-design/icons";
import { homeSelector } from "redux/selectors/homeSelector";
import { Dropdown, Menu, Space, Modal, notification } from "antd"
import { DownOutlined } from "@ant-design/icons";
import { convertToLocalTime } from "utils/format";
import IconLogo from "images/logo-sidebar.svg";
import moment from "moment";
import clsx from "clsx";

import "./style.scss";

const ButtonsAgenda = ({
    addedToPersonalAgenda,
    userProfile,
    panels,
    setActiveMessages,
    allMySessions,
    updateData
}) => {

    const { usersAddedToThisAgenda, id, panelName, description, startDate, endDate, timeZone, type } = panels

    const [bulAddedToMyAgenda, setBulAddedToMyAgenda] = useState(false)
    const [toMyPersonalAgenda, setToMyPersonalAgenda] = useState(false)

    const convertedStartTime = convertToLocalTime(
        startDate,
        timeZone
    );

    const convertedEndTime = convertToLocalTime(
        endDate,
        timeZone
    );

    const functionAddedToMyAgenda = () => {

        const data = {
            PanelId: id,
            startTime: startDate,
            endTime: endDate,
            panelType: type,
            type: "Added",
        }

        if (userProfile.registerConference2023) {

            if (type === "Panels") {
                addedToPersonalAgenda(data, () => {
                    setBulAddedToMyAgenda(true)
                    updateData()
                })
            } else {

                let arrayVerificacionSessions = []

                for (let i = 0; i < allMySessions.length; i++) {

                    if (allMySessions[i].type !== "Panels") {

                        const startDateCompare = convertToLocalTime(
                            allMySessions[i].startDate,
                            allMySessions[i].timeZone
                        )

                        const endDateCompare = convertToLocalTime(
                            allMySessions[i].endDate,
                            allMySessions[i].timeZone
                        )

                        if (moment(startDateCompare, 'YYYY-MM-DD hh:mm a').isBefore(moment(convertedStartTime, 'YYYY-MM-DD hh:mm a'), 'minute') === true && moment(endDateCompare, 'YYYY-MM-DD hh:mm a').isAfter(moment(convertedStartTime, 'YYYY-MM-DD hh:mm a'), 'minute') === true) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                        if (moment(startDateCompare, 'YYYY-MM-DD hh:mm a').isBefore(moment(convertedEndTime, 'YYYY-MM-DD hh:mm a'), 'minute') === true && moment(endDateCompare, 'YYYY-MM-DD hh:mm a').isAfter(moment(convertedEndTime, 'YYYY-MM-DD hh:mm a'), 'minute') === true) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                        if (moment(convertedStartTime, 'YYYY-MM-DD hh:mm a').isBefore(moment(startDateCompare, 'YYYY-MM-DD hh:mm a'), 'minute') === true && moment(convertedEndTime, 'YYYY-MM-DD hh:mm a').isAfter(moment(startDateCompare, 'YYYY-MM-DD hh:mm a'), 'minute') === true) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                        if (moment(convertedStartTime, 'YYYY-MM-DD hh:mm a').isBefore(moment(endDateCompare, 'YYYY-MM-DD hh:mm a'), 'minute') === true && moment(convertedEndTime, 'YYYY-MM-DD hh:mm a').isAfter(moment(endDateCompare, 'YYYY-MM-DD hh:mm a'), 'minute') === true) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                        if (moment(startDateCompare, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD hh:mm a') === moment(convertedStartTime, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD hh:mm a')) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                        if (moment(endDateCompare, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD hh:mm a') === moment(convertedEndTime, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD hh:mm a')) {
                            arrayVerificacionSessions.push(allMySessions[i])
                        }
                    }
                }

                if (arrayVerificacionSessions.length === 0) {
                    addedToPersonalAgenda(data, () => {
                        updateData()
                        setBulAddedToMyAgenda(true)
                    })
                } else {
                    notification.error({
                        message: "ERROR:",
                        description: "You already registered for a session on this same date and same time, You can't register for two sessions on the same date and same time.",
                    });
                }

            }


        } else {
            setActiveMessages(true)
            setTimeout(() => {
                setActiveMessages(false)
            }, 2000);
        }
    }

    const functionRemoveToMyAgenda = (data) => {
        addedToPersonalAgenda(data, () => {
            updateData()
        })
    }

    const downloadDropdownOptions = () => (
        <Menu style={{ position: "relative", bottom: "70px" }}>
            <Menu.Item key="1">
                <a href="/#" onClick={(e) => onClickDownloadCalendar(e)}>
                    Download ICS File
                </a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="/#" onClick={(e) => onClickAddGoogleCalendar(e)}>
                    Add to Google Calendar
                </a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="/#" onClick={(e) => onClickAddYahooCalendar(e)}>
                    Add to Yahoo Calendar
                </a>
            </Menu.Item>
        </Menu>
    );

    const userTimezone = moment.tz.guess();

    const onClickDownloadCalendar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(
            `${process.env.REACT_APP_API_ENDPOINT}/public/speakers/ics/${id}?userTimezone=${userTimezone}`,
            "_blank"
        );
    };

    const onClickAddGoogleCalendar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
            panelName
        )}&dates=${convertedStartTime.format("YYYYMMDDTHHmmss")}/${convertedEndTime.format("YYYYMMDDTHHmmss")}&details=${encodeURIComponent(
            description
        )}&location=https://www.hackinghrlab.io/global-conference&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
        window.open(googleCalendarUrl, "_blank");
    };

    const onClickAddYahooCalendar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${convertedStartTime.format("YYYYMMDDTHHmmss")}&et=${convertedEndTime.format("YYYYMMDDTHHmmss")}&title=${encodeURIComponent(
            panelName
        )}&desc=${encodeURIComponent(
            description
        )}&in_loc=https://www.hackinghrlab.io/global-conference`;
        window.open(yahooCalendarUrl, "_blank");
    };

    useEffect(() => {
        if (userProfile.id !== undefined) {
            setBulAddedToMyAgenda(false)
            for (let i = 0; i < usersAddedToThisAgenda.length; i++) {
                if (Number(usersAddedToThisAgenda[i]) === Number(userProfile.id)) {
                    setBulAddedToMyAgenda(true)
                }
            }
        }
    }, [userProfile, setBulAddedToMyAgenda, usersAddedToThisAgenda])

    return (
        <>
            <button
                className={bulAddedToMyAgenda ? "button-added" : "button-add"}
                onClick={(e) => {
                    e.preventDefault()
                    if (bulAddedToMyAgenda) {
                        functionRemoveToMyAgenda({
                            PanelId: id,
                            type: "Remove"
                        })
                        setBulAddedToMyAgenda(false)
                    } else {
                        setToMyPersonalAgenda(true)
                    }
                }}
            >
                {bulAddedToMyAgenda ? `ADDED TO MY PERSONAL AGENDA` : `ADD TO MY PERSONAL AGENDA`}
            </button>
            {bulAddedToMyAgenda &&
                <div style={{ position: 'relative' }}>
                    <button
                        className="button-download"
                        style={{ marginTop: '10px' }}
                        onClick={(e) => { e.preventDefault() }}
                    >
                        DOWNLOAD CALENDAR REMINDER
                    </button>
                    <Dropdown overlay={downloadDropdownOptions}>
                        <a
                            href="/#"
                            style={{ position: "absolute", width: "100%", top: "10px", left: "0px", opacity: "0%", height: "35px", zIndex: "1000" }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Space>
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            }
            <div style={{ height: "10px", width: "200px" }}></div>
            <Modal
                className={clsx("custom-modal")}
                wrapClassName={clsx("custom-modal-wrap")}
                title={
                    <div className="custom-modal-title">
                        <h3>Are you sure?</h3>
                        <div className="custom-modal-logo">
                            <img src={IconLogo} alt="custom-logo" />
                        </div>
                    </div>
                }
                centered
                onCancel={() => setToMyPersonalAgenda(false)}
                visible={toMyPersonalAgenda}
                closable={true}
                footer={[]}
                width={"300px"}
                closeIcon={<CloseCircleFilled className="custom-modal-close" />}
            >
                <div className="container-buttons">
                    <CustomButton
                        key="Cancel"
                        text="Cancel"
                        type="primary outlined"
                        size="xs"
                        className="button-modal"
                        style={{ padding: "0px 10px" }}
                        onClick={() => setToMyPersonalAgenda(false)}
                    />
                    <CustomButton
                        key="Confirm"
                        text="Confirm"
                        type="primary"
                        size="xs"
                        className="button-modal"
                        style={{ padding: "0px 10px", marginLeft: "10px" }}
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
    addedToPersonalAgenda: speaker.addedToPersonalAgenda
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsAgenda);