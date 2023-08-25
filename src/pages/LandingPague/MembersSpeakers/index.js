import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar } from "antd";

import "./style.scss";

const MemberSpeakers = ({
    usersPanel,
}) => {

    const { firstName, img, titleProfessions, lastName, abbrName,id} = usersPanel

    return (
      <>
        <div className="container-users-2-2" key={id}>
          <div className="container-data-member-2">
            {img ? (
              <Avatar size={95} src={img} />
            ) : (
              <Avatar size={95} style={{ fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p-2">
              {/* {isModerator && <p className="p-profession-conference-2">Session Moderator</p>} */}
              <p className="p-title-conference-2">{firstName} {lastName}</p>
              <p className="p-profession-conference-2-2">{titleProfessions}</p>
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
    usersPanel: PropTypes.object,
    isAdmin: PropTypes.bool,
    remove: PropTypes.func,
  };
  
  MemberSpeakers.defaultProps = {
    usersPanel: {},
    isAdmin: false,
    remove: () => {},
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MemberSpeakers);
  