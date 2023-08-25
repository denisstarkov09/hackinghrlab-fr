import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import Helmet from "react-helmet";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { Modal, Dropdown, Space, Menu, Carousel, Avatar, Tooltip } from "antd";
import moment from "moment";
import { isEmpty } from "lodash";
import GoogleMap from "./GoogleMaps";
import { loadStripe } from "@stripe/stripe-js";

import { getCheckoutSession } from "api/module/stripe";
import {
  capitalizeWord,
  convertToLocalTime,
  getEventPeriod,
} from "utils/format";
import Emitter from "services/emitter";
import { CustomButton, RichEdit, CollapseComponent } from "components";
import Login from "pages/Login2";
import { getEvent, addToMyEventList } from "redux/actions/event-actions";
import { getUser } from "redux/actions/home-actions";
import { eventSelector } from "redux/selectors/eventSelector";
import { authSelector } from "redux/selectors/authSelector";
import { envSelector } from "redux/selectors/envSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import MemberSpeakers from "./MembersSpeakers";
import Arrow from "../../images/arrow-conference.svg"

import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";

import { INTERNAL_LINKS, EVENT_TYPES } from "enum";

import "./style.scss";

const EventTypesData = {
  'presentation': "Presentation",
  'workshop': "Workshop",
  'panel': "Panel",
  'peer-to-peer': "Peer-to-Peer Conversation",
  'conference': "Conference"
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const PublicEventPage = ({
  match,
  updatedEvent,
  isAuthenticated,
  isMobile,
  getEvent,
  addToMyEventList,
  history,
  userProfile,
  getUser,
  getCouncilEvents,
  allCouncilEvents,
}) => {
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editor, setEditor] = useState("froala");
  const [showFirewall, setShowFirewall] = useState(false);
  const [eventCouncil, setEvent] = useState(undefined);
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(false);

  let userTimezone = moment.tz.guess();
  let clockAnimation
  let clockAnimation2

  if (userTimezone.includes("_")) {
    userTimezone = userTimezone.split("_").join(" ");
  }

  useEffect(() => {
    instanceStripe();
  }, []);

  const instanceStripe = async () => {
    setStripe(await stripePromise);
  };

  const onAttend = async () => {
    if (isAuthenticated) {
      if (updatedEvent.ticket === "premium") {
        if (!isEmpty(userProfile) && userProfile.memberShip === "premium") {
          const timezone = moment.tz.guess();
          addToMyEventList(updatedEvent, timezone);
          history.push(INTERNAL_LINKS.EVENTS);
        } else {
          setShowFirewall(true);
        }
      } else if (updatedEvent.ticket === "fee") {
        try {
          setLoading(true);
          let sessionData = await getCheckoutSession({
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
            event: {
              ...updatedEvent,
              userTimezone,
            },
            callback_url: window.location.href,
          });

          stripe.redirectToCheckout({ sessionId: sessionData.data.id });
        } catch (error) {
          console.log(error);
        }
      } else {
        const timezone = moment.tz.guess();
        addToMyEventList(updatedEvent, timezone);
        history.push(INTERNAL_LINKS.EVENTS);
      }
    } else {
      setModalVisible(true);
    }
  };

  let bulStatus = (eventCouncil?.status === 'active' || eventCouncil?.status === 'closed')

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCouncilEvents();
  }, [getCouncilEvents])

  useEffect(() => {
    if (updatedEvent.relationEventCouncil !== -1 || updatedEvent.relationEventCouncil) {
      const _event = allCouncilEvents.find((eve) => eve.id === Number(updatedEvent.relationEventCouncil));
      setEvent(_event);
    }
  }, [allCouncilEvents, updatedEvent, setEvent])

  useEffect(() => {
    if (updatedEvent.description && updatedEvent.description.blocks) {
      setEditor("draft");
    } else {
      setEditor("froala");
    }
  }, [updatedEvent]);

  useEffect(() => {
    let isMounted = true;
    if (match.params.id) {
      setCanonicalUrl(
        `${process.env.REACT_APP_DOMAIN_URL}${INTERNAL_LINKS.PUBLIC_EVENT}/${match.params.id}`
      );
      if (!isNaN(Number(match.params.id))) {
        getEvent(match.params.id, (error) => {
          if (isMounted && error) {
            history.push(INTERNAL_LINKS.NOT_FOUND);
          }
        });
      } else {
        history.push(INTERNAL_LINKS.NOT_FOUND);
      }
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planUpgrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onClickDownloadCalendar = (startDate, endDate, day, titleSession) => {
    const userTimezone = moment.tz.guess();

    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/event/ics/${updatedEvent.id}?day=${day}&title=${titleSession}&userTimezone=${userTimezone}&startTimeD=${startDate}&endTimeD=${endDate}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (startDate, endDate, titleSession) => {
    let textSelectGoogleCalendar = (titleSession !== undefined) ? titleSession : updatedEvent.title
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${textSelectGoogleCalendar}&dates=${startDate}/${endDate}&location=${updatedEvent.location}&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;

    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (startDate, endDate, titleSession) => {
    let textSelectYahooCalendar = (titleSession !== undefined) ? titleSession : updatedEvent.title
    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${startDate}&et=${endDate}&title=${textSelectYahooCalendar}&in_loc=${updatedEvent.location}`;
    window.open(yahooCalendarUrl, "_blank");
  };

  const handleOnClick = ({ item, key, domEvent }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();

    const [startTime, endTime, day, titleData] = item.props.value;

    const convertedStartTime = startTime.format("YYYYMMDDTHHmmss");

    const convertedEndTime = endTime.format("YYYYMMDDTHHmmss");

    switch (key) {
      case "1":
        onClickDownloadCalendar(startTime, endTime, day, titleData);
        break;
      case "2":
        onClickAddGoogleCalendar(convertedStartTime, convertedEndTime, titleData);
        break;
      case "3":
        onClickAddYahooCalendar(convertedStartTime, convertedEndTime, titleData);
        break;
      default:
    }
  };

  const downloadDropdownOptions = (startTimeD, endTimeDa, dayDDA, titleData) => {
    return (
      <Menu onClick={handleOnClick}>
        <Menu.Item key="1" value={[startTimeD, endTimeDa, dayDDA, titleData]}>
          Download ICS File
        </Menu.Item>
        <Menu.Item key="2" value={[startTimeD, endTimeDa, dayDDA, titleData]}>
          Add to Google Calendar
        </Menu.Item>
        <Menu.Item key="3" value={[startTimeD, endTimeDa, dayDDA, titleData]}>
          Add to Yahoo Calendar
        </Menu.Item>
      </Menu>
    );
  };

  const displayVenueLocation = !isEmpty(updatedEvent.venueAddress) && (
    <div>
      <h5>
        Venue Address:{" "}
        <a
          href={`http://maps.google.com/maps?q=${encodeURI(
            updatedEvent.venueAddress.formatted_address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {updatedEvent.venueAddress.formatted_address}
        </a>
      </h5>
      <GoogleMap
        lat={updatedEvent.venueAddress.lat}
        lng={updatedEvent.venueAddress.lng}
      />
    </div>
  );

  const functionOrderPanels = (panels) => {
    if (panels !== undefined) {

      let arrayFixed = []
      let num = -1
      let titlesDateReady

      const arrayOrderTime = panels.sort((a, b) => {

        let aTime = convertToLocalTime(a.startDate, eventCouncil?.timezone).format("YYYY")
        let bTime = convertToLocalTime(b.startDate,).format("YYYY")

        let aTimeRest = convertToLocalTime(a.startDate, eventCouncil?.timezone).format("MMDDHHmm")
        let bTimeRest = convertToLocalTime(b.startDate, eventCouncil?.timezone).format("MMDDHHmm")

        return Number(bTime - bTimeRest) - Number(aTime - aTimeRest)

      })

      for (let i = 0; i < arrayOrderTime.length; i++) {
        let dateNow = arrayOrderTime[i].startDate
        let timezone = eventCouncil?.timezone
        if ((titlesDateReady !== convertToLocalTime(dateNow, timezone).format().substring(0, 10))) {
          titlesDateReady = convertToLocalTime(dateNow, timezone).format().substring(0, 10)
          num++
          if (!arrayFixed[num]) {
            arrayFixed.push([])
          }
          arrayFixed[num].push(arrayOrderTime[i])
        } else {
          arrayFixed[num].push(arrayOrderTime[i])
        }
      }


      return arrayFixed
    } else {
      return panels
    }
  }

  const content = (panels) => {

    let startTime = convertToLocalTime(panels?.startDate, eventCouncil?.timezone);
    let endTime = convertToLocalTime(panels?.endDate, eventCouncil?.timezone);

    return (
      <div className="content-collapse" key={panels?.id}>
        <p
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session</b>: {panels?.panelName}
        </p>
        <p
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session Date</b>:{` ${startTime.format("LL")}`}
        </p>
        <p className="title-collapse"
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session Start Time:</b> {startTime.format("HH:mm")} {moment.tz.guess()}
        </p>
        <p className="title-collapse"
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session End Time:</b> {endTime.format("HH:mm")} {moment.tz.guess()}
        </p>
        {(panels?.typePanel?.length !== 0) && <p className="title-collapse"
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session type:</b> {(EventTypesData !== undefined) && panels?.typePanel?.map((category, index) => (
            <span>{capitalizeWord(EventTypesData[category])} {panels?.typePanel[index + 1] && `| `}</span>
          ))}
        </p>}
        <Space direction="vertical">
          <div className="d-flex calendar">
            <Space
              size="middle"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {`${startTime.format("MMMM DD")} From ${startTime.format(
                "HH:mm a"
              )} to ${endTime.format("HH:mm a")} (${userTimezone})`}
              <Dropdown
                overlay={downloadDropdownOptions(
                  startTime,
                  endTime,
                  1,
                  panels?.panelName
                )}
              >
                <a
                  href="/#"
                  className="ant-dropdown-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Space>
                    {"Download Calendar"}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Space>
          </div>
        </Space>
        <div className="ajust-contain" style={{ paddingTop: '20px' }}>
          {panels?.CouncilEventPanelists.filter((user) => user.isModerator === false)?.map((user) => {
            return (
              <MemberSpeakers
                key={user?.id}
                usersPanel={user}
              />
            )
          })}
        </div>
        <div className="ajust-contain-22">
          {panels?.CouncilEventPanelists.filter((user) => user.isModerator === true)?.map((user) => {
            return (
              <MemberSpeakers
                key={user?.id}
                usersPanel={user}
              />
            )
          })}
        </div>
      </div>
    )
  }

  const activeCollapse = (e) => {
    let targetContainer = e?.target?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]
    let targetHeight = e?.target?.parentElement?.parentElement?.parentElement?.children[1]
    let targetContainerHeight = targetContainer?.clientHeight

    targetHeight.style.cssText = `height: ${targetContainerHeight}px;`

    if (e.target.className === "arrow-title") {
      clearTimeout(clockAnimation)
      clockAnimation2 = setTimeout(() => {
        targetHeight.style.cssText = `height: auto;`
      }, 500);
      targetContainer.style.cssText = 'position:relative;'
      e.target.className = "arrow-title-change"
      targetContainer.className = "container-collapse-title"
    } else {
      clockAnimation = setTimeout(() => {
        targetContainer.style.cssText = 'position:absolute;'
      }, 490);
      clearTimeout(clockAnimation2)
      setTimeout(() => {
        targetHeight.style.cssText = `height: 0px;`
      }, 10);
      e.target.className = "arrow-title"
      targetContainer.className = "container-collapse-title-change"
    }
  }

  const allPanelsConcil = functionOrderPanels(eventCouncil?.CouncilEventPanels)?.map((panels, index) => {

    let startTime = convertToLocalTime(panels[0]?.startDate, eventCouncil?.timezone)

    return (
      <div key={index} id={index}>
        <p className="title-date">
          <div className="container-arrow-title">
            <img src={Arrow} className="arrow-title" alt="arrow-title" onClick={(e) => activeCollapse(e)} />
          </div>
          {startTime.format("dddd, MMMM DD")}<sup>{startTime.format("Do").slice(-2)}</sup>
        </p>
        <div className="data-height" style={{ height: "0px" }}>
          <div className="container-collapse-title-change" style={{ position: "absolute" }}>
            {panels?.map((panel) => {
              return (
                <CollapseComponent
                  index={panel?.id}
                  informationCollapse={content(panel)}
                  buttons={<div></div>}
                  className={"container-panel"}
                  bulShowMore={false}
                  bulMessage={(panel?.type === "Simulations") ? false : true}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="public-event-page">
      {showFirewall && (
        <div
          className="event-card-firewall"
          onClick={() => setShowFirewall(false)}
        >
          <div className="upgrade-notification-panel" onClick={planUpgrade}>
            <h3>
              This event requires a PREMIUM Membership to join. Click here to
              upgrate to a Premium Membership and get unlimited access to the
              LAB features.
            </h3>
          </div>
        </div>
      )}
      <Helmet>
        <title>{updatedEvent.title}</title>
        <meta name="description" content={updatedEvent.about} />
        <meta name="twitter:creator" />
        <meta
          name="twitter:image"
          content={updatedEvent.image || updatedEvent.image2}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={updatedEvent.title} />
        <meta property="og:description" content={updatedEvent.about} />
        <meta
          property="og:image"
          content={updatedEvent.image || updatedEvent.image2}
        />
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="image_src"
          href={updatedEvent.image || updatedEvent.image2}
        />
      </Helmet>
      <div className="public-event-page-header">
        {!isEmpty(updatedEvent.images) && (
          <Carousel autoplay dots>
            {updatedEvent.images.map((image) => (
              <img src={image} alt="updatedEvent-img" key={image} />
            ))}
          </Carousel>
        )}
        {isEmpty(updatedEvent.images) &&
          !updatedEvent.image2 &&
          updatedEvent.image && (
            <img src={updatedEvent.image} alt="updatedEvent-img" />
          )}
        {isEmpty(updatedEvent.images) &&
          !updatedEvent.image &&
          updatedEvent.image2 && (
            <img src={updatedEvent.image2} alt="updatedEvent-img" />
          )}
        {isEmpty(updatedEvent.images) &&
          !updatedEvent.image &&
          !updatedEvent.image2 && (
            <div className="public-event-page-header-defaultimg" />
          )}
        <div className="public-event-page-header-title">
          <Modal
            visible={modalVisible}
            footer={null}
            width={400}
            bodyStyle={{ overflow: "auto", padding: "20px" }}
            className="modal-container-login"
            onCancel={onCancelModal}
          >
            <Login
              login={true}
              signUp={false}
              history={null}
              match={{ params: {} }}
              onClose={onCancelModal}
            />
          </Modal>
        </div>
      </div>
      <div className="public-event-page-content">
        <div className="public-event-page-content-calendar">
          {updatedEvent.status === "attend" && (
            <CustomButton
              text="REGISTER HERE"
              size={isMobile ? "md" : "lg"}
              type="primary"
              onClick={onAttend}
              loading={loading}
            />
          )}
          {updatedEvent.status === "going" && (
            <div
              className="going-label"
              style={{ marginRight: "1rem", color: "#00b574" }}
            >
              <CheckOutlined />
              <span>I'm going</span>
            </div>
          )}
          {updatedEvent.status === "going" && isAuthenticated && (
            <>
              <Space direction="vertical">
                {updatedEvent?.startAndEndTimes?.map((time, index) => {
                  const startTime = convertToLocalTime(
                    time.startTime,
                    updatedEvent.timezone
                  );
                  const endTime = convertToLocalTime(
                    time?.endTime,
                    updatedEvent.timezone
                  );

                  return (
                    <div className="d-flex calendar" key={index}>
                      <Space
                        size="middle"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        {`${startTime.format("MMMM DD")} From ${startTime.format(
                          "HH:mm a"
                        )} to ${endTime.format("HH:mm a")} (${userTimezone})`}
                        <Dropdown
                          overlay={downloadDropdownOptions(
                            startTime,
                            endTime,
                            index
                          )}
                        >
                          <a
                            href="/#"
                            className="ant-dropdown-link"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Space>
                              {updatedEvent?.startAndEndTimes.length > 1
                                ? `Download Calendar Day ${index + 1}: ${moment(
                                  startTime
                                ).format("MMM DD")} `
                                : "Download Calendar"}
                              <DownOutlined />
                            </Space>
                          </a>
                        </Dropdown>
                      </Space>
                    </div>
                  );
                })}
              </Space>
              {/* <div style={{
                background: '#00b574', color: 'white', height: '40px', width: '400px', padding: '10px', fontWeight: '700', fontSize: '20px', borderRadius: '5px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'
              }}>
                You are now registered for this event!
              </div> */}
            </>
          )}
        </div>
        <h1
          className={clsx("event-title", {
            "no-image": !updatedEvent.image2 && !updatedEvent.image,
          })}
        >
          {updatedEvent.title}
        </h1>

        <h5 className="event-card-topic-title">
          {`Event date${updatedEvent.startDate !== updatedEvent.endDate ? "s" : ""
            }:`}
          <span>
            {" "}
            {getEventPeriod(
              updatedEvent.startDate,
              updatedEvent.endDate,
              updatedEvent.timezone
            )}
          </span>
        </h5>
        {updatedEvent.location && (
          <>
            <h5 className="event-card-topic-title">
              Event Type:{" "}
              <span>
                {updatedEvent.location.map((loc, index) => {
                  if (loc === "online") {
                    return (
                      <>
                        Online {updatedEvent.location[index + 1] ? "and " : ""}
                      </>
                    );
                  }

                  return (
                    <>
                      In Person {updatedEvent.location[index + 1] ? "and " : ""}
                    </>
                  );
                })}
              </span>
            </h5>
          </>
        )}
        {updatedEvent.ticket && (
          <h5 className="event-card-topic-title">
            Event tickets:
            <span>
              {updatedEvent.ticket === "fee"
                ? `$${updatedEvent.ticketFee} Registration fee`
                : updatedEvent.ticket === "premium"
                  ? "Only PREMIUM members"
                  : capitalizeWord(updatedEvent.ticket)}
            </span>
          </h5>
        )}

        {updatedEvent.type && (
          <>
            <h5 className="event-card-topic-title">
              Content delivery format:
              {updatedEvent.type.map((tp, index) => (
                <span>
                  {capitalizeWord(tp)} {updatedEvent.type[index + 1] && `|`}
                </span>
              ))}
            </h5>
          </>
        )}

        {updatedEvent.categories && updatedEvent.categories.length > 0 && (
          <h5 className="event-card-topic-title">
            Event topics:
            {updatedEvent.categories.map((tp, index) => (
              <span>
                {capitalizeWord(tp)} {updatedEvent.categories[index + 1] && `|`}
              </span>
            ))}
          </h5>
        )}
        {displayVenueLocation}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {updatedEvent.status === "going" && isAuthenticated && (
            <div style={{
              background: '#00b574', color: 'white', height: '40px', width: '400px', padding: '10px', fontWeight: '700', fontSize: '20px', borderRadius: '5px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'
            }}>
              You are now registered for this event!
            </div>
          )}
        </div>
      </div>

      {updatedEvent.description && (
        <div className="public-event-page-description">
          <h1 className="event-title">Description</h1>
          {editor === "froala" ? (
            <div
              className="event-description"
              dangerouslySetInnerHTML={{
                __html: (updatedEvent.description || {}).html || "",
              }}
            />
          ) : (
            <RichEdit data={updatedEvent.description} />
          )}
          {updatedEvent.status === "attend" && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CustomButton
                text="REGISTER HERE"
                size={isMobile ? "md" : "lg"}
                type="primary"
                onClick={onAttend}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}

      {updatedEvent.EventInstructors?.length > 0 && (
        <div className="public-event-page-instructors">
          <h1 className="event-title">Speakers</h1>
          <div className="event-people">
            {updatedEvent.EventInstructors.map((eventInstructor) => {
              const instructor = eventInstructor.Instructor;

              return (
                <div className="event-instructor">
                  <Avatar
                    src={instructor.image}
                    alt="instructor-image"
                    size={128}
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "flex",
                    }}
                  />
                  <div className="event-instructor-name">{instructor.name}</div>
                  <Tooltip title={instructor.description}>
                    <div className="event-instructor-name truncate">
                      {instructor.description}
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
          {updatedEvent.status === "attend" && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CustomButton
                text="REGISTER HERE"
                size={isMobile ? "md" : "lg"}
                type="primary"
                onClick={onAttend}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}

      {(updatedEvent.relationEventCouncil !== -1 && bulStatus) && (
        <>
          <div className="public-event-page-content" style={{ marginTop: '15px', paddingBottom: '100px' }}>
            <h1 className="event-title">Agenda</h1>
            {allPanelsConcil}
          </div>
          {(updatedEvent.status === "attend" && <div className="public-event-page-content" style={{ position: 'relative', clipPath: 'polygon(0 31%, 100% 31%, 100% 100%, 0% 100%)', top: '-10%' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CustomButton
                text="REGISTER HERE"
                size={isMobile ? "md" : "lg"}
                type="primary"
                onClick={onAttend}
                loading={loading}
              />
            </div>

          </div>)}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  updatedEvent: eventSelector(state).updatedEvent,
  isAuthenticated: authSelector(state).isAuthenticated,
  isMobile: envSelector(state).isMobile,
  userProfile: homeSelector(state).userProfile,
  ...councilEventSelector(state),
});

const mapDispatchToProps = {
  getEvent,
  addToMyEventList,
  getUser,
  ...councilEventActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicEventPage);
