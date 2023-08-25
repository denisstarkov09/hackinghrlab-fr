import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import Emitter from "services/emitter";
import { SpeakersFilterPanel, SpeakerCard } from "components";
import FilterDrawer from "./FilterDrawer";
import { sessionSelector } from "redux/selectors/sessionSelector";

import { EVENT_TYPES } from "enum";
import { getAllSessions } from "redux/actions/session-actions";
import { setLoading } from "redux/actions/home-actions";
import "./style.scss";
import { connect } from "react-redux";

const Speakers = ({ allSessions, getAllSessions, setLoading }) => {
  const [, setFilters] = useState({});
  const [, setMeta] = useState("");
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    getAllSessions();
  }, [getAllSessions]);

  useEffect(() => {
    const getSpeakers = () => {
      setLoading(true);
      const speakersSession = [];

      allSessions.forEach((session) => {
        for (let i = 0; i < session.speakers.length; i++) {
          let exits = false;
          for (let j = 0; j < speakersSession.length; j++) {
            if (session.speakers[i].id === speakersSession[j].id) {
              exits = true;
            }
          }

          if (!exits) {
            speakersSession.push(session.speakers[i]);
          }
        }
      });

      setSpeakers(
        speakersSession.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else if (b.name > a.name) {
            return -1;
          }

          return 0;
        })
      );
      setLoading(false);
    };

    getSpeakers();
  }, [allSessions, setLoading]);

  const onFilterChange = (filter) => {
    setFilters(filter);
  };

  const onSearch = (value) => {
    setMeta(value);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  return (
    <div className="speakers-page">
      <SpeakersFilterPanel onChange={onFilterChange} onSearch={onSearch} />
      <FilterDrawer onChange={onFilterChange} onSearch={setMeta} />
      <div className="speakers__container">
        <div className="search-results-container">
          <Row>
            <Col span={24}>
              <div className="search-results-container-mobile-header">
                <h3
                  className="filters-btn"
                  onClick={() => {
                    showFilterPanel();
                  }}
                >
                  Filters
                </h3>
              </div>
            </Col>
          </Row>

          <div className="speakers-list">
            {speakers.length > 0 &&
              speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...sessionSelector(state),
});

const mapDispatchToProps = {
  getAllSessions,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Speakers);
