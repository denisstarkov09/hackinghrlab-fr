import React, {useState} from "react";
import { connect } from "react-redux";
import SpeakersContainer from "./SpeakersContainer";
import { authSelector } from "redux/selectors/authSelector";
import { Link } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";

import "./style.scss";

const Conference2023Speakers = () => {

  const [activeMessages, setActiveMessages] = useState(false)

  return (
    <>
      <div className="container-conference" style={{ marginTop: "90px"}}>
        <div className="imagen-speakers">
          <div className="container-content-picture-speakers">
            <p className="title-containers">Speakers</p> 
          </div>
        </div>
        <div className="containers-speakers" id="speakers"> 
          <SpeakersContainer className={"container-users"} setActiveMessages={setActiveMessages} type={"conference"}/>
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
    isAuthenticated: authSelector(state).isAuthenticated
  });
  
  const mapDispatchToProps = {

  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Conference2023Speakers);