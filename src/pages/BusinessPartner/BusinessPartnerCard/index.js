import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Button } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { homeSelector } from "redux/selectors/homeSelector";
import { deleteBusinessPartnerResource } from "redux/actions/business-partner-actions";

import Emitter from "services/emitter";
import { CARD_TYPE, INTERNAL_LINKS, EVENT_TYPES } from "enum";
import { getPublicationTime } from "utils/format";

import { CustomButton, SpecialtyItem } from "components";

import "./style.scss";

const BusinessPartnerCard = ({
  data,
  type,
  deleteBusinessPartnerResource,
  userProfile,
}) => {
  const [, setLineClamp] = useState(3);

  const history = useHistory();

  const { title, description, createdAt, topics, UserId } = data || {};
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
    history.push(`${INTERNAL_LINKS.BUSINESS_PARTNER}/resource?id=${data.id}`);
  };
  const handleEdit = () => {
    history.replace({
      pathname: window.location.pathname,
      search: `tab=1&edit=true&id=${data.id}`,
    });
    Emitter.emit(EVENT_TYPES.OPEN_SHARE_CONTENT);
  };

  const handleDelete = () => {
    deleteBusinessPartnerResource(data.id);
  };

  return (
    <div
      className={clsx("business-partner-card", { add: type === CARD_TYPE.ADD })}
    >
      <div className="business-partner-card-content">
        <h3 className="business-partner-card-title">{title}</h3>
        <div>
          <div id={randomId} className="d-flex items-center">
            <p className="business-partner-card-desc">{description}</p>
          </div>
        </div>
        <div className="business-partner-card-topics">
          {topics?.map((item, index) => (
            <SpecialtyItem title={item} key={index} />
          ))}
        </div>
        <div id={randomId} className="d-flex items-center d-rigth">
          <span className="business-partner-card-desc">
            {getPublicationTime(createdAt)}
          </span>
        </div>
        <div className="business-partner-card-content-footer">
          <CustomButton
            className="filter-drawer-content-share"
            text="Join the conversation"
            size="md"
            type="primary"
            onClick={onJoin}
          />
        </div>
        {UserId === userProfile.id ? (
            <div>
              <Button size="md" type="secondary" onClick={handleEdit}>
                Edit
              </Button>
              <Button size="md" onClick={handleDelete}>
                Delete
              </Button>
            </div>
        ) : (
          <div style={{ minHeight: "32px" }} />
        )}
      </div>
    </div>
  );
};

BusinessPartnerCard.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  onAdd: PropTypes.func,
  onMenuClick: PropTypes.func,
};

BusinessPartnerCard.defaultProps = {
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

const mapDispatchToProps = {
  deleteBusinessPartnerResource,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerCard);
