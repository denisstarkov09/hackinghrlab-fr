import React from "react";
import { connect } from "react-redux";
import { CircularProgressbar } from "components";
import { Alert } from "antd";
import { updateUser } from "redux/actions/home-actions";
import ProfileEditPanel from "containers/ProfileDrawer/ProfileEditPanel";
import { TIMEZONE_LIST, COUNTRIES, INTERNAL_LINKS } from "enum";

import "./style.scss";

const ModalCompleteProfile = ({
  updateUser,
  userProfile,
  get,
  onCancel,
  setBulKnowRegister,
  setBulCompleteProfile
}) => {

    const timezone = (
        TIMEZONE_LIST.find((item) => item.value === userProfile.timezone) || {}
      ).text;
      const location = (
        COUNTRIES.find((item) => item.value === userProfile.location) || {}
      ).text;

    const onSave = (userInfo) => {
        if(window.location.pathname.substring(0,13) !== INTERNAL_LINKS.SPEAKER_2023){
            setBulKnowRegister(true)
        }
        updateUser(userInfo);
        get()
        setBulCompleteProfile(false)
    };

    return (
        <div className="ModalContainer">
            <h1 className="title-complete-profile" >Hi! You must to complete your profile.</h1>
            <CircularProgressbar
                percent={userProfile ? userProfile.percentOfCompletion : 0}
                color="#fe5621"
                style={{width:"100%", marginBottom: "50px"}}
            />
            <Alert
                style={{marginTop: "20px"}}
                message={
                <>
                    <strong>Missing information:</strong>
                    <ul className="inline-comma" style={{display: "flex", flexDirection: "column"}}>
                    {!userProfile.img ? <li>Profile Picture</li> : null}
                    {!userProfile.firstName ? <li>First name</li> : null}
                    {!userProfile.lastName ? <li>Last name</li> : null}
                    {!userProfile.titleProfessions ? <li>Title</li> : null}
                    {!userProfile.company ? <li>Company</li> : null}
                    {!location ? <li>Location</li> : null}
                    {!userProfile.city ? <li>City</li> : null}
                    {!timezone ? <li>Time zone</li> : null}
                    {!userProfile.languages ? (
                        <li>Main language</li>
                    ) : Object.keys(userProfile.languages).length === 0 ? (
                        <li>Main languages</li>
                    ) : null}
                    {!userProfile.about ? <li>Tell us more about you</li> : null}
                    {userProfile.topicsOfInterest ? (
                        Object.keys(userProfile.topicsOfInterest).length === 0 ? (
                        <li>Topics of interest</li>
                        ) : null
                    ) : (
                        <li>Topics of interest</li>
                    )}
                    {userProfile.personalLinks ? (
                        !userProfile.personalLinks.hasOwnProperty("linkedin") ? (
                        <li>Personal links</li>
                        ) : userProfile.personalLinks.linkedin.toString().trim() === "" ||
                        userProfile.personalLinks.linkedin.toString().trim() ===
                            "https://" ? (
                        <li>Personal links</li>
                        ) : null
                    ) : null}
                    {userProfile.isOpenReceivingEmail === -1 ? (
                        <li>
                        Are open to receiving information/being contacted via email
                        about open job positions?
                        </li>
                    ) : null}
                    {!userProfile.recentJobLevel ? (
                        <li>
                        What best defines your current or most recent job level?
                        </li>
                    ) : null}
                    {Array.isArray(userProfile.recentWorkArea) ? (
                        userProfile.recentWorkArea.length === 0 ? (
                        <li>
                            In what area of HR do you currently work or most recently
                            worked?
                        </li>
                        ) : null
                    ) : null}
                    {!userProfile.sizeOfOrganization ? (
                        <li>What is the size of the organization your work for?</li>
                    ) : null}
                    </ul>
                </>
                }
                type="error"
            />
            <div className="contenedor-profile-edit">
                <ProfileEditPanel
                    user={userProfile}
                    onSave={(userInfo) => {onSave(userInfo)}}
                    bulModal={true}
                    onCancel={() => onCancel(false)}
                />
            </div>
        </div>
    );
  };
  
  const mapStateToProps = (state, props) => ({
    
  });
  
  const mapDispatchToProps = {
    updateUser,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ModalCompleteProfile);