import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, notification } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import moment from "moment";

import "./style.scss";

const MemberSpeakers = ({
    followers,
    index,
    arrayId,
    setArrayId,
    invitationsSends,
    userFollowed
}) => {

    const { firstName, img, titleProfessions, company , lastName, abbrName, id, countEmailsSend, dateRenewInvitationEmail} = followers

    const [bulBox, setBulBox] = useState(false)
    const [bulFollower, setBulFollower] = useState(false)
    const [bulLimitInvits, setBulLimitInvits] = useState(false)

    let dateToday = moment().tz("America/Los_Angeles")

    const selectFunction = () => {
      let bul = bulFollower || bulLimitInvits
      if((Number(arrayId.length) + Number(invitationsSends)) < 50 && !bul){
        if(!bulBox){
            setArrayId([
                ...arrayId,
                followers
            ])
        }else{
            setArrayId(arrayId.filter((idI) => idI.id !== id))
        }
        
        setBulBox(!bulBox)
      }else{
        if(bulFollower){
          notification.error({
            message: "Already following",
          });
        }else if(bulLimitInvits){
          notification.error({
            message: "Pending to accept",
          });
        }else if((Number(arrayId.length) + Number(invitationsSends))){
          notification.error({
            message: "Sorry, you don't have more invitations for this month",
          });
        }
      }
    }

    useEffect(() => {
        if(arrayId.filter((idI) => idI.id === id)[0] !== undefined){
            setBulBox(true)
        }
        if(arrayId.filter((idI) => idI.id === id)[0] === undefined){
            setBulBox(false)
        }
        if(userFollowed.filter((idI) => idI.id === id)[0] !== undefined){
          setBulFollower(true)
        }
        if(userFollowed.filter((idI) => idI.id === id)[0] === undefined){
          setBulFollower(false)
        }
        if(countEmailsSend < 2 || moment(dateToday,'YYYY-MM-DD hh:mm a').isBefore(moment(dateRenewInvitationEmail,'YYYY-MM-DD hh:mm a'), 'minute') === false || dateRenewInvitationEmail === ''){
          setBulLimitInvits(false)
        }
        if(countEmailsSend >= 2 || moment(dateToday,'YYYY-MM-DD hh:mm a').isBefore(moment(dateRenewInvitationEmail,'YYYY-MM-DD hh:mm a'), 'minute') !== false){
          setBulLimitInvits(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    useEffect(() => {
        if(arrayId.filter((idI) => idI.id === id)[0] !== undefined){
            setBulBox(true)
        }
        if(arrayId.filter((idI) => idI.id === id)[0] === undefined){
            setBulBox(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[arrayId])

    useEffect(() => {
      if(userFollowed.filter((idI) => idI.id === id)[0] !== undefined){
        setBulFollower(true)
      }
      if(userFollowed.filter((idI) => idI.id === id)[0] === undefined){
        setBulFollower(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userFollowed])
    
    const swiftTag = () => {
      if(bulFollower){
        return (<p className="tag-ready-follow">| Already following</p>)
      }else{
        if(bulLimitInvits){
          return (<p className="tag-limit-follow">| Pending to accept</p>)
        }
        if(!bulLimitInvits){
          return (<p></p>)
        }
      }
    }

    return (
      <>
        <div className="container-users-invit" key={index}>
          <div className="container-data-member-invit">
            <div className="box-select" onClick={() => {selectFunction()}}>
                <div className="box-inner-select" style={bulBox ? {opacity: "100%"} : {opacity: "0%"}}>
                    <CheckOutlined />
                </div>
            </div>
            {img ? (
              <Avatar size={55} src={img} />
            ) : (
              <Avatar size={55} style={{ fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p-invit">
              <div className="container-name-invit-people">
                <p className="p-title-conference-invit">{firstName} {lastName}</p>
                {swiftTag()}
              </div>
              <p className="p-profession-conference-invit">{titleProfessions} | {company}</p>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const mapStateToProps = (state, props) => ({

  });
  
  const mapDispatchToProps = {

  };

  MemberSpeakers.propTypes = {
    followers: PropTypes.object,
    index: PropTypes.number,
    arrayId: PropTypes.array,
    setArrayId: PropTypes.func,
    invitationsSends: PropTypes.number
  };
  
  MemberSpeakers.defaultProps = {
    followers: {},
    index: 0,
    arrayId: [],
    invitationsSends: 0,
    setArrayId: () => {}
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MemberSpeakers);