import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { homeSelector } from "redux/selectors/homeSelector";

import { CARD_TYPE, INTERNAL_LINKS } from "enum";
import { getPublicationTime } from "utils/format";

import { CustomButton, SpecialtyItem } from "components";

import "./style.scss";

const CouncilCard = ({ data, type }) => {
  const [, setLineClamp] = useState(3);

  const history = useHistory();

  const { title, description, createdAt, topics } = data || {};
  const randomId = `article-description-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        getRowNum();
      }
    }, 500);

    window.addEventListener("resize", getRowNum);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", getRowNum);
    };
    // eslint-disable-next-line
  }, []);

  const getRowNum = () => {
    const descElement = document.querySelector(`#${randomId}`);
    if (descElement) {
      const maxRow = Math.floor(descElement.offsetHeight / 23);
      setLineClamp(maxRow ? maxRow : 1);
    }
  };

  const onJoin = () => {
    history.push(`${INTERNAL_LINKS.COUNCIL}/resource?id=${data.id}`);
  };
  return (
    <div className={clsx("council-card", { add: type === CARD_TYPE.ADD })}>
      <div className="council-card-content">
        <h3 className="council-card-title">{title}</h3>
        <div>
          <div id={randomId} className="d-flex items-center">
            <p className="council-card-desc">{description}</p>
          </div>
        </div>
        <div className="council-card-topics">
        {topics?.map((item, index) => (
          <SpecialtyItem title={item} key={index} />
        ))}
        </div>
          <div id={randomId} className="d-flex items-center d-rigth">
            <span className="council-card-desc">
              {getPublicationTime(createdAt)}
            </span>
          </div>
        <div className="council-card-content-footer">
          <CustomButton
            className="filter-drawer-content-share"
            text="Join the conversation"
            size="md"
            type="primary"
            onClick={onJoin}
          />
        </div>
      </div>
    </div>
  );
};

CouncilCard.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  onAdd: PropTypes.func,
  onMenuClick: PropTypes.func,
};

CouncilCard.defaultProps = {
  data: {},
  type: CARD_TYPE.VIEW,
  frequency: 0,
  keyword: "",
  onAdd: () => {},
  onMenuClick: () => {},
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilCard);
