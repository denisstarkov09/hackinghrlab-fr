import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { homeSelector } from "redux/selectors/homeSelector";

import { CARD_TYPE, INTERNAL_LINKS } from "enum";

import { CustomButton } from "components";

import "./style.scss";

const CertificateCard = ({ data }) => {
  const [, setLineClamp] = useState(3);

  const history = useHistory();

  const { id, title, type, image2, period } =
    data || {};
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
  return (
    <div className={clsx("event-card", { add: type === CARD_TYPE.ADD })}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div className="event-card-img">
          {image2 && <img src={image2} alt="card-img" />}
        </div>
        <div className="event-card-content d-flex flex-column justify-between items-start">
          <h3>{title}</h3>
          <h5>{period}</h5>
        </div>
        <div className="certificate-card-content-footer">
          <CustomButton
            className="filter-drawer-content-share"
            text="Claim Digital Certificate"
            size="xs"
            type="primary"
            onClick={() =>
              history.push(`${INTERNAL_LINKS.EVENT_CERTIFICATE}?id=${id}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

CertificateCard.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  onAdd: PropTypes.func,
  onMenuClick: PropTypes.func,
};

CertificateCard.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CertificateCard);
