import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Popover, Form, Input, 
  // Popconfirm 
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { isValidPassword } from "utils/format";

import { CustomButton, CustomModal, CustomInput } from "components";
import { EVENT_TYPES, USER_ROLES, INTERNAL_LINKS, 
  // STRIPE_PRICES 
} from "enum";
import Emitter from "services/emitter";
import SocketIO from "services/socket";
import { homeSelector } from "redux/selectors/homeSelector";
import { actions as authActions } from "redux/actions/auth-actions";
import { actions as homeActions } from "redux/actions/home-actions";
import UploadResumeModal from "../UploadResumeModal";
import AdvertisementPaymentModal from "../../containers/AdvertiserPaymentModal";
import SocketEventTypes from "enum/SocketEventTypes";

import "./style.scss";
import { getPortalSession, getSubscription } from "../../api/module/stripe";
import Modal from "antd/lib/modal/Modal";
import {
  setConversations,
  setCurrentConversations,
} from "redux/actions/conversation-actions";

const ProfileMenus = [];

const confirmPasswordRules = [
  {
    required: true,
    message: "Please confirm your password!",
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }

      return Promise.reject(new Error("The passwords do not match."));
    },
  }),
];

const ProfilePopupMenu = (props) => {
  const {
    className,
    children,
    logout,
    userProfile: user,
    changePassword,
    userProfile,
    acceptApply,
    setConversations,
    setCurrentConversations,
    updateUserPopUp,
    removeUser,
    ...rest
  } = props;

  const [visible, setVisible] = useState(false);
  const [portalSession, setPortalSession] = useState(null);
  // const [visibleModalEvent, setVisibleModalEvent] = useState(false)
  const [subscription, setSubscription] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [visibleConfirmApply, setVisibleConfirmApply] = useState(false);
  const [showPremiumFirewall, setShowPremiumFirewall] = useState(false);
  const [showProfileCompletionFirewall, setShowProfileCompletionFirewall] =
    useState(false);
  const [isAdvertisementModalVisible, setIsAdvertisementModalVisible] =
    useState(false);

  const history = useHistory();

  const [form] = Form.useForm();
  let applyState;

  useEffect(() => {
    async function loadSubscription() {
      if (!subscription) {
        try {
          let response = await getSubscription();
          setSubscription(response.data.subscription);
        } catch (error) {
          console.log(error);
        }
      }
    }

    loadSubscription();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (portalSession) {
      window.open(portalSession.url, "_blank");
    }
  }, [portalSession]);

  const createPortalSession = async () => {
    try {
      let response = await getPortalSession();

      setPortalSession(response.data.session);
    } catch (err) {
      console.log(err);
    }
  };

  const onViewProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
    setVisible(false);
  };

  const onVisibleChange = (visible) => {
    setVisible(visible);
  };

  const onLogout = () => {
    updateUserPopUp({
      bul: true, 
      lastDateSignOut: moment.utc().format(),
      idRequest: userProfile.id
    })
    SocketIO.emit(SocketEventTypes.USER_OFFLINE, {
      id: userProfile.id,
    });
    setConversations([]);
    setCurrentConversations([]);
    logout();
  };

  const onUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
    setVisible(false);
  };

  const openResumeModal = (flag) => {
    setShowResumeModal(flag);
    setVisible(false);
  };

  const openChangePasswordModal = (flag) => {
    setVisible(false);
    setShowChangePasswordModal(flag);
  };

  const handleOnFinish = (values) => {
    changePassword(userProfile.id, values.oldPassword, values.newPassword);
  };

  const onApplyBusinessPartner = () => {
    if (
      user.percentOfCompletion === 100 &&
      user.isBusinessPartner === "reject"
    ) {
      setVisibleConfirmApply(true);
    } else {
      setShowProfileCompletionFirewall(true);
    }
    if (
      user.isBusinessPartner === "accepted" &&
      user.memberShip !== "premium"
    ) {
      setShowPremiumFirewall(true);
    }
    if (
      user.isBusinessPartner === "accepted" &&
      user.memberShip === "premium"
    ) {
      history.push(INTERNAL_LINKS.BUSINESS_PARTNER);
    }
  };

  const message = () => {
    if (user.isBusinessPartner === "accepted")
      return "HR Business Partners Community";
    if (user.isBusinessPartner === "pending")
      return "Application to the HR Business Partner Community (Status: Pending)";
    if (user.isBusinessPartner === "reject")
      return "Application to the HR Business Partner Community";
  };

  const completeProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
  };

  const handleChange = (value) => {
    applyState = value;
  };

  const onApplyBusness = () => {
    acceptApply({ userId: userProfile.id, applyState });
  };

  const handlePartnersDashboard = () => {
    if (user.isAdvertiser) {
      history.push(INTERNAL_LINKS.SPONSOR_DASHBOARD);
    } else {
      setIsAdvertisementModalVisible(true);
    }
    setVisible(false);
  };

  const handleAdvertisementPaymentModalClose = () => {
    setIsAdvertisementModalVisible(false);
  };

  const TitleSection = () => (
    <div className="profile-popover-title" onClick={onViewProfile}>
      <div className="user-avatar">
        {user && user.img ? (
          <img src={user ? user.img : ""} alt="user-avatar" />
        ) : (
          (user || {}).abbrName
        )}
      </div>
      <div className="user-info">
        <p className="user-info-name">{`${user ? user.firstName || "" : ""} ${
          user ? user.lastName || "" : ""
        }`}</p>
        <p className="user-info-view">View / Update Profile</p>
      </div>
    </div>
  );

  const ContentSection = () => (
    <div className="profile-popover-content">
      {(user.memberShip === "premium" ||
        user.channelsSubscription === true ||
        user.recruiterSubscription === true) && (
        <div className="profile-popover-content-menu">
          <a
            href="/#"
            onClick={(e) => {
              e.preventDefault();
              createPortalSession();
            }}
            rel="noopener noreferrer"
            target="_blank"
          >
            Billing Information
          </a>
        </div>
      )}
      <div className="profile-popover-content-menu">
        {user.memberShip === "premium" ? (
          <React.Fragment>
            <div>PREMIUM MEMBER</div>
            {subscription ? (
              <>
                <div>
                  {moment
                    .unix(subscription?.current_period_start)
                    .format("MMMM DD, yyyy")}{" "}
                  -{" "}
                  {moment
                    .unix(subscription?.current_period_end)
                    .format("MMMM DD, yyyy")}
                </div>
              </>
            ) : null}
            {user.external_payment === 1 && (
              <>
                <div>
                  {moment(user.subscription_startdate).format("MMMM DD, yyyy")}{" "}
                  - {moment(user.subscription_enddate).format("MMMM DD, yyyy")}
                </div>
                {/* <div>
                  <a
                    href={portalSession.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Billing Information
                  </a>
                </div> */}
              </>
            )}
          </React.Fragment>
        ) : (
          <div>Free Membership</div>
        )}
      </div>
      {user.role !== USER_ROLES.CHANNEL_ADMIN &&
        user.channelsSubscription === false && (
          <div className="profile-popover-content-menu" onClick={onUpgrade}>
            Become a CREATOR
          </div>
        )}
      {user.channelsSubscription === true && (
        <div className="profile-popover-content-menu">
          <div>CREATOR</div>
          <div>
            {moment(user.channelsSubscription_startdate).format(
              "MMMM DD, yyyy"
            )}{" "}
            -{" "}
            {moment(user.channelsSubscription_enddate).format("MMMM DD, yyyy")}
          </div>
        </div>
      )}
      {user.recruiterSubscription !== true && (
        <div className="profile-popover-content-menu" onClick={onUpgrade}>
          Become a RECRUITER
        </div>
      )}
      {user.recruiterSubscription === true && (
        <div className="profile-popover-content-menu">
          <div>RECRUITER</div>
          <div>
            {moment(user.recruiterSubscription_startdate).format(
              "MMMM DD, yyyy"
            )}{" "}
            -{" "}
            {moment(user.recruiterSubscription_enddate).format("MMMM DD, yyyy")}
          </div>
        </div>
      )}
      {/* <div
        className="profile-popover-content-menu"
        onClick={() => setVisibleModalEvent(true)}
      >
        User Settings
      </div> */}
      <div
        className="profile-popover-content-menu"
        onClick={handlePartnersDashboard}
      >
        Partners Dashboard
      </div>
      <div
        className="profile-popover-content-menu"
        onClick={() => history.push(INTERNAL_LINKS.MY_LEARNINGS)}
      >
        My Learning
      </div>
      <div
        className="profile-popover-content-menu"
        onClick={() => openChangePasswordModal(true)}
      >
        Change Password
      </div>
      {user.councilMember && (
        <div
          className="profile-popover-content-menu"
          onClick={() => history.push(INTERNAL_LINKS.COUNCIL)}
        >
          Experts Council
        </div>
      )}
      {(user.role === 'admin') && (
        <div
          className="profile-popover-content-menu"
          onClick={() => history.push(INTERNAL_LINKS.COUNCIL_ADMIN)}
        >
          Events Council Admin
        </div>
      )}
      <div className="profile-popover-content-menu">
        <React.Fragment>
          <div onClick={onApplyBusinessPartner}>{message()}</div>
        </React.Fragment>
        {user.percentOfCompletion === 100 ? (
          <Modal
            visible={visibleConfirmApply}
            title="Application to the HR Business Partner Community"
            width={500}
            onCancel={() => setVisibleConfirmApply(false)}
            onOk={() => {
              onApplyBusness();
              setVisibleConfirmApply(false);
            }}
            okText="Confirm"
          >
            <p>
              Your application will be sent to Hacking HR when you click on
              confirm. Before confirming, please make sure your profile reflects
              your current title, company and other relevant information. We use
              the information in your profile to determine your participation in
              the Hacking HR's HR Business Partner Community. You will be
              notified within the next 48 hours.
            </p>
            <h5 className="business-partner-title">
              If you don't have the "HR Business Partner Title":
            </h5>
            <p>
              Please let us know here if you don't have the "official" title of
              HR Business Partner but still perform the high-level, strategic
              functions of an HR Business Partners. We will consider your
              application as well:
            </p>
            <Input.TextArea
              {...rest}
              rows={4}
              // className={clsx("custom-input", className, "mutiple", size)}
              onChange={(e) => handleChange(e.target.value)}
            />
          </Modal>
        ) : (
          <>
            {showProfileCompletionFirewall && (
              <div
                className="skill-cohort-firewall"
                onClick={() => setShowProfileCompletionFirewall(false)}
              >
                <div
                  className="upgrade-notification-panel"
                  onClick={completeProfile}
                >
                  <h3>
                    You must fully complete your profile before applying for the
                    HR Business Partners Community.
                  </h3>
                </div>
              </div>
            )}
          </>
        )}
        <>
          {showPremiumFirewall && (
            <div
              className="skill-cohort-firewall"
              onClick={() => setShowPremiumFirewall(false)}
            >
              <div className="upgrade-notification-panel">
                <h3>
                  You must be a premium member to see the business member
                  community page.
                </h3>
              </div>
            </div>
          )}
        </>
      </div>
      {/* {user.percentOfCompletion === 100 && (
        <div
          className="profile-popover-content-menu"
          onClick={() => openResumeModal(true)}
        >
          Upload your resume
        </div>
      )} */}
      {ProfileMenus.map((menu, index) => (
        <Link
          key={index}
          className="profile-popover-content-menu"
          to={menu.link}
          onClick={() => onVisibleChange(false)}
        >
          {menu.label}
        </Link>
      ))}
      <div className="profile-popover-content-footer">
        <CustomButton
          text="Log out"
          className="log-out"
          type="primary outlined"
          size="xs"
          onClick={onLogout}
        />
      </div>
      <UploadResumeModal
        visible={showResumeModal}
        onClose={() => openResumeModal(false)}
      />
      <CustomModal
        visible={showChangePasswordModal}
        title="Change Password"
        onCancel={() => openChangePasswordModal(false)}
        width={617}
      >
        <Form form={form} onFinish={handleOnFinish} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: "This field is required." }]}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            required={true}
            rules={[
              () => ({
                validator(rule, value) {
                  switch (isValidPassword(value)) {
                    case 0:
                      return Promise.resolve();
                    case 1:
                      return Promise.reject(
                        "Password length should be 8 or more!"
                      );
                    case 2:
                      return Promise.reject("Password should contain number!");
                    case 3:
                      return Promise.reject("Password should contain symbol!");
                    case 4:
                      return Promise.reject(
                        "Password should contain capital letter!"
                      );
                    case 5:
                      return Promise.reject("Please enter your password!");
                    default:
                      return Promise.reject("Something went wrong!");
                  }
                },
              }),
            ]}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={confirmPasswordRules}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item>
            <CustomButton text="Submit" type="primary" htmlType="submit" />
          </Form.Item>
        </Form>
      </CustomModal>
      <AdvertisementPaymentModal
        visible={isAdvertisementModalVisible}
        onClose={handleAdvertisementPaymentModalClose}
        userProfile={userProfile}
      />
    </div>
  );

  return (
    <>
      <Popover
        {...rest}
        className={clsx("profile-popover", className)}
        placement="bottomRight"
        trigger="click"
        visible={visible}
        title={<TitleSection />}
        content={<ContentSection />}
        onVisibleChange={onVisibleChange}
      >
        {children}
      </Popover>
      {/* <CustomModal
        visible={visibleModalEvent}
        title="User Settings"
        width={800}
        style={{marginTop: '100px'}}
        onCancel={() => setVisibleModalEvent(false)}
        okText="Confirm"
      >
        <h2 style={{paddingBottom: '10px'}}>Current Subscriptions</h2>
        {userProfile.memberShip === 'premium' && (
          <div style={{position:'relative'}}>
            <p style={{
              width:'100%',textAlign:'center',color:'#fe5621',fontWeight: '500',fontSize: '30px',marginBottom: '40px',marginTop: '10px'
            }}>Premium Account</p>
            <div style={{width:'100%',height:"80px",overflow:"hidden",display:'flex',justifyContent:'center',position:'absolute',top:'40px'}}>
              <div style={{transform:'translateY(-50%)',width:'400px',height:'40px',borderRadius: '100%',boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <div>
                <b style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{Math.abs(moment(userProfile.subscription_startdate).diff(moment(userProfile.subscription_enddate), 'days'))}</b>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Days Left</p>
              </div>
              <div>
                <p style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{STRIPE_PRICES.STRIPE_PRICES[0].price} $</p>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Renewal Amount</p>
              </div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <p style={{margin:'0px'}}><b>Date Suscription:</b> {moment(user.subscription_startdate).format("MMMM DD, yyyy")}{" "}-{" "}{moment(user.subscription_enddate).format("MMMM DD, yyyy")}</p>
            </div>
          </div>
        )}
        {userProfile.recruiterSubscription && (
          <div style={{position:'relative'}}>
            <p style={{
              width:'100%',textAlign:'center',color:'#fe5621',fontWeight: '500',fontSize: '30px',marginBottom: '40px',marginTop: '10px'
            }}>Recruiter Subscription</p>
            <div style={{width:'100%',height:"80px",overflow:"hidden",display:'flex',justifyContent:'center',position:'absolute',top:'40px'}}>
              <div style={{transform:'translateY(-50%)',width:'400px',height:'40px',borderRadius: '100%',boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <div>
                <b style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{Math.abs(moment(userProfile.recruiterSubscription_startdate).diff(moment(userProfile.recruiterSubscription_enddate), 'days'))}</b>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Days Left</p>
              </div>
              <div>
                <p style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{STRIPE_PRICES.RECRUITER_STRIPE_PRICES[0].price} $</p>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Renewal Amount</p>
              </div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <p style={{margin:'0px'}}><b>Date Suscription:</b> {moment(user.recruiterSubscription_startdate).format("MMMM DD, yyyy")}{" "}-{" "}{moment(user.recruiterSubscription_enddate).format("MMMM DD, yyyy")}</p>
            </div> 
          </div>
        )}
        {userProfile.channelsSubscription && (
          <div style={{position:'relative'}}>
            <p style={{
              width:'100%',textAlign:'center',color:'#fe5621',fontWeight: '500',fontSize: '30px',marginBottom: '40px',marginTop: '10px'
            }}>Channel Subscription</p>
            <div style={{width:'100%',height:"80px",overflow:"hidden",display:'flex',justifyContent:'center',position:'absolute',top:'40px'}}>
              <div style={{transform:'translateY(-50%)',width:'400px',height:'40px',borderRadius: '100%',boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <div>
                <b style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{Math.abs(moment(userProfile.channelsSubscription_startdate).diff(moment(userProfile.channelsSubscription_enddate), 'days'))}</b>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Days Left</p>
              </div>
              <div>
                <p style={{margin:'0px',textAlign:'center',fontSize:'40px',color:'#fe5621'}}>{STRIPE_PRICES.CHANNELS_STRIPE_PRICES[0].price} $</p>
                <p style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>Renewal Amount</p>
              </div>
            </div>
            <div style={{width:'100%',height:"auto",display:'flex',justifyContent:'space-around',flexDirection:'row',paddingBottom:'20px'}}>
              <p style={{margin:'0px'}}><b>Date Suscription:</b> {moment(userProfile.channelsSubscription_startdate).format("MMMM DD, yyyy")}{" "}-{" "}{moment(userProfile.channelsSubscription_enddate).format("MMMM DD, yyyy")}</p>
            </div>
          </div>
        )}
        <h2 style={{paddingBottom: '30px'}}>Change Password</h2>
        <Form form={form} onFinish={handleOnFinish} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: "This field is required." }]}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            required={true}
            rules={[
              () => ({
                validator(rule, value) {
                  switch (isValidPassword(value)) {
                    case 0:
                      return Promise.resolve();
                    case 1:
                      return Promise.reject(
                        "Password length should be 8 or more!"
                      );
                    case 2:
                      return Promise.reject("Password should contain number!");
                    case 3:
                      return Promise.reject("Password should contain symbol!");
                    case 4:
                      return Promise.reject(
                        "Password should contain capital letter!"
                      );
                    case 5:
                      return Promise.reject("Please enter your password!");
                    default:
                      return Promise.reject("Something went wrong!");
                  }
                },
              }),
            ]}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={confirmPasswordRules}
          >
            <CustomInput type="password" />
          </Form.Item>
          <Form.Item>
            <CustomButton text="Submit" type="primary" htmlType="submit" />
          </Form.Item>
        </Form>
        <h2 style={{paddingBottom: '30px',marginTop: '20px'}}>Remove User</h2>
        <Popconfirm
          title="Do you want to remove your account?"
          onConfirm={() => removeUser(() => {
            history.push(INTERNAL_LINKS.LOGIN);
          })}
        >
          <CustomButton text="Remove User" type="third" style={{marginBottom: '40px'}} />
        </Popconfirm>
      </CustomModal> */}
    </>
  );
};

ProfilePopupMenu.propTypes = {
  title: PropTypes.string,
  logout: PropTypes.func,
  showPremiumAlert: PropTypes.func,
};

ProfilePopupMenu.defaultProps = {
  title: "",
  logout: () => {},
  showPremiumAlert: () => {},
};

const mapStateToProps = (state) => homeSelector(state);

const mapDispatchToProps = {
  logout: authActions.logout,
  acceptApply: homeActions.acceptInvitationApply,
  setConversations,
  setCurrentConversations,
  ...homeActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePopupMenu);
