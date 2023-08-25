import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar } from "antd";
import { CustomButton } from "components";

import "./style.scss";

const MemberSpeakers = ({
    usersPanel,
    isAdmin,
    remove,
    removeAdmin,
    joinAdmin,
}) => {

    const { id, isModerator, UserId, buttonsAccept, pending} = usersPanel
    const { firstName, img, titleProfessions, lastName, abbrName} = usersPanel?.User

    let bul1 = (pending === true && isAdmin)
    let bul2 = (pending === undefined)
    let bul3 = (pending === false && isAdmin)
    let bul4 = (bul1 || bul2 || bul3)

    return (
      <>
        {bul4 && <div className="container-users" key={id} id={UserId}>
          <div className="container-data-member">
            {img ? (
              <Avatar size={55} src={img} />
            ) : (
              <Avatar size={55} style={{ fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p">
              <p className="p-title">{firstName} {lastName}</p>
              <p className="p-profession">{titleProfessions}{isModerator ? " / Session Moderator" : ""}</p>
            </div>
          </div>
          {(isAdmin && !buttonsAccept) &&
            <CustomButton
              className="button-speaker"
              text="Remove"
              size="sm"
              type="third"
              onClick={() => {removeAdmin()}}
            />
          }
          {(isAdmin && buttonsAccept) && 
            <CustomButton
              className="button-speaker"
              text="Approve"
              size="sm"
              type="secondary"
              onClick={() => {joinAdmin()}}
            />
          }
          {(isAdmin && buttonsAccept) && 
            <CustomButton
              className="button-speaker"
              text="Reject"
              size="sm"
              type="third"
              onClick={() => {remove()}}
            />
          }
        </div>}

        {(pending === true && !isAdmin) && <div className="container-users" key={id} id={UserId} style={{opacity: '60%'}}>
          <div className="container-data-member">
            {img ? (
              <Avatar size={55} src={img} />
            ) : (
              <Avatar size={55} style={{ fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p">
              <p className="p-title">{firstName} {lastName}</p>
              <p className="p-profession">{titleProfessions}{isModerator ? " / Moderator" : ""}</p>
              <p className="p-profession" style={{fontWeight: 'bold'}}>Pending</p>
            </div>
          </div>
        </div>}
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
  