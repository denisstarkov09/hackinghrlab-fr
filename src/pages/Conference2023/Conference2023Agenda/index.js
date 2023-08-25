import React, { useState } from "react";
import { connect } from "react-redux";
import Agenda from "./Agenda";
import { Link } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import "./style.scss";

const Conference2023Agenda = () => {

  const [bulSession, setBulSession] = useState(false)
  const [activeMessages, setActiveMessages] = useState(false)

  return (
    <>
      <div className="container-conference-agenda">
        <div className="imagen-agenda">
          <div className="container-content-picture-agenda">
            <p className="title-containers">Conference Schedule</p>  
          </div>
        </div>
        <div className="containers-agenda" id="agenda">
          <div  className="container-sessions-agenda">
            <p 
              className="p1-agenda" 
              onClick={() => setBulSession(false)}
              style={!bulSession ? {textDecoration: "underline"} : {}}
            >Full Conference Shedule</p>
            <div></div>
            <p 
              className="p2-agenda" 
              onClick={() => setBulSession(true)}
              style={bulSession ? {textDecoration: "underline"} : {}}
            >My Sessions</p>
          </div>
          {!bulSession
          ? <Agenda setActiveMessages={setActiveMessages} />  
          : <Agenda mySessions={true} setActiveMessages={setActiveMessages} />}
        </div>
        {activeMessages &&
          <div className="container-messages-general">
              <div className="messages">No Authorization was found, please Register.</div>
          </div>
        }
        <div className="footer-home">
          <div className="logo-footer"></div>
          <div className="container-link-footer">
            <Link to={INTERNAL_LINKS.CONFERENCE_2023}>
              <p className="p-link-footer" style={{marginRight: "50px"}}>Home</p>
            </Link>
            <Link to={INTERNAL_LINKS.CONFERENCE_2023 + "/highlights"}>
              <p className="p-link-footer" style={{marginRight: "50px"}}>Conference Highlights</p>
            </Link>
            <Link to={INTERNAL_LINKS.CONFERENCE_2023 + "/speakers"}>
              <p className="p-link-footer" style={{marginRight: "50px"}}>Speakers</p>
            </Link>
            <Link to={INTERNAL_LINKS.CONFERENCE_2023 + "/agenda"}>
              <p className="p-link-footer" >Agenda</p>
            </Link>
          </div>
          <p className="reserved">© 2022 All Rights Reserved</p>
        </div>
      </div>
    </>
  );
  };
  
  const mapStateToProps = (state, props) => ({
  });
  
  const mapDispatchToProps = {
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Conference2023Agenda);