import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { setLoading } from "redux/actions/home-actions";
import { getEvent } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { certificateSelector } from "redux/selectors/certificateSelector"
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";
import moment from "moment";
import html2canvas from "html2canvas";

import CertificateLearning from "./CertificateLearning";
import CertificateProjectX from "./CertificateProjectX";

import { 
    getCertificate
} from "redux/actions/certificate-ations";
import { 
    getSkillCohort
 } from "redux/actions/skillCohort-actions";
import { INTERNAL_LINKS } from "enum";
import { Avatar } from "antd";
import {
    CustomButton,
 } from "components";

import IconBack from "images/icon-back.svg";

import "./style.scss";


const CertificatePage = ({
    history,
    getCertificate,
    getEvent,
    event,
    certificate,
    userCertificate,
    skillCohort,
    getSkillCohort,
    user
}) => {
    const containerCertificate = useRef(null)
    const [loading2, setLoading2] = useState(false);
    const [certificateSelectState, setCertificateSelectState] = useState(undefined)
    const win = window.location.pathname

    useEffect(() => {
        let code = win.substring(8,win.length)
        getCertificate(code, (err) => {
            if(err){
                history.push(INTERNAL_LINKS.NOT_FOUND);
            }
        })

    },[win, getCertificate, history])

    useEffect(() => {
        if(certificate?.type === 'learning'){
            getEvent(certificate?.idTypeCertificate);
        }
        if(certificate?.type === 'skillCohort'){
            getSkillCohort(certificate?.idTypeCertificate)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[certificate])

    const calcDuration = (data) => {
        let duration = 0 
    
        if(data !== undefined){
            data.forEach((date) => {
            duration = (date !== null)
            ? duration + moment(date?.endTime,'YYYY-MM-DDTHH:mm:ssZ').diff(date?.startTime, 'hours')
            : duration
            })
        }
    
        return duration
    }

    const certificateSelect = () => {
        if(event.id !== undefined){
            if(certificate.type === 'learning'){
                return(
                    <CertificateLearning
                        event={event}
                        userCertificate={userCertificate}
                        father={containerCertificate}
                        calcDuration={calcDuration}
                        functionCargCertificate={(data) => setCertificateSelectState(data)}
                    />
                )
            }
        }
        if(skillCohort.id !== undefined){
            if(certificate.type === 'skillCohort'){
                return(
                    <CertificateProjectX 
                        skillCohort={skillCohort}
                        userCertificate={userCertificate}
                        father={containerCertificate}
                        functionCargCertificate={(data) => setCertificateSelectState(data)}
                    />
                )
            }
        }
    }

    const durationType = () => {
        if(certificate.type === 'learning'){
            return <p className="p-duration">Duration: {calcDuration(event?.startAndEndTimes)} Hours</p>
        }
        if(certificate.type === 'skillCohort'){
            return <p className="p-duration">Date: 
                {`${moment(skillCohort?.startDate,"YYYY-MM-DDTHH:mm:ss").format("ll")} 
                - ${moment(skillCohort?.endDate,"YYYY-MM-DDTHH:mm:ss").format("ll")}`}
            </p>
        }
    }

    const titleType = () => {
        if(certificate.type === 'learning'){
            return event?.title
        }
        if(certificate.type === 'skillCohort'){
            return skillCohort?.title
        }
    }

    const downloadCertificate = async () => {
        if(certificateSelectState !== undefined){
            setLoading2(true);
            const domElement = certificateSelectState.current;
            const canvas = await html2canvas(domElement, {
                scale: 4,
            });
        
            let a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `${titleType()} - ${userCertificate?.firstName} ${userCertificate?.lastName} Certificate.png`;
            a.click();
            setLoading2(false);
        }
    }

  return (
    <div className="container-verify-centificate">
        {localStorage.getItem("community") !== null && 
          <Link to={INTERNAL_LINKS.MY_LEARNINGS} >
            <div className="verify-page__content-top">
              <div className="verify-page__content-top-back">
                <img src={IconBack} alt="icon-back" />
              </div>
              <h4>Back to My Learning</h4>
            </div>
          </Link>
        }
        <div className="box-title-verify-certificate">
            <p className="course-certificate-p">Course Certificate</p>
            <p className="name-course">{titleType()}</p>
        </div>
        <div className="container-profile-certificate">
            <div className="container-user">
                <div className="container-data-member-certificate">
                    {userCertificate?.img !== undefined ? (
                        <Avatar size={150} src={userCertificate?.img} />
                    ) : (
                        <Avatar size={150} style={{fontSize: "4rem" }}>
                            {userCertificate?.abbrName}
                        </Avatar>
                    )}
                    <div className="container-p-certficate">
                        <p className="p-title-conference">Completed by <b>{userCertificate?.firstName} {userCertificate?.lastName}</b></p>
                        {durationType()}
                    </div>
                </div>
            </div>
            <div className="container-certificate" >
                <div ref={containerCertificate}></div>
                {certificateSelect()}
                {(user?.id === userCertificate?.id) && <CustomButton 
                    type="primary" 
                    size="sm"
                    text="Download Certificate"
                    style={{
                        position: "absolute",
                        left: '50%',
                        top: 'calc(100% + 20px)',
                        transform: "translateX(-50%)"
                    }}
                    onClick={() => downloadCertificate()}
                    loading={loading2}
                />}
            </div>
        </div>
    </div>
  );
};

CertificatePage.propTypes = {
  title: PropTypes.string,
};

CertificatePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
  event: eventSelector(state).updatedEvent,
  certificate: certificateSelector(state).certificate,
  userCertificate: certificateSelector(state).userCertificate,
  skillCohort: skillCohortSelector(state).skillCohort,
});

const mapDispatchToProps = {
    getCertificate,
    setLoading,
    getEvent,
    getSkillCohort
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificatePage);