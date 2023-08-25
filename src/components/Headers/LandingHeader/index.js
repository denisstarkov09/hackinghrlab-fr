import React, {
  useState,
  // useEffect, 
  // useCallback
} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { INTERNAL_LINKS } from "enum";
import { CustomButton } from "components";
import IconMenu from "images/icon-menu-outline.svg";
// import IconMenu from "images/icon-menu-outline.svg";
import { homeSelector } from "redux/selectors/homeSelector";
import { Modal } from "antd";
import Login from "pages/Login2";
import { Link, useHistory } from "react-router-dom";

import LogoSidebar from "images/logo-sidebar.svg";
import { setRedirectFast } from "redux/actions/home-actions";
// import { PublicMenuPopup } from "components";
// import { PUBLIC_HEADER_MENUS } from "enum";

import "./style.scss";

const LandingHeader = ({
  setRedirectFast
}) => {

  const [bulModal, setBulModal] = useState(false)
  const [type, setType] = useState(false)

  const history = useHistory();

  return (
    <>
      <div
        className="lading-header-conference"
        style={{ width: "calc( 100% )" }}
      >
        <div className='public-header-left-conference'>
          <div className="hr-logo">
            <img src={LogoSidebar} alt="sidebar-logo" />
          </div>
        </div>
        <input id="checkbox" className="checkboxHiden" type="checkbox" style={{ zIndex: "100" }} />
        <label htmlFor="checkbox" className="conteiner-icon-menu">
          <img src={IconMenu} alt="icon-menu" />
        </label>
        <div className="public-header-right">
          <div className="public-conference-links">
            {(window.location.pathname.substring(0, 15) === INTERNAL_LINKS.CREATORS || window.location.pathname.substring(0, 15) === INTERNAL_LINKS.BLOGS_PAGUE) ?
              <Link
                to={INTERNAL_LINKS.LANDING_PAGUE}
                className="description-header"
              >Home</Link>
              :
              <a
                href="#home-segment"
                className="description-header"
              >Home</a>
            }
          </div>
          <div className="public-conference-links">
            {(window.location.pathname.substring(0, 15) === INTERNAL_LINKS.CREATORS || window.location.pathname.substring(0, 15) === INTERNAL_LINKS.BLOGS_PAGUE) ?
              <Link
                to={`${INTERNAL_LINKS.LANDING_PAGUE}?id=events-home-segment`}
                className="description-header"
              >Events</Link>
              :
              <a
                href="#events-home-segment"
                className="description-header"
              >Events</a>
            }
          </div>
          <div className="public-conference-links">
            {(window.location.pathname.substring(0, 15) === INTERNAL_LINKS.CREATORS || window.location.pathname.substring(0, 15) === INTERNAL_LINKS.BLOGS_PAGUE) ?
              <Link
                to={`${INTERNAL_LINKS.LANDING_PAGUE}?id=experts-home-segment`}
                className="description-header"
              >Experts Council</Link>
              :
              <a
                href="#experts-home-segment"
                className="description-header"
              >Experts Council</a>
            }
          </div>
          <div className="public-conference-links">
            <Link
              to={INTERNAL_LINKS.CREATORS}
              className="description-header"
            >Creators</Link>
          </div>
          <div className="public-conference-links">
            <Link
              to={INTERNAL_LINKS.BLOGS_PAGUE}
              className="description-header"
            >Blogs</Link>
          </div>
          <div className="hidden-button-situation">
            <CustomButton
              className="button-speaker"
              text={"Hacking HR LAB Sign In"}
              size="md"
              type={"primary"}
              style={{ padding: '5px', width: '220px', height: '50px' }}
              onClick={() => {
                if (localStorage.getItem("community") === null) {
                  setType(false)
                  setRedirectFast(true)
                  setBulModal(true)
                } else {
                  history.push(INTERNAL_LINKS.HOME)
                }

              }}
            />
          </div>
          <div className="hidden-button-situation">
            <CustomButton
              className="button-speaker"
              text={"Join The Community"}
              size="md"
              type={"primary"}
              style={{ padding: '5px', width: '200px', height: '50px' }}
              onClick={() => {
                if (localStorage.getItem("community") === null) {
                  setType(true)
                  setRedirectFast(true)
                  setBulModal(true)
                } else {
                  history.push(INTERNAL_LINKS.HOME)
                }
              }}
            />
          </div>
        </div>
        <div className="public-header-right-channel2">
          <CustomButton
            className="button-speaker"
            text={"Hacking HR LAB Sign In"}
            size="md"
            type={"primary"}
            style={{ padding: '5px', width: '220px', height: '50px' }}
            onClick={() => {
              if (localStorage.getItem("community") === null) {
                setType(false)
                setRedirectFast(true)
                setBulModal(true)
              } else {
                history.push(INTERNAL_LINKS.HOME)
              }

            }}
          />
          <CustomButton
            className="button-speaker"
            text={"Join The Community"}
            size="md"
            type={"primary"}
            style={{ padding: '5px', width: '200px', height: '50px' }}
            onClick={() => {
              if (localStorage.getItem("community") === null) {
                setType(true)
                setRedirectFast(true)
                setBulModal(true)
              } else {
                history.push(INTERNAL_LINKS.HOME)
              }
            }}
          />
        </div>
      </div>
      <div className="space-channel"></div>
      <Modal
        visible={bulModal}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => { setBulModal(false); setRedirectFast(false) }}
      >
        <Login
          login={!type}
          signup={type}
          type={'ladingPague'}
          history={null}
          confirm={() => { }}
          match={{ params: {} }}
          modal={() => { setBulModal(false); setRedirectFast(false) }}
          onClose={() => { setBulModal(false); setRedirectFast(false) }}
        />
      </Modal>
    </>
  );
};

LandingHeader.propTypes = {
  title: PropTypes.string,
};

LandingHeader.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setRedirectFast
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingHeader);
