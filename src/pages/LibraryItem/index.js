import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";

import { ConferenceCard, EpisodeCard } from "components";

import IconBack from "images/icon-back.svg";

import {
  getConferenceLibrary,
  setConferenceLibrary,
} from "redux/actions/conference-actions";
import { getPodcast, setPodcast } from "redux/actions/podcast-actions";
import { conferenceSelector } from "redux/selectors/conferenceSelector";
import { podcastSelector } from "redux/selectors/podcastSelector";

import getPodcastLinks from "utils/getPodcastLinks.js";

import "./style.scss";

const LibraryItemPage = ({
  getConferenceLibrary,
  setConferenceLibrary,
  getPodcast,
  setPodcast,
  conferenceLibrary,
  podcast,
  match,
}) => {
  const { id, type } = useParams();
  const history = useHistory();

  const { search } = useLocation();
  const query = new URLSearchParams(search);

  useEffect(() => {
    if (type === "conference-library") {
      setConferenceLibrary(null);
      getConferenceLibrary(id);
    } else if (type === "podcast") {
      setPodcast(null);
      getPodcast(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  return (
    <div className="library-item-page-container">
      {type === "conference-library" && (
        <div className="library-item-page-container--conference-library">
          {conferenceLibrary != null && (
            <ConferenceCard
              key={0}
              data={conferenceLibrary}
              afterUpdate={() => {
                getConferenceLibrary(id);
              }}
              isInternalLink={true}
            />
          )}
        </div>
      )}
      {type === "podcast" && (
        <div className="library-item-page-container--podcast-library">
          {type === "podcast" && (
            <div className="library-item-page-container--podcast-library">
              <div
                className="skill-cohort-detail-page-header-content-back-btn mb-3"
                onClick={() =>
                  history.push(
                    query.get("channel")
                      ? `${INTERNAL_LINKS.PODCAST_SERIES}/${query.get(
                          "channel"
                        )}`
                      : INTERNAL_LINKS.PODCAST
                  )
                }
              >
                <div className="skill-cohort-detail-page-header-content-back">
                  <div className="skill-cohort-detail-page-header-content-back-img">
                    <img src={IconBack} alt="icon-back" />
                  </div>
                  <h4>
                    {query.get("channel")
                      ? "Back to podcast series"
                      : "Back to podcasts"}
                  </h4>
                </div>
              </div>
              {podcast != null && (
                <EpisodeCard
                  key={podcast.id}
                  links={getPodcastLinks(podcast)}
                  episode={podcast}
                  isInternalLink={true}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

LibraryItemPage.propTypes = {
  title: PropTypes.string,
};

LibraryItemPage.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  conferenceLibrary: conferenceSelector(state).conferenceLibrary,
  podcast: podcastSelector(state).podcast,
});

const mapDispatchToProps = {
  getConferenceLibrary,
  setConferenceLibrary,
  getPodcast,
  setPodcast,
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryItemPage);
