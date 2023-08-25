import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { connect } from "react-redux";

import { getLibrary } from "redux/actions/library-actions";
import { librarySelector } from "redux/selectors/librarySelector";

import "./style.scss";

const Data = {
  title: "The 5 Whys Process We Use to Understand the Root of Any Problem",
  description: "By Hassan Montero, Yusef Martín Fernández, Francisco J.",
  original: [
    "Sometimes things don’t go according to plan. Tools break, wires get crossed, the best-laid plans fall apart.",
    "And on those occasions, it helps to know exactly what happened—so it doesn’t happen again.",
    "Moments like these are when we at Buffer turn to a simple but remarkably effective process: The 5 Whys.",
    "It’s just as it sounds: A discussion of the unexpected event or challenge that follows one train of thought to its logical conclusion by asking “Why?” five times to get to the root of what happened.",
    "But it’s also a lot deeper than that, too. Let’s take a look at the origin and history of this unique process, and I’ll tell you a bit about how it works for us on our remote team at Buffer—and how it could work for you, too.",
  ],
  subData: [
    {
      title: "How the 5 Whys process works",
      text: [
        "At our startup, we perform a “5 Whys” after something unexpected has occurred—and that means we perform them a lot! We keep a “5 Whys” folder in our team’s Dropbox Paper account, and the folder has 20+ notes files and counting (not to mention the 5 Whys docs that might not be categorized into the folder). ‘Fires’ of various sizes are inevitable—and probably the only constant in the life of a startup.",
      ],
    },
  ],
};

const ArticlePage = ({ match, selectedLibrary, getLibrary }) => {
  useEffect(() => {
    const {
      params: { id },
    } = match;

    getLibrary(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="article-page">
      <Row gutter={16}>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 16, offset: 4 }}
          lg={{ span: 12, offset: 6 }}
        >
          <Row gutter={64}>
            <Col lg={{ span: 20, offset: 2 }}>
              <h1 className="article-page-title">{selectedLibrary.title}</h1>
              <h3 className="article-page-desc">
                {selectedLibrary.description}
              </h3>
              <h3 className="view-original">View Original</h3>
            </Col>
            <Col span={24}>
              {Data.original.map((data, index) => (
                <p key={index} className="article-page-text original">
                  {data}
                </p>
              ))}
            </Col>
            {Data.subData &&
              Data.subData.map((data, index) => (
                <Col key={index} span={24}>
                  {data.title && (
                    <h1 className="article-page-subtitle">{data.title}</h1>
                  )}
                  {data.text.map((txt, index) => (
                    <h3 key={index} className="article-page-text">
                      {txt}
                    </h3>
                  ))}
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

ArticlePage.propTypes = {
  title: PropTypes.string,
};

ArticlePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  selectedLibrary: librarySelector(state).selectedLibrary,
});

const mapDispatchToProps = {
  getLibrary,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
