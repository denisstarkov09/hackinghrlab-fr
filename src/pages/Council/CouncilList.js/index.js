import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CustomButton } from "components";
import NoItemsMessageCard from "components/NoItemsMessageCard";

import { CARD_TYPE } from "enum";
import { SETTINGS } from "enum";

import { councilSelector } from "redux/selectors/councilSelector";

import IconLoadingMore from "images/icon-loading-more.gif";
import {
  getCouncilResources,
  setCouncilResources,
  createCouncilResource,
  updateCouncilResourcesInformation,
} from "redux/actions/council-actions";

import CouncilCard from "../CouncilCard";
import { isEmpty } from "lodash";

const CouncilList = ({
  total,
  page,
  filter,
  channel,
  isOwner,
  loading,
  type,
  refresh,
  getMoreChannelLibraryList,
  getCouncilResources,
  councilResources,
  setCurrentValue,
  createCouncilResource,
}) => {
  const [topics, setTopics] = useState(filter.topics || []);
  const [resources, setResources] = useState(councilResources);

  const onShowMore = () => {
    getMoreChannelLibraryList(
      {
        ...filter,
        channel: channel.id,
        contentType: type,
        page: page + 1,
      },
      "newest-first"
    );
  };

  useEffect(() => {
    setTopics(JSON.parse(filter.topics || "[]"));
  }, [filter]);

  useEffect(() => {
    setResources(councilResources);
    let filterResources = [];
    if (topics && !isEmpty(topics)) {
      topics.some((el) => {
        return councilResources.filter((item) =>
           item.topics.map((topic) => {
            if (topic === el) {
              return filterResources.push(item)
            }
            return filterResources
          })
        );
      });
      setResources(filterResources);
    }
  }, [topics, councilResources, filter]);

  useEffect(() => {
    if (refresh) {
      getCouncilResources();
      setResources(councilResources);
    }
    setResources(councilResources);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, createCouncilResource]);

  return (
    <div className="channel-page__list-wrap">
      {!isOwner && resources?.length === 0 ? (
        <NoItemsMessageCard
          message={`There are no ${
            type === "article" ? "resources" : "videos"
          } for you at the moment`}
        />
      ) : (
        <>
          <div className="channels__list">
            {isOwner && <CouncilCard type={CARD_TYPE.ADD} />}
            {resources?.map((item, index) => (
              <CouncilCard
                type={isOwner ? CARD_TYPE.EDIT : CARD_TYPE.VIEW}
                key={index}
                data={item}
                // onMenuClick={(menu) => handleLibrary(menu, item)}
                setCurrentValue={setCurrentValue}
              />
            ))}
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

CouncilList.propTypes = {
  resources: PropTypes.array,
  isOwner: PropTypes.bool,
  refresh: PropTypes.bool,
  filter: PropTypes.object,
  type: PropTypes.string,
};

CouncilList.defaultProps = {
  resources: [],
  isOwner: false,
  refresh: false,
  filter: {},
  type: "article",
};

const mapStateToProps = (state) => ({
  councilResources: councilSelector(state).councilResources,
});

const mapDispatchToProps = {
  getCouncilResources,
  setCouncilResources,
  createCouncilResource,
  updateCouncilResourcesInformation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilList);
