import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal } from "antd";

import {
  // SETTINGS, 
  USER_ROLES,
  //EVENT_TYPES 
} from "enum";

import { useHistory } from "react-router-dom";

import Login from "../Login2";

// import ChannelsFilterPanel from "./ChannelsFilterPanel";
import ChannelCard from "./ChannelCard";
import { homeSelector } from "redux/selectors/homeSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import {
  getFirstChannelList,
  getMoreChannelList,
  setChannel,
} from "redux/actions/channel-actions";
import { getUser } from "redux/actions/home-actions";
import { INTERNAL_LINKS } from "enum";
// import Emitter from "services/emitter";

// import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const CreatorsPague = ({
  allChannels,
  // countOfResults,
  // currentPage,
  // loading,
  userProfile,
  getFirstChannelList,
  // getMoreChannelList,
}) => {

  const [bulModal, setBulModal] = useState(false);
  const [redirect, setRedirect] = useState(false)

  const history = useHistory();

  useEffect(() => {
    getFirstChannelList({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (redirect) {
      setRedirect(false)
      history.push(INTERNAL_LINKS.CHANNELS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect])

  const orderChannels = (allChannels) => {

    const arrayOrderTime = allChannels.sort((a, b) => {

      let aList = (a?.podcast + a?.blogsPostByChannel + a?.channelEvents + a?.librariesResources + a?.librariesVideos)
      let bList = (b?.podcast + b?.blogsPostByChannel + b?.channelEvents + b?.librariesResources + b?.librariesVideos)

      return bList - aList

    })

    return arrayOrderTime

  }

  return (
    <div className="channels-page2">
      <div className="channels-page__container">
        <div className="search-results-container">
          <div className="container-father">
            <div className="channels-list">
              {orderChannels(allChannels).map((chnl) => {
                const isChannelOwner =
                  userProfile &&
                  userProfile.role === USER_ROLES.CHANNEL_ADMIN &&
                  userProfile.channel === chnl.id;

                const isChannelEditor =
                  userProfile &&
                  userProfile.role === USER_ROLES.CHANNEL_CONTENT_EDITOR &&
                  userProfile.channel === chnl.id;

                return (
                  <ChannelCard
                    key={chnl.id}
                    id={chnl.id}
                    title={chnl.name}
                    description={chnl.description}
                    image={chnl.image}
                    categories={chnl.categories}
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor}
                    onClick={() => {
                      if (localStorage.getItem("community") === null) {
                        setBulModal(true)
                      } else {
                        history.push(INTERNAL_LINKS.CHANNELS)
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="container-space"></div>
          <Modal
            visible={bulModal}
            footer={null}
            width={400}
            bodyStyle={{ overflow: "auto", padding: "20px" }}
            className="modal-container-login"
            onCancel={() => setBulModal(false)}
          >
            <Login
              login={true}
              signup={false}
              type={'ladingPague'}
              history={null}
              confirm={() => {
                setTimeout(() => {
                  setRedirect(true)
                }, 100);
              }}
              match={{ params: {} }}
              modal={setBulModal}
              onClose={() => setBulModal(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  ...channelSelector(state),
});

const mapDispatchToProps = {
  getFirstChannelList,
  getMoreChannelList,
  getUser,
  setChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatorsPague);
