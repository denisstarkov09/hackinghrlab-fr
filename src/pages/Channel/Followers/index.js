import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar } from "antd";

import "./style.scss";

const MemberSpeakers = ({
    followers,
    index,
    type
}) => {

    const { firstName, img, titleProfessions, lastName, abbrName, company} = followers

    return (
      <>
        <div className="container-users" key={index} style={{width: "300px"}}>
          <div className="container-data-member">
            {(img && type !== 'invited') ? (
              <Avatar size={55} src={img} />
            ) : (
              <Avatar size={55} style={type === 'invited' ? { fontSize: "1rem", display: "none" } : { fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p responsive-followers">
              <p className="p-title-conference">{firstName} {lastName}</p>
              <p className="p-profession-conference">{titleProfessions} | {company}</p>
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
    type: PropTypes.string
  };
  
  MemberSpeakers.defaultProps = {
    followers: {},
    index: 0,
    type: ''
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MemberSpeakers);