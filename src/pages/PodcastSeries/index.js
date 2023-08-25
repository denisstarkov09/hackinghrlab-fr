import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import {
  PodcastFilterPanel,
  PodcastSeriesCard,
  CustomButton,
} from "components";
import { INTERNAL_LINKS, EVENT_TYPES } from "enum";
import { getAllPodcastSeries } from "redux/actions/podcast-actions";
import { podcastSelector } from "redux/selectors/podcastSelector";
import Emitter from "services/emitter";
import FilterDrawer from "../Podcast/FilterDrawer";

import { numberWithCommas } from "utils/format";

import "./style.scss";

const PodcastSeries = ({ history, allPodcastSeries, getAllPodcastSeries }) => {
  const onCardClick = (podcastSeries) => {
    history.push(`${INTERNAL_LINKS.PODCAST_SERIES}/${podcastSeries.id}`);
  };

  const onShowFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  const onFilterChange = (filter) => {
    getAllPodcastSeries({ ...filter });
  };

  useEffect(() => {
    getAllPodcastSeries({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="podcast-series-page">
      <PodcastFilterPanel hidePodcastSeries onChange={onFilterChange} />
      <FilterDrawer onChange={onFilterChange} />
      <div className="podcast-series-page-container">
        <div className="search-results-container">
          <div className="podcast-series-page__filters--button">
            <CustomButton
              text="Filters"
              onClick={() => {
                onShowFilterPanel();
              }}
            />
          </div>
          <Row>
            <Col span={24}>
              <div className="search-results-container-header d-flex justify-between items-center">
                <h3>{`${numberWithCommas(allPodcastSeries.length)} result${
                  allPodcastSeries.length > 1 ? "s" : ""
                }`}</h3>
              </div>
            </Col>
          </Row>
          <div className="podcast-series-list">
            {allPodcastSeries.map((ps) => (
              <PodcastSeriesCard
                key={ps.id}
                data={ps}
                onClick={() => onCardClick(ps)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  allPodcastSeries: podcastSelector(state).allPodcastSeries,
});

const mapDispatchToProps = {
  getAllPodcastSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastSeries);
