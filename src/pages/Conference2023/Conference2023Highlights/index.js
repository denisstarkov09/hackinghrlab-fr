import React, { useEffect } from "react";
import { connect } from "react-redux";
import { speakerAllPanelSpeakerSelector } from "redux/selectors/speakerSelector";
import { Link } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import { getAllParafs } from "redux/actions/speaker-actions";

import "./style.scss";

const Conference2023Home = ({
  getAllParafs,
  allParrafs
}) => {

  useEffect(() => {
    getAllParafs("Highlights")
  }, [getAllParafs])

  return (
    <>
      <div className="container-conference" style={{marginTop: "90px"}}>
        <div className="imagen-conference">
          <div className="container-content-picture">
            <p className="parrafo-hachinglab-picture">Hacking HR Presents</p>
            <p className="title-hachinglab-picture1">2023 Global Conference</p>
            <p className="title-hachinglab-picture2"><span className="span-color">FORWARD2023</span></p>
            <p className="date-picture">March 6-9, 2023 | Virtual</p>
          </div>
        </div>
        <div className="container-parraf">
          {allParrafs.map((parraf) => {
            return (
              <div dangerouslySetInnerHTML={{ __html: parraf.text }} ></div>
            )
          })}
        </div>
        <div className="container-why-to-attend">
          <p className="title-why-to-attend">Why to Attend</p>
          <div className="container-cards">
            <div className="cards-attend">
              <div className="img-attend1"></div>
              <p className="title-attend">networking</p>
              <p className="p-attend">We built in the agenda of the conference numerous opportunities for you to connect with HR leaders and professionals from all over the world and expand your network!</p>
            </div>
            <div className="cards-attend top-attend">
              <div className="img-attend2"></div>
              <p className="title-attend">thought leadership</p>
              <p className="p-attend">We are bringing the most talented, world-class global leaders to share their ideas, insights, stories, data, experiences with you. We have more than 500 global influencers coming to speak at the conference!</p>
            </div>
            <div className="cards-attend top-attend">
              <div className="img-attend3"></div>
              <p className="title-attend">Learning</p>
              <p className="p-attend">You will walk away with information, knowledge and ideas that will be critical for your work in HR. This conference is, after all, a remarkable learning experience with more than 100 sessions!</p>
            </div>
            <div className="cards-attend top-attend">
              <div className="img-attend4"></div>
              <p className="title-attend">Collaboration</p>
              <p className="p-attend">This event will provide you opportunities to collaborate with like-minded professionals. There are sessions specifically designed to promote collaboration and cooperation.</p>
            </div>
          </div>
        </div>
        <div className="container-publicity">
          <p className="p-publicity">{'Past Conferences & Resources'}</p>
          <div className="container-data">
            <Link style={{textDecoration: "none", width: "100%", height: "100%"}} to={INTERNAL_LINKS.CONFERENCE_LIBRARY} target="_blank">
              <div className="picture-video">
                <div className="play-picture"></div>
                <div className="gradient-picture"></div>
                <p className="p-picture-publicity">Past Conferences: 2020 and 2021</p>
              </div>
            </Link>
          </div>
        </div>
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
    allParrafs: speakerAllPanelSpeakerSelector(state).allParrafs
  });
  
  const mapDispatchToProps = {
    getAllParafs,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Conference2023Home);