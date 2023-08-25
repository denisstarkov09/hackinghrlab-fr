import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import clsx from "clsx";

import { getAllPodcastSeries } from "redux/actions/podcast-actions";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { INTERNAL_LINKS } from "enum";

import "./style.scss";

const PodcastSeriesPanel = ({
  podcastSeries,
  allPodcastSeries,
  getAllPodcastSeries,
}) => {
  const history = useHistory();

  const onSelectPodcastSeries = (ps) => {
    history.push(`${INTERNAL_LINKS.PODCAST_SERIES}/${ps.id}`);
  };

  useEffect(() => {
    if (!allPodcastSeries || allPodcastSeries.length === 0) {
      getAllPodcastSeries({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="podcast-series-panel">
      <h2 className="font-regular">Podcast Series</h2>
      <div className="podcast-series-panel-container">
        {allPodcastSeries.map((ps) => (
          <div
            key={ps.id}
            className={clsx("podcast-series-item", {
              active: ps.id === podcastSeries.id,
            })}
            onClick={() => onSelectPodcastSeries(ps)}
          >
            <h5>{ps.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

PodcastSeriesPanel.propTypes = {
  title: PropTypes.string,
};

PodcastSeriesPanel.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  allPodcastSeries: podcastSelector(state).allPodcastSeries,
  podcastSeries: podcastSelector(state).podcastSeries,
});

const mapDispatchToProps = {
  getAllPodcastSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastSeriesPanel);
