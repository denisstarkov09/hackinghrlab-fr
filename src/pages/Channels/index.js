import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";

// import { CustomButton } from "components";
import { 
  // SETTINGS, 
  USER_ROLES, 
  //EVENT_TYPES 
} from "enum";
import ChannelDrawer from "containers/ChannelDrawer";

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
import FilterDrawer from "./FilterDrawer";

import { numberWithCommas } from "utils/format";
// import Emitter from "services/emitter";

// import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const Channels = ({
  allChannels,
  countOfResults,
  // currentPage,
  // loading,
  userProfile,
  getFirstChannelList,
  // getMoreChannelList,
  getUser,
  setChannel,
}) => {
  const [openCannelDrawer, setOpenChannelDrawer] = useState(false);
  const [type, setType] = useState(undefined)
  const [filters, setFilters] = useState({});
  const [editMode, setEditMode] = useState(false);

  const onFilterChange = (filter) => {
    setFilters(filter);
    getFirstChannelList({ filter });
  };

  const onCreateChannel = () => {
    setEditMode(false);
    setOpenChannelDrawer(true);
  };

  const onChannelCreated = () => {
    setOpenChannelDrawer(false);
    getUser();
    console.log(filters)
    getFirstChannelList({ filter: filters });
  };

  // const onShowMore = () => {
  //   getMoreChannelList({
  //     page: currentPage + 1,
  //     filter: filters,
  //   });
  // };

  // const showFilterPanel = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_CHANNELS_FILTER_PANEL);
  // };

  const handleChannel = (menu, channel, type) => {
    switch (menu) {
      case "edit":
        setEditMode(true);
        setOpenChannelDrawer(true);
        setChannel(channel);
        setType(type)
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getFirstChannelList({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderChannels = (allChannels) => {

    const arrayOrderTime = allChannels.sort((a,b) => {

      let aList = (a?.podcast + a?.blogsPostByChannel + a?.channelEvents + a?.librariesResources + a?.librariesVideos)
      let bList = (b?.podcast + b?.blogsPostByChannel + b?.channelEvents + b?.librariesResources + b?.librariesVideos)

      return bList - aList

    })

    return arrayOrderTime

  }

  return (
    <div className="channels-page">
      {/* <ChannelsFilterPanel onChange={onFilterChange} /> */}
      <FilterDrawer onChange={onFilterChange} />
      <ChannelDrawer
        visible={openCannelDrawer}
        edit={editMode}
        onClose={() => setOpenChannelDrawer(false)}
        onCreated={onChannelCreated}
        type={type}
      />
      <div className="channels-page__container">
        <div className="search-results-container">
          <Row>
            <Col span={24}>
              <div className="search-results-container-mobile-header">
                {/* <h3 className="filters-btn" onClick={() => showFilterPanel()}>
                  Filters
                </h3> */}
                <h3>
                  {allChannels.length} result
                  {allChannels.length > 1 ? "s" : ""}
                </h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="search-results-container-header d-flex justify-between items-center">
                <h3>{`${numberWithCommas(countOfResults)} result${
                  countOfResults > 1 ? "s" : ""
                }`}</h3>
              </div>
            </Col>
          </Row>
          <div className="channels-list">
            {userProfile.role === USER_ROLES.CHANNEL_ADMIN &&
              !userProfile.channel && (
                <ChannelCard add={true} onClick={onCreateChannel} />
              )}
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
                  onMenuClick={(menu, type) => {
                    handleChannel(menu, chnl, type)
                  }}
                />
              );
            })}
          </div>
          {/* {currentPage * SETTINGS.MAX_SEARCH_ROW_NUM < countOfResults && (
            <div className="search-results-container-footer d-flex justify-center items-center">
              {loading && (
                <div className="channels-page-loading-more">
                  <img src={IconLoadingMore} alt="loading-more-img" />
                </div>
              )}
              {!loading && (
                <CustomButton
                  text="Show more"
                  type="primary outlined"
                  size="lg"
                  onClick={onShowMore}
                />
              )}
            </div>
          )} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
