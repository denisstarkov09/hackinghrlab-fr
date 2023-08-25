import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { SpeakerCard } from "components";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { getAllSessions } from "redux/actions/session-actions";
import { setLoading } from "redux/actions/home-actions";
import { connect } from "react-redux";
import "./style.scss";

const Speakers = ({ allSessions, getAllSessions, setLoading }) => {
  const [speakers, setSpeakers] = useState([]);
  const [page, setPage] = useState(1);

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

  const handlePaginated = (value) => {
    setPage(value);
  };
  return (
    <div className="speakers-list">
      <div className="speakers-list-container">
        {speakers.length > 0 &&
          speakers
            .slice((page - 1) * 20, page * 20)
            .map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "1rem 0rem",
        }}
      >
        <Pagination
          defaultCurrent={page}
          defaultPageSize={20}
          total={speakers.length}
          showSizeChanger={false}
          onChange={handlePaginated}
        />
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
