import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notification } from "antd";

import NoItemsMessageCard from "components/NoItemsMessageCard";
import { EpisodeCard, CustomButton } from "components";
import PodcastDrawer from "containers/PodcastDrawer";
import { CARD_TYPE, SETTINGS } from "enum";
import getPodcastLinks from "utils/getPodcastLinks.js";

import {
  getFirstChannelPodcastList,
  getMoreChannelPodcastList,
  deleteChannelPodcast,
} from "redux/actions/podcast-actions";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { channelSelector } from "redux/selectors/channelSelector";

import IconLoadingMore from "images/icon-loading-more.gif";

const PodcastsList = ({
  podcasts,
  isOwner,
  isEditor,
  loading,
  total,
  page,
  filter,
  channel,
  getFirstChannelPodcastList,
  getMoreChannelPodcastList,
  deleteChannelPodcast,
  limit,
  buttomEdit
}) => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [podcast, setPodcast] = useState({});

  const onShowPodcastModal = () => {
    setEditMode(false);
    setVisibleDrawer(true);
  };

  const getFirstBunchOfResources = () => {
    if (channel && channel.id) {
      getFirstChannelPodcastList({ ...filter, channel: channel.id });
    }
  };

  const onShowMore = () => {
    getMoreChannelPodcastList({
      ...filter,
      channel: channel.id,
      page: page + 1,
    });
  };

  const handlePodcast = (menu, episode) => {
    switch (menu) {
      case "edit":
        setEditMode(true);
        setPodcast(episode);
        setVisibleDrawer(true);
        break;
      case "delete":
        deleteChannelPodcast(episode, (err) => {
          if (err) {
            notification.error({
              message: err,
            });
          } else {
            notification.info({
              message: "Podcast was successfully deleted.",
            });
            getFirstBunchOfResources();
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getFirstBunchOfResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, filter]);

  return (
    <div className="channel-page__list-wrap">
      <PodcastDrawer
        visible={visibleDrawer}
        edit={editMode}
        podcast={podcast}
        onAdded={() => {
          setVisibleDrawer(false);
          getFirstBunchOfResources();
        }}
        onClose={() => setVisibleDrawer(false)}
      />
      {!isOwner && !isEditor && podcasts.length === 0 ? (
        <NoItemsMessageCard
          message={"There are no podcasts for you at the moment"}
        />
      ) : (
        <>
          <div className="channels__list">
            {(isOwner || isEditor) && (
              <CustomButton
                text="Add Podcasts"
                htmlType="submit"
                size="sm"
                type="primary"
                className={(buttomEdit === 'home') ? "buttomAddRR" : "buttomAddR"}
                style={(buttomEdit === 'home') ? { left: "130px" } : { left: '200px' }}
                onClick={() => onShowPodcastModal()}
              />
            )}
            {podcasts.map((episode, index) => {
              if (limit > index || limit === 'all') {
                return (
                  <EpisodeCard
                    key={episode.id}
                    type={(isOwner || isEditor) ? CARD_TYPE.EDIT : CARD_TYPE.VIEW}
                    links={getPodcastLinks(episode)}
                    onMenuClick={(menu) => handlePodcast(menu, episode)}
                    episode={episode}
                  />
                )
              } else {
                return (<div key={episode.id} style={{ display: "none" }} ></div>)
              }
            })}
          </div>
          {page * SETTINGS.MAX_SEARCH_ROW_NUM < total && (
            <div className="channel-page-loading d-flex justify-center items-center">
              {loading ? (
                <div className="channel-page-loading-more">
                  <img src={IconLoadingMore} alt="loading-more-img" />
                </div>
              ) : (
                <CustomButton
                  text="Show More"
                  type="primary outlined"
                  onClick={onShowMore}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

PodcastsList.propTypes = {
  podcasts: PropTypes.array,
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  filter: PropTypes.object,
};

PodcastsList.defaultProps = {
  podcasts: [],
  isOwner: false,
  isEditor: false,
  filter: {},
};

const mapStateToProps = (state) => ({
  podcasts: podcastSelector(state).allEpisodes,
  total: podcastSelector(state).countOfResults,
  page: podcastSelector(state).currentPage,
  loading: podcastSelector(state).loading,
  channel: channelSelector(state).selectedChannel,
});

const mapDispatchToProps = {
  getFirstChannelPodcastList,
  getMoreChannelPodcastList,
  deleteChannelPodcast,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastsList);
