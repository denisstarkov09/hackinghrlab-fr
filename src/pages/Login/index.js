import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import moment from "moment-timezone";

import { EVENT_TYPES } from "enum";
import { CustomButton } from "components";
import Emitter from "services/emitter";
import { loadStripe } from "@stripe/stripe-js";
import { setBulRegister } from "redux/actions/speaker-actions"

import { getCheckoutSession } from "api/module/stripe";
import {
  updateUserPopUp
} from "redux/actions/home-actions";

import { getUser } from "redux/actions/home-actions";
import { actions as authActions } from "redux/actions/auth-actions";
import { acceptInvitation } from "redux/actions/home-actions";
import { authSelector } from "redux/selectors/authSelector";
import { addToMyEventList } from "redux/actions/event-actions";
import { eventSelector } from "redux/selectors/eventSelector";
import { liveSelector } from "redux/selectors/liveSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { INTERNAL_LINKS } from "enum";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthAlert from "containers/AuthAlert";

import IconLogo from "images/logo-sidebar.svg";
import IconBack from "images/icon-back.svg";
import IconPlus from "images/icon-plus.svg";

import "./style.scss";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const Login = ({
  isAuthenticated,
  error,
  login,
  signUp,
  logout,
  isInvitation,
  history,
  match,
  signup,
  updatedEvent,
  addToMyEventList,
  onClose,
  live,
  userProfile,
  modal,
  updateUserPopUp,
  setBulRegister,
  confirm
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showFirewall, setShowFirewall] = useState(false);

  const [signupStep, setSignupStep] = useState(0);
  const [prevAreaValues, setPrevAreaVaues] = useState([]);
  const [signupValues, setSignupValues] = useState({});

  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    instanceStripe();
  }, []);

  const instanceStripe = async () => {
    setStripe(await stripePromise);
  };

  const refForm = React.useRef(null);

  const onFinish = (values) => {
    if (isLogin) {
      const { email, password } = values;
      login(email, password, (suc, err) => {
        if(!err){
          setBulRegister(true)
          confirm()
        }
      });
    } else {
      let newSignupValues = {
        ...signupValues,
        ...values,
      };
      setSignupValues(newSignupValues);
      if (signupStep !== 3) {
        setSignupStep(signupStep + 1);
      }
      if (signupStep === 3) {
        if (isInvitation) {
          newSignupValues = {
            ...newSignupValues,
            hostUserId: match.params.hostUserId,
          };
        }
        signUp({ ...newSignupValues });
      }
    }
  };

  const onFinishFailed = () => {};

  const onValuesChange = (values) => {
    if (values && values.recentWorkArea !== undefined) {
      if (
        !prevAreaValues.includes("all") &&
        values.recentWorkArea.includes("all")
      ) {
        if (refForm && refForm.current) {
          refForm.current.setFieldsValue({
            recentWorkArea: ["all"],
          });
          setPrevAreaVaues(["all"]);
        }
      } else if (
        prevAreaValues.includes("all") &&
        values.recentWorkArea.includes("all")
      ) {
        if (refForm && refForm.current) {
          refForm.current.setFieldsValue({
            recentWorkArea: values.recentWorkArea.filter((v) => v !== "all"),
          });
          setPrevAreaVaues(values.recentWorkArea.filter((v) => v !== "all"));
        }
      }
    }
  };

  const onChangeType = () => {
    setIsLogin((prev) => !prev);
  };

  const planUpgrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onBackSignup = () => {
    setSignupStep(Math.max(signupStep - 1, 0));
  };

  useEffect(() => {
    if (history != null) {
      if (history.location.pathname.includes("/invitation")) {
        updateUserPopUp({
          bul: true, 
          lastDateSignOut: moment.utc().format(),
          idRequest: userProfile?.id
        })
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, logout, updateUserPopUp]);

  useEffect(() => {
    if(window.location.pathname.substring(0,15) !== INTERNAL_LINKS.CONFERENCE_2023){
      if (isAuthenticated) {
        if (history != null) {
          if (live && live.live === true) {
            history.push(INTERNAL_LINKS.LIVE);
          } else {
            history.push(INTERNAL_LINKS.HOME);
          }
        } else {
          if (updatedEvent.ticket === "premium") {
            if (!isEmpty(userProfile) && userProfile.memberShip === "premium") {
              setShowFirewall(false);
              addToMyEventList(updatedEvent);
              if (onClose) {
                onClose();
              }
            } else {
              setShowFirewall(true);
            }
          } else if (updatedEvent.ticket === "fee") {
            setLoading(true);

            const userTimezone = moment.tz.guess();

            getCheckoutSession({
              prices: [
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: updatedEvent.title,
                    },
                    unit_amount: `${updatedEvent.ticketFee}00`,
                  },
                },
              ],
              isPaidEvent: true,
              event: { ...updatedEvent, userTimezone },
              callback_url: window.location.href,
            }).then((sessionData) =>
              stripe.redirectToCheckout({ sessionId: sessionData.data.id })
            );
          } else {
            addToMyEventList(updatedEvent);
            if (onClose) {
              onClose();
            }
          }
        }
      }
    }else{
      if (isAuthenticated) {
        if (onClose) {
          onClose();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    setIsLogin(!signup);

    return () => {};
  }, [signup]);

  const closeFirewall = () => {
    setShowFirewall(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="login-page">
      {(window.location.pathname !== INTERNAL_LINKS.LOGIN) && (
        <div className="container-icon-close" style={isLogin ? {clipPath: "polygon(0% 0, 100% 0, 100% 30%, 0% 30%)"} : {clipPath: "polygon(0% 0, 100% 0, 100% 20%, 0% 20%)"}}>
          <img className="icon-close" onClick={() => {modal(false)}} src={IconPlus} alt="icon-close" style={isLogin ? {marginBottom: "360px"} : {marginBottom:"550px"}} />
        </div>
      )}
      {showFirewall && (
        <div className="event-card-firewall" onClick={closeFirewall}>
          <div className="upgrade-notification-panel" onClick={planUpgrade}>
            <h3>
              This event requires a PREMIUM Membership to join. Click here to
              upgrate to a Premium Membership and get unlimited access to the
              LAB features.
            </h3>
          </div>
        </div>
      )}
      <div className="login-dialog">
        <div className="login-dialog-header">
          <h3>{isLogin ? "Log In" : "Sign up"}</h3>
          <div className="login-dialog-logo">
            <img src={IconLogo} alt="login-logo" />
          </div>
        </div>

        {match.params.sentEmail === "passwordRecoverySent" && (
          <AuthAlert
            title="Check your inbox"
            message="We will send you an email with the instructions on how to reset your password."
          />
        )}

        <Form
          ref={refForm}
          layout="vertical"
          className="login-dialog-form"
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <div className="login-dialog-content">
            {!isLogin && signupStep > 0 && (
              <div className="login-dialog-content-back" onClick={onBackSignup}>
                <img src={IconBack} alt="icon-back" />
              </div>
            )}
            {isLogin ? <LoginForm /> : <SignupForm step={signupStep} />}
          </div>
          <div className="login-dialog-footer">
            <span className="login-dialog-footer-error">{error}</span>
            <CustomButton
              htmlType="submit"
              text={isLogin ? "Log In" : signupStep === 3 ? "Sign up" : "Next"}
              type="primary"
              size="lg"
              loading={loading}
            />
            <div className="login-dialog-footer-bottom">
              <Link
                to={INTERNAL_LINKS.PASSWORD_RECOVERY}
                className="forgot-password"
              >
                Forgot password?
              </Link>
              <div className="login-dialog-footer-category">
                <span className="account-desc">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <span className="signup-select" onClick={onChangeType}>
                  {isLogin ? "Sign up?" : "Log in?"}
                </span>
              </div>
              <div className="term-and-conditions">
                <Link to={INTERNAL_LINKS.TERMSOFUSE}>Terms and Conditions</Link>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onClose: PropTypes.func,
  modal: PropTypes.func,
  confirm: PropTypes.func
};

Login.defaultProps = {
  onClose: () => {},
  modal: () => {},
  confirm: () => {}
};

const mapStateToProps = (state) => ({
  isAuthenticated: authSelector(state).isAuthenticated,
  error: authSelector(state).error,
  updatedEvent: eventSelector(state).updatedEvent,
  live: liveSelector(state).live,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...authActions,
  logout: authActions.logout,
  addToMyEventList,
  getUser,
  acceptInvitation,
  setBulRegister,
  updateUserPopUp
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
