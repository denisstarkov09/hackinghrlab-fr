import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useLocation } from "react-router-dom";

import { CustomDrawer, ChannelForm } from "components";
import { createChannel, updateChannel } from "redux/actions/channel-actions";
import { INTERNAL_LINKS } from "enum";

const ChannelDrawer = ({
  history,
  visible,
  edit,
  onClose,
  createChannel,
  updateChannel,
  onCreated,
  type
}) => {

  const { pathname } = useLocation();

  const fixNameUrl = (name) => {

    
    let newTitle = name
    if(name !== undefined){
      let spaces = name?.split(" ").length - 1
      let spaces2 = name?.split("'").length - 1

      for(let i = 0; i < Number(spaces) ; i++){
        newTitle = newTitle.replace(" ","-")
      }

      for(let i = 0; i < Number(spaces2) ; i++){
        newTitle = newTitle.replace("'","_")
      }
    }

    return newTitle

  }

  const onCreateChannel = (values) => {
    let pathNameFixed = pathname.substring(1,pathname.length)
    if (edit) {
      updateChannel(values, (error) => {
        if (error) {
          notification.error({
            message: "Error",
            description: error,
          });
        } else {
          if(history !== undefined){
            if(values.name !== undefined){
              onCreated(INTERNAL_LINKS.CHANNEL_PAGE + fixNameUrl(values?.name));
              history.push(INTERNAL_LINKS.CHANNEL_PAGE + fixNameUrl(values?.name));
            }else{
              onCreated(INTERNAL_LINKS.CHANNEL_PAGE + fixNameUrl(pathNameFixed));
              history.push(INTERNAL_LINKS.CHANNEL_PAGE + fixNameUrl(pathNameFixed));
            }
          }else{
            onCreated()
          }
        }
      });
    } else {
      createChannel(values, (msg) => {
        if (msg) {
          notification.error({
            message: "Error",
            description: msg,
          });
        } else {
          onCreated();
        }
      });
    }
  };

  return (
    <CustomDrawer
      title={`${edit ? "Edit" : "Create"} Channel`}
      visible={visible}
      onClose={onClose}
    >
      <ChannelForm edit={edit} onSubmit={onCreateChannel} onCancel={onClose} type={type} />
    </CustomDrawer>
  );
};

ChannelDrawer.propTypes = {
  visible: PropTypes.bool,
  edit: PropTypes.bool,
  onClose: PropTypes.func,
  onCreated: PropTypes.func,
};

ChannelDrawer.defaultProps = {
  visible: false,
  edit: false,
  onClose: () => {},
  onCreated: () => {},
};

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {
  createChannel,
  updateChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelDrawer);
