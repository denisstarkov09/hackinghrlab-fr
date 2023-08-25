import React, { useState, useEffect } from "react";
import { notification, Tabs as TabsAntd } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { isEmpty } from "lodash";

import ConferenceLibraryFilterDrawer from "./ConferenceLibraryFilterDrawer";
import {
  AnnualConferenceCard,
  ConferenceCard,
  CustomButton,
  Tabs,
} from "components";
import ConferenceLibraryFilterPanel from "containers/ConferenceLibraryFilterPanel";
import { INTERNAL_LINKS, SETTINGS } from "enum";
import { setLoading } from "redux/actions/home-actions";
import {
  getAllSessions,
  getSessionsUserJoined,
} from "redux/actions/session-actions";
import {
  getMoreConferenceLibraries,
  searchConferenceLibraries,
} from "redux/actions/conference-actions";
import {
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
} from "redux/actions/advertisment-actions";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";
import { conferenceSelector } from "redux/selectors/conferenceSelector";

import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";
import Certificate from "pages/GlobalConference/Certificate";

const { TabPane } = TabsAntd;

const ConferenceLibrary = ({
  loading,
  allConferenceLibraries,
  getMoreConferenceLibraries,
  searchConferenceLibraries,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  advertisementsByPage,
  advertisementById,
  isAdPreview = false,
  getAllSessions,
  getSessionsUserJoined,
  sessionsUserJoined,
  allSessions,
  userProfile,
}) => {
  const [filters, setFilters] = useState({});
  const [visible, setVisible] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [sessionJoinedData, setSessionJoinedData] = useState([]);
  const [currentTab, setCurrentTab] = useState("0");
  const [meta, setMeta] = useState("");
  const [listOfYears, setListOfYears] = useState([2020]);
  const [modalVisibleCertificate, setModalVisibleCertificate] = useState(false);
  const [hasAdvertisementData, setHasAdvertisementData] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (isAdPreview) {
      getAdvertisementById(id);
    } else {
      getAdvertisementsTodayByPage("conference-library");
    }

    getAllSessions({ type: "conference" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (userProfile?.sessionsJoined?.length > 0) {
      getSessionsUserJoined(userProfile.sessionsJoined);
    }
  }, [getSessionsUserJoined, userProfile]);

  useEffect(() => {
    if (advertisementsByPage !== undefined && advertisementsByPage["conference-library"] !== undefined) {
      if(advertisementsByPage?.["conference-library"][0] !== undefined){
        setHasAdvertisementData(true);
      }else{
        setHasAdvertisementData(false);
      }
    } else {
      setHasAdvertisementData(false);
    }
  }, [advertisementsByPage]);

  const displayAds = !isEmpty(advertisementsByPage["conference-library"]) && (
    <div className="conference-library-advertisement-wrapper">
      {advertisementsByPage["conference-library"].map((advertisement) => {
        return (
          <div
            className="conference-library-advertisement-wrapper-content"
            key={advertisement.id}
          >
            <div
              className="advertisement"
              onClick={() => {
                createAdvertisementClick(advertisement.id);
                window.open(advertisement.advertisementLink, "_blank");
              }}
            >
              <img
                src={advertisement.adContentLink}
                alt="advertisement"
                className="advertisement-img"
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const displayPreviewAd = isAdPreview && (
    <div className="conference-library-advertisement-wrapper-preview">
      <div
        className="advertisement"
        onClick={() =>
          window.open(advertisementById.advertisementLink, "_blank")
        }
      >
        <img
          src={advertisementById.adContentLink}
          alt="advertisement"
          className="advertisement-img"
        />
      </div>
    </div>
  );

  const onShowMore = () => {
    getMoreConferenceLibraries(
      {
        ...filters,
        page: allConferenceLibraries?.[+currentTab].currentPage + 1,
        meta,
      },
      [listOfYears[+currentTab]],
      +currentTab
    );
  };

  const onFilterChange = (filters) => {
    searchConferenceLibraries(
      {
        ...filters,
        meta,
      },
      listOfYears
    );
    setFilters(filters);
  };

  const onSearch = (value) => {
    searchConferenceLibraries(
      {
        ...filters,
        meta: value,
      },
      listOfYears
    );
    setMeta(value);
  };

  useEffect(() => {
    const getListOfYears = (startYear) => {
      const currentYear = new Date().getFullYear();
      const years = [];

      while (startYear <= currentYear) {
        years.push(startYear++);
      }

      return years;
    };

    const listOfYears = getListOfYears(2020);
    setListOfYears(listOfYears.reverse());
    searchConferenceLibraries({}, listOfYears);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters.topics && JSON.parse(filters.topics).length > 0) {
      const topics = JSON.parse(filters.topics);

      const sessionsFiltered = allSessions.filter((session) => {
        let canFiltered = false;
        for (const topic of topics) {
          if (session.categories.some((categorie) => categorie === topic)) {
            canFiltered = true;
            break;
          }
        }

        if (
          !session.title.includes(meta) &&
          !session?.description?.includes(meta) &&
          !session?.speakers?.some(
            (speaker) =>
              speaker?.name?.includes(meta) ||
              speaker?.description?.includes(meta)
          )
        ) {
          canFiltered = false;
        }
        if (canFiltered) {
          return session;
        }

        return null;
      });

      const sessionsJoinedFiltered = sessionsUserJoined.filter((session) => {
        let canFiltered = false;
        for (const topic of topics) {
          if (session.categories.some((categorie) => categorie === topic)) {
            canFiltered = true;
            break;
          }
        }
        if (
          !session.title.includes(meta) &&
          !session?.description?.includes(meta) &&
          !session?.speakers?.some(
            (speaker) =>
              speaker?.name?.includes(meta) ||
              speaker?.description?.includes(meta)
          )
        ) {
          canFiltered = false;
        }

        if (canFiltered) {
          return session;
        }

        return null;
      });

      setSessionData(sessionsFiltered);
      setSessionJoinedData(sessionsJoinedFiltered);
    } else if (meta && meta !== null) {
      const sessionsFiltered = allSessions.filter((session) => {
        if (
          session.title.includes(meta) ||
          session?.description?.includes(meta) ||
          session?.speakers?.some(
            (speaker) =>
              speaker?.name?.includes(meta) ||
              speaker?.description?.includes(meta)
          )
        ) {
          return session;
        }

        return null;
      });

      const sessionsJoinedFiltered = sessionsUserJoined.filter((session) => {
        if (
          session.title.includes(meta) ||
          session?.description?.includes(meta) ||
          session?.speakers?.some(
            (speaker) =>
              speaker?.name?.includes(meta) ||
              speaker?.description?.includes(meta)
          )
        ) {
          return session;
        }

        return null;
      });

      setSessionData(sessionsFiltered);
      setSessionJoinedData(sessionsJoinedFiltered);
    } else {
      setSessionData(allSessions);
      setSessionJoinedData(sessionsUserJoined);
    }
  }, [filters, meta, allSessions, sessionsUserJoined]);

  // useEffect(() => {
  //   setCountOfResults(allConferenceLibraries[+currentTab]?.count || 0);

  //   // eslint-disable-next-line
  // }, [currentTab, allConferenceLibraries]);

  const displayData = (index) => {
    const libraries = allConferenceLibraries[index]?.rows || [];

    return libraries.map((item, indx) => {
      let frequency = 0;

      if (item.meta && meta) {
        frequency = [...item.meta.toLowerCase().matchAll(meta)].length;
      }

      return (
        <ConferenceCard
          listOfYearsIndex={index}
          key={indx}
          data={item}
          keyword={meta}
          frequency={frequency}
        />
      );
    });
  };

  const onWatch = (id) => {
    history.push(`${INTERNAL_LINKS.MICRO_CONFERENCE}/${id}`);
  };

  const TabData =
    listOfYears?.map((year, index) => {
      return {
        title: year,
        content: () => (
          <>
            {year === 2022 ? (
              <>
                <CustomButton
                  size="xs"
                  text="Download Digital Certificate"
                  style={{
                    marginTop: "12px",
                    padding: "0px 46px",
                  }}
                  onClick={() => {
                    if (userProfile?.sessionsJoined?.length < 1) {
                      return notification.info({
                        message:
                          "Available only for those who joined during the week of the conference",
                      });
                    }
                    setModalVisibleCertificate(true);
                  }}
                />
                <div>
                  <TabsAntd
                    defaultActiveKey="1"
                    //  onChange={callback}
                  >
                    <TabPane tab="All Sessions" key="1">
                      <div className="sessions-2022-container">
                        {sessionData.map((session) => (
                          <AnnualConferenceCard
                            key={session.id}
                            session={session}
                            typeConference="conference-library"
                            onWatch={() => onWatch(session.id)}
                          />
                        ))}
                      </div>
                    </TabPane>
                    <TabPane
                      tab="Sessions You Joined During The Conference"
                      key="2"
                    >
                      <div className="sessions-2022-container">
                        {sessionJoinedData.map((session, i) => (
                          <AnnualConferenceCard
                            key={session.id}
                            session={session}
                            typeConference="conference-library"
                            onWatch={() => onWatch(session.id)}
                          />
                        ))}
                      </div>
                    </TabPane>
                  </TabsAntd>
                </div>
              </>
            ) : (
              <div className="search-results-list">{displayData(index)}</div>
            )}
          </>
        ),
      };
    }) || [];

  return (
    <div className="conference-library-page">
      {hasAdvertisementData ? <div></div> : 
      <ConferenceLibraryFilterPanel
        onChange={onFilterChange}
        onSearch={onSearch}
      />}
      <ConferenceLibraryFilterDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        onChange={onFilterChange}
        onSearch={setMeta}
      />
      <div className="search-results-container">
        <Row>
          <Col span={24}>
            <div className={`search-results-container${hasAdvertisementData ? "-advertsiment-wrapper" : "-mobile-header"}`} onClick={() => setVisible(true)}>
              <h3 className="filters-btn">
                Filters
              </h3>
            </div>
          </Col>
        </Row>
        <div className="conference-library-content">
          <div className="tabs-container">
            <Tabs
              data={TabData}
              current={currentTab}
              onChange={setCurrentTab}
            />
            {allConferenceLibraries[+currentTab]?.currentPage *
              SETTINGS.MAX_SEARCH_ROW_NUM <
              allConferenceLibraries[+currentTab]?.count && (
              <div className="conference-library-footer d-flex justify-center items-center">
                {loading && (
                  <div className="conference-library-page-loading-more">
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
          {displayAds}
          {displayPreviewAd}
        </div>
      </div>

      <Certificate
        visible={modalVisibleCertificate}
        onCancel={() => setModalVisibleCertificate(false)}
        sessionsUserJoined={sessionsUserJoined}
      />
    </div>
  );
};

ConferenceLibrary.propTypes = {
  title: PropTypes.string,
};

ConferenceLibrary.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  loading: conferenceSelector(state).loading,
  allConferenceLibraries: conferenceSelector(state).allConferenceLibraries,
  allSessions: sessionSelector(state).allSessions,
  sessionsUserJoined: sessionSelector(state).sessionsUserJoined,
  countOfResults: conferenceSelector(state).countOfResults,
  currentPage: conferenceSelector(state).currentPage,
  userProfile: homeSelector(state).userProfile,
  ...advertisementSelector(state),
});

const mapDispatchToProps = {
  getMoreConferenceLibraries,
  searchConferenceLibraries,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  getSessionsUserJoined,
  getAllSessions,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceLibrary);
