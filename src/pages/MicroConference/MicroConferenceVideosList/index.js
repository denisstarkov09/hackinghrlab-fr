import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSessionUserProgress } from "redux/actions/session-class-user-action";
import { sessionClassUserSelector } from "redux/selectors/sessionClassUserSelector";

import "./style.scss";

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + Math.round(s);
}

function MicroConferenceVideosList({
  list,
  setActiveVideoId,
  activeVideoId,
  getSessionUserProgress,
  sessionUserProgress,
  sessionId,
  type
}) {
  const [repeatVideo, setRepeatVideo] = useState(false);
  useEffect(() => {
    getSessionUserProgress({ sessionId: sessionId, type: (type !== "2022" || type !== undefined || type !== null) ? type : '2022' });
    // eslint-disable-next-line
  }, []);

  useMemo(() => {
    if (
      sessionUserProgress.every((sessionUser) => sessionUser.viewed === true) &&
      list.length > 0 &&
      sessionUserProgress.length > 0 &&
      !repeatVideo
    ) {
      setActiveVideoId(list[list.length - 1].id);
    } else if (
      list.length > 0 &&
      sessionUserProgress.length > 0 &&
      !repeatVideo
    ) {
      for (let i = 0; i < list.length; i++) {
        for (const sessionUser of sessionUserProgress) {
          if (
            sessionUser.viewed === true &&
            sessionUser.AnnualConferenceClassId === list[i].id &&
            list[i + 1]
          ) {
            setActiveVideoId(list[i + 1].id);
          }
        }
      }
    } else if (
      list.length > 0 &&
      activeVideoId === null &&
      (sessionUserProgress.every(
        (sessionUser) => sessionUser.progressVideo === null
      ) ||
        sessionUserProgress.every(
          (sessionUser) => sessionUser.viewed === false
        ))
    ) {
      setActiveVideoId(list[0].id);
    }
  }, [activeVideoId, list, setActiveVideoId, sessionUserProgress, repeatVideo]);

  return (
    <div className="micro-conference__videos-list">
      <div className="micro-conference__videos-list-inner">
        {list.map((item) => {
          let isViewed = false;
          for (let sessionClassUserItem of sessionUserProgress) {
            if (
              item.id === sessionClassUserItem.AnnualConferenceClassId &&
              sessionClassUserItem.viewed === true
            ) {
              isViewed = true;
            }
          }
          return (
            <button
              key={item.id}
              className={`
              micro-conference__videos-list-button
              ${isViewed ? "micro-conference__videos-list-button--watched" : ""}
              ${activeVideoId === item.id
                  ? "micro-conference__videos-list-button--active"
                  : ""
                }
            `}
              onClick={() => {
                setActiveVideoId(item.id);
                setRepeatVideo(true);
              }}
            >
              <span className="micro-conference__videos-list-button-indicator"></span>
              <span className="micro-conference__videos-list-button-title">
                {item.title}
              </span>
              <span className="micro-conference__videos-list-button-duration">
                {fmtMSS(item.duration)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

MicroConferenceVideosList.propTypes = {
  list: PropTypes.array,
  setActiveVideoId: PropTypes.func,
  activeVideoId: PropTypes.number,
  type: PropTypes.string
};

MicroConferenceVideosList.defaultProps = {
  list: [],
  setActiveVideoId: () => { },
  activeVideoId: null,
  type: ''
};

const mapStateToProps = (state, props) => ({
  sessionUserProgress: sessionClassUserSelector(state).sessionUserProgress,
});

const mapDispatchToProps = {
  getSessionUserProgress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MicroConferenceVideosList);
