import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import ReactPlayer from 'react-player/vimeo';
import LoadingGif from 'images/icon-loading.gif';

import {
  setProgress,
} from "redux/actions/course-user-progress-actions";
import { courseClassUserSelector } from "redux/selectors/courseClassUserSelector";

import './style.scss';

function MicroClassVideoWrapper({ 
  url,
  id,
  courseId,
  setProgress,
  courseUserProgress,
}) {
  const player = useRef(null);

  function handleProgress({ playedSeconds }) {
    setProgress({ courseId, CourseClassId: id, progressVideo: playedSeconds });
  }

  const setProgressVideoPlayer = () => {
    for (let item of courseUserProgress) {
      if(id === item.CourseClassId) {
        player.current.seekTo(item.progressVideo);
      }
    }
  }

  return (
    <div className="micro-class__player-wrapper">
      <img src={LoadingGif} className="micro-class__player-loading" alt="Loading" />
      <ReactPlayer
        className="micro-class__react-player"
        controls={true}
        width="100%"
        height="100%"
        playsinline
        url={url}
        progressInterval={30000}
        onProgress={handleProgress}
        onReady={() => { setProgressVideoPlayer(); }}
        ref={player}
        onEnded={() => { setProgress({ courseId, CourseClassId: id, viewed: true }); }}
      />
    </div>
  )
}

MicroClassVideoWrapper.propTypes = {
  url: PropTypes.string,
  setVideoAsWatched: PropTypes.func,
  id: PropTypes.number,
};

MicroClassVideoWrapper.defaultProps = {
  url: null,
  setVideoAsWatched: () => {},
  id: null,
};

const mapStateToProps = (state, props) => ({
  courseUserProgress: courseClassUserSelector(state).courseUserProgress,
});

const mapDispatchToProps = {
  setProgress
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MicroClassVideoWrapper);