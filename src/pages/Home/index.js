/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { useParams, useHistory } from "react-router-dom";
import AdvertisementDrawer from "containers/AdvertisementDrawer";

import ProfileStatusBar from "./ProfileStatusBar";
import { 
  // PostsFilterPanel, 
  CustomButton 
} from "components";

import Posts from "containers/Posts";
import moment from "moment";
import TimeZoneList from "enum/TimezoneList";
// import FilterDrawer from "../Home/FilterDrawer";

import { getUser, setFirstRedirect } from "redux/actions/home-actions";
import { getAllPost } from "redux/actions/post-actions";
import { getRecommendations } from "redux/actions/library-actions";

import { homeSelector } from "redux/selectors/homeSelector";
import { librarySelector } from "redux/selectors/librarySelector";
import { postSelector } from "redux/selectors/postSelector";
import { liveSelector } from "redux/selectors/liveSelector";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { envSelector } from "redux/selectors/envSelector";
import {
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
} from "redux/actions/advertisment-actions";

import {
  getEvent
} from "redux/actions/event-actions"

import Emitter from "services/emitter";
import { EVENT_TYPES, INTERNAL_LINKS } from "enum";

import "./style.scss";
import TrendingItem from "./TrendingItem";

const HomePage = ({
  history,
  location,
  userProfile,
  recommendations,
  getRecommendations,
  getUser,
  currentPage,
  getAllPost,
  getAdvertisementsTodayByPage,
  advertisementsByPage,
  getAdvertisementById,
  setFirstRedirect,
  firstRedirect,
  advertisementById,
  isAdPreview = false,
  createAdvertisementClick,
  getEvent,
  liveEvent,
  live,
  isMobile,
}) => {
  const [filters] = useState({});
  const [text] = useState("");
  const [visible, setVisible] = useState(false);
  const [hasAdvertisementData, setHasAdvertisementData] = useState(null);
  const { id } = useParams();

  const history2 = useHistory();

  const onUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  useEffect(() => {
    if(!firstRedirect){
      setFirstRedirect(true)
      history2.push(INTERNAL_LINKS.LANDING_PAGUE)
    }
  },[firstRedirect,setFirstRedirect,history2])

  useEffect(() => {
    const { refresh } = queryString.parse(location.search);
    if (refresh === 1) {
      getUser();
    }

    getRecommendations();
    getAllPost({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAdPreview) {
      getAdvertisementById(id);
    } else {
      getAdvertisementsTodayByPage("home");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (
      advertisementsByPage !== undefined &&
      advertisementsByPage.home !== undefined
    ) {
      if (advertisementsByPage?.home[0] !== undefined) {
        setHasAdvertisementData(true);
      } else {
        setHasAdvertisementData(false);
      }
    } else {
      setHasAdvertisementData(false);
    }
  }, [advertisementsByPage]);

  // const onFilterChange = (filter) => {
  //   getAllPost({ ...filter, text });
  //   setFilters(filter);
  // };

  // const showFilterPanel = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  // };

  // const onSearch = (value) => {
  //   getAllPost({
  //     ...filters,
  //     text: value,
  //   });
  //   setText(value);
  // };

  const onShowMore = () => {
    getAllPost({
      ...filters,
      text,
      page: currentPage + 1,
    });
  };

  const searchTimeZone = (timezone) => {
    let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

    if (currentTimezone) {
      currentTimezone = currentTimezone.utc[0];
    } else {
      currentTimezone = timezone;
    }

    return currentTimezone
  }

  const showButtonFunction = (startAndEndTimes,timezone) => {
    let bul = false

    if(startAndEndTimes !== undefined && timezone !== undefined){
      let dateNow = moment(moment.utc(),'YYYY-MM-DD hh:mm a').tz(searchTimeZone(timezone))?.format('YYYYMMDDHHmm')

      startAndEndTimes.forEach((time) => {
        if(bul === false){
          if((Number(dateNow) > Number(moment(time?.startTime,"YYYY-MM-DD hh:mm a")?.subtract(5, 'minute')?.format('YYYYMMDDHHmm'))) === true
          && (Number(dateNow) < Number(moment(time?.endTime,"YYYY-MM-DD hh:mm a")?.add(1, 'minute')?.format('YYYYMMDDHHmm'))) === true){
            bul = true
          }
        }
      })
    }

    return bul

  }

  const liveAds = showButtonFunction(liveEvent?.startAndEndTimes, liveEvent?.timezone) ? (
    <div
      className="live-button"
      onClick={() => {
        if (userProfile.completed === true) {
          history2.push(INTERNAL_LINKS.LIVE);
        } else {
          Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "live");
        }
      }}
    >
      <div className="live-container">
        <div className="live-circle"></div>
        <div>LIVE</div>
        <p>: {liveEvent?.title}</p>
      </div>
    </div>
  ) : (
    <div style={{display:'none'}}></div>
  )

  useEffect(() => {
    if(live.event){
      getEvent(Number(live.event));
    }
  }, [live.event, getEvent])

  const displayAds = () => {
    
    if(hasAdvertisementData){
      return (
        <div className="home-advertisement-wrapper" style={{ marginRight: 10 }}>
          {liveAds}
          {advertisementsByPage?.home?.map((advertisement) => {
            return (
              <div
                className="home-advertisement-wrapper-content"
                key={advertisement?.id}
              >
                <div
                  className="advertisement"
                  onClick={() => {
                    createAdvertisementClick(advertisement?.id);
                    window.open(advertisement?.advertisementLink, "_blank");
                  }}
                >
                  <img
                    src={advertisement?.adContentLink}
                    alt="advertisement"
                    className="advertisement-img"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )
    }else if(showButtonFunction(liveEvent?.startAndEndTimes, liveEvent?.timezone)){
      return(
        <div className="home-advertisement-wrapper" style={{ marginRight: 10 }}>
          {liveAds}
        </div>
      )
    }else{
      return <div style={{display:'none'}}></div>
    }
  }

  const displayPreviewAd = isAdPreview && (
    <div className="home-advertisement-wrapper-preview">
      <div
        className="advertisement"
        onClick={() =>
          window.open(advertisementById?.advertisementLink, "_blank")
        }
      >
        <img
          src={advertisementById?.adContentLink}
          alt="advertisement"
          className="advertisement-img"
        />
      </div>
    </div>
  );

  const onOpenPostFormModal = () => {
    if (userProfile.completed === true && userProfile.memberShip === "premium") {
      Emitter.emit(EVENT_TYPES.OPEN_POST_MODAL);
    } else {
      Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "story");
    }
  };

  return (
    <div className="home-page-container">
      <div className="home-page-container--trending">
        <h3>Trending</h3>
        <div className="items">
          {recommendations.podcasts && (
            <>
              {recommendations.podcasts.map((item, index) => (
                <TrendingItem
                  key={`trending-podcast-${index}`}
                  type="podcast"
                  element={item}
                />
              ))}
            </>
          )}

          {recommendations.conferenceLibrary && (
            <>
              {recommendations.conferenceLibrary.map((item, index) => (
                <TrendingItem
                  key={`trending-conference-${index}`}
                  type="conference"
                  element={item}
                />
              ))}
            </>
          )}

          {recommendations.libraries && (
            <>
              {recommendations.libraries.map((item, index) => (
                <TrendingItem
                  key={`trending-library-${index}`}
                  type="library"
                  element={item}
                />
              ))}
            </>
          )}
          {recommendations.events && (
            <>
              {recommendations.events.map((item, index) => (
                <TrendingItem
                  key={`trending-event-${index}`}
                  type="event"
                  element={item}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="home-page-container--posts">
        <div className="home-page-container--posts-central-panel">
          <div className="home-page-container--upgrade">
            <div className="container-post-center">
              <div className="home-page-container--upgrade container-upgrade-premium">
                {isMobile && (
                  <CustomButton 
                    type="primary" 
                    onClick={() => onOpenPostFormModal()}
                    text="Add Story"
                  />
                )}
                {userProfile && userProfile.percentOfCompletion !== 100 && (
                  <div className="home-page-container--profile">
                    <ProfileStatusBar user={userProfile} />
                  </div>
                )}
                {userProfile && userProfile.memberShip === "free" && (
                  <div className="recommend-card">
                    <h2 className="recommend-card-label">
                      Upgrade to a PREMIUM Membership and get unlimited access to
                      the LAB features
                    </h2>
                    <CustomButton
                      text="Upgrade to PREMIUM"
                      type="primary"
                      size="xl"
                      className="recommend-card-upgrade-2"
                      onClick={onUpgrade}
                    />
                  </div>
                )}
              </div>
              <Posts onShowMore={onShowMore} history={history} />
            </div>
            {displayAds()}
            {displayPreviewAd}
          </div>
        </div>
      </div>
      <AdvertisementDrawer
        page="home"
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  firstRedirect: homeSelector(state).firstRedirect,
  recommendations: librarySelector(state).recommendations,
  currentPage: postSelector(state).currentPage,
  live: liveSelector(state).live,
  isMobile: envSelector(state).isMobile,
  liveEvent: eventSelector(state).liveEvent,
  ...advertisementSelector(state),
});

const mapDispatchToProps = {
  getRecommendations,
  setFirstRedirect,
  getUser,
  getAllPost,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
  getEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
