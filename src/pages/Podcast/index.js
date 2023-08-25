import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { connect } from "react-redux";

import { getAllPodcasts } from "redux/actions/podcast-actions";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { CustomButton, EpisodeCard } from "components";

import FilterDrawer from "./FilterDrawer";
import { PodcastFilterPanel } from "components";
import Emitter from "services/emitter";
import { EVENT_TYPES, SETTINGS, INTERNAL_LINKS } from "enum";
import getPodcastLinks from "utils/getPodcastLinks.js";

import IconAnchorFm from "images/icon-anchor-fm.svg";
import IconApplePodcast from "images/icon-apple-podcast.svg";
import IconBreakerPodcast from "images/icon-breaker-podcast.svg";
import IconIheartradio from "images/icon-iheartradio.svg";
import IconPocketCasts from "images/icon-pocket-casts.svg";
import IconRadiopublic from "images/icon-radiopublic.svg";
import IconSpotify from "images/icon-spotify.svg";
import IconVimeo from "images/icon-vimeo.svg";
import IconGoogle from "images/icon-google.svg";
import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const HARDCODED_LIST_OF_PODCAST_HOSTS = {
  anchor: {
    icon: IconAnchorFm,
    label: "Anchor FM",
    link: "https://anchor.fm/hacking-hr/episodes/The-Hacking-HR-Podcast---Episode-1-ei2cak",
  },

  apple: {
    icon: IconApplePodcast,
    label: "Apple Podcast",
    link: "https://podcasts.apple.com/us/podcast/the-hacking-hr-podcast/id1527651839?uo=4",
  },

  breaker: {
    icon: IconBreakerPodcast,
    label: "Breaker",
    link: "https://www.breaker.audio/the-hacking-hr-podcast",
  },

  iHeart: {
    icon: IconIheartradio,
    label: "iHeart Radio",
    link: "https://www.iheart.com/podcast/269-the-hacking-hr-podcast-70571765/",
  },

  pocketCasts: {
    icon: IconPocketCasts,
    label: "Pocket Casts",
    link: "https://pca.st/ydlfya8v",
  },

  radioPublic: {
    icon: IconRadiopublic,
    label: "Radio Public",
    link: "https://radiopublic.com/the-hacking-hr-podcast-GOKyBz",
  },

  spotify: {
    icon: IconSpotify,
    label: "Spotify",
    link: "https://open.spotify.com/show/1Vgm72AyxLwQplesLQv0TN",
  },

  vimeo: {
    icon: IconVimeo,
    label: "Vimeo",
    link: "https://vimeo.com/hackinghr",
  },

  google: {
    icon: IconGoogle,
    label: "Google Podcast",
    link: "https://bit.ly/3kATo8S",
  },
};

const PodcastPage = ({
  loading,
  history,
  allEpisodes,
  currentPage,
  countOfResults,
  getAllPodcasts,
}) => {
  const [podcastHosts] = useState(HARDCODED_LIST_OF_PODCAST_HOSTS);
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState("");

  useEffect(() => {
    getAllPodcasts({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilterChange = (filter) => {
    getAllPodcasts({ ...filter, meta });
    setFilters(filter);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  const onSearch = (value) => {
    getAllPodcasts({
      ...filters,
      meta: value,
    });
    setMeta(value);
  };

  const onShowMore = () => {
    getAllPodcasts({
      ...filters,
      meta,
      page: currentPage + 1,
    });
  };

  const onClickPodcastSeries = () => {
    history.push(INTERNAL_LINKS.PODCAST_SERIES);
  };

  return (
    <div className="podcast-page">
      <PodcastFilterPanel
        onChange={onFilterChange}
        onSearch={onSearch}
        onClickPodcastSeries={onClickPodcastSeries}
      />
      <FilterDrawer onChange={onFilterChange} onSearch={setMeta} />
      <div className="podcast-page__container">
        <div className="podcast-page__filters--button">
          <CustomButton
            text="Filters"
            onClick={() => {
              showFilterPanel();
            }}
          />
          <CustomButton
            type="primary"
            text="Podcast Series"
            style={{ marginTop: "1rem" }}
            onClick={onClickPodcastSeries}
          />
        </div>
        <header className="podcast-page__header">
          <h2>Subscribe:</h2>
        </header>

        <section className="podcast-page__hosts-row">
          {Object.values(podcastHosts).map((host, i) => (
            <div className="podcast-page__hosts-col" key={i}>
              <Tooltip placement="top" title={host.label}>
                <a
                  href={host.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="podcast-page__host-link"
                  atia-label={`Link to ${host.label}`}
                >
                  <span
                    className="podcast-page__host-link-icon"
                    style={{
                      backgroundImage: `url(${host.icon})`,
                    }}
                  ></span>
                  <span className="podcast-page__host-link-label">
                    {host.label}
                  </span>
                </a>
              </Tooltip>
            </div>
          ))}
        </section>

        <header className="podcast-page__header">
          <h2>Latest podcasts:</h2>
        </header>

        <section className="podcast-page__episodes-row">
          {allEpisodes.map((episode) => {
            let frequency = 0;
            if (episode.meta && meta) {
              frequency = [...episode.meta.toLowerCase().matchAll(meta)].length;
            }

            return (
              <div className="podcast-page__episodes-col" key={episode.id}>
                <EpisodeCard
                  keyword={meta}
                  frequency={frequency}
                  links={getPodcastLinks(episode)}
                  episode={episode}
                />
              </div>
            );
          })}
        </section>
        {currentPage * SETTINGS.MAX_SEARCH_ROW_NUM < countOfResults && (
          <div className="podcast-page-footer d-flex justify-center items-center">
            {loading && (
              <div className="podcast-page-loading-more">
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
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...podcastSelector(state),
});

const mapDispatchToProps = {
  getAllPodcasts,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastPage);
