import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, Dropdown, Menu, Space, Tooltip } from "antd";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import moment from "moment-timezone";
import { categorySelector } from "redux/selectors/categorySelector";
import { loadStripe } from "@stripe/stripe-js";

import { getCheckoutSession } from "api/module/stripe";

import { DateAvatar, CustomButton, CustomDrawer, RichEdit, CollapseComponent } from "components";
import { EVENT_TYPES, MONTH_NAMES } from "enum";
import Emitter from "services/emitter";
import {
  actions as eventActions,
  getChannelEvents,
  setEvent,
} from "redux/actions/event-actions";
import { eventSelector } from "redux/selectors/eventSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";

import MemberSpeakers from "./MembersSpeakers";
import Arrow from "../../images/arrow-conference.svg"

import {
  convertToLocalTime,
  convertToCertainTime,
  capitalizeWord,
} from "utils/format";

import "./style.scss";
import { channelSelector } from "redux/selectors/channelSelector";

const EventTypesData = {
  'presentation': "Presentation",
  'workshop': "Workshop",
  'panel': "Panel",
  'peer-to-peer': "Peer-to-Peer Conversation",
  'conference': "Conference"
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const EventDrawer = ({
  addToMyEventList,
  removeFromMyEventList,
  updatedEvent,
  visible,
  event,
  userProfile,
  onClose,
  filter,
  getChannelEvents,
  channel,
  onConfirmCredit,
  allCategories,
  allCouncilEvents,
}) => {
  const [editor, setEditor] = useState("froala");
  const [showFirewall, setShowFirewall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [eventCouncil, setEvent2] = useState(undefined);
  const DataFormat = "YYYY.MM.DD hh:mm A";
  const [dataCategoriesState, setDataCategoriesState] = useState()

  let userTimezone = moment.tz.guess();
  let bulStatus = (eventCouncil?.status === 'active' || eventCouncil?.status === 'closed')

  if (userTimezone.includes("_")) {
    userTimezone = userTimezone.split("_").join(" ");
  }

  let clockAnimation
  let clockAnimation2

  useEffect(() => {
    if (event.relationEventCouncil !== -1 || event.relationEventCouncil) {
      const _event = allCouncilEvents?.find((eve) => eve.id === Number(event.relationEventCouncil));
      setEvent2(_event);
    }
  }, [allCouncilEvents, event, setEvent2])

  useEffect(() => {
    let objectAllCategories = {}

    allCategories.forEach((category) => {
      objectAllCategories[`${category.value}`] = category.title
    })

    setDataCategoriesState(objectAllCategories)
  }, [allCategories, setDataCategoriesState])



  const onDrawerClose = () => {
    setShowFirewall(false);
    onClose();
  };

  useEffect(() => {
    instanceStripe();
  }, []);

  const instanceStripe = async () => {
    setStripe(await stripePromise);
  };

  const onAttend = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const userTimezone = moment.tz.guess();

    if (event.ticket === "premium") {
      if (userProfile && userProfile.memberShip === "premium") {
        addToMyEventList(event, userTimezone, () => {
          getChannelEvents({ ...filter, channel: channel.id });
        });
      } else {
        setShowFirewall(true);
      }
    } else if (event.ticket === "fee") {
      setLoading(true);

      let sessionData = await getCheckoutSession({
        prices: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: event.title,
              },
              unit_amount: `${event.ticketFee}00`,
            },
          },
        ],
        isPaidEvent: true,
        event: {
          ...event,
          userTimezone,
        },
        callback_url: window.location.href,
      });

      stripe.redirectToCheckout({ sessionId: sessionData.data.id });
    } else {
      addToMyEventList(event, userTimezone, () => {
        getChannelEvents({ ...filter, channel: channel.id });
      });
    }
    if (window.location.pathname.includes("channels")) {
      window.open(event.externalLink, "_blank");
    }
  };

  const onCancelAttend = () => {
    removeFromMyEventList(event);
  };

  // const onClickClaimDigitalCertificate = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   window.open(
  //     `${INTERNAL_LINKS.CERTIFICATE}/${this.props.data.id}`,
  //     "_blank"
  //   );
  // };

  const onClickConfirm = (e) => {
    Emitter.emit(EVENT_TYPES.OPEN_ATTENDANCE_DISCLAIMER, event);
  };

  const onClickClaimCredits = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onConfirmCredit(event);
  };

  const onClickDownloadCalendar = (startDate, endDate, day, titleSession) => {
    const userTimezone = moment.tz.guess();

    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/event/ics/${event.id}?day=${day}&title=${titleSession}&userTimezone=${userTimezone}&startTimeD=${startDate}&endTimeD=${endDate}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (startDate, endDate, titleSession) => {
    let textSelectGoogleCalendar = (titleSession !== undefined) ? titleSession : event.title
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${textSelectGoogleCalendar}&dates=${startDate}/${endDate}&location=${event.location}&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;

    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (startDate, endDate, titleSession) => {
    let textSelectYahooCalendar = (titleSession !== undefined) ? titleSession : event.title
    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${startDate}&et=${endDate}&title=${textSelectYahooCalendar}&in_loc=${event.location}`;
    window.open(yahooCalendarUrl, "_blank");
  };

  const handleOnClick = ({ item, key, domEvent }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();

    const [startTime, endTime, day, titleData] = item.props.value;

    const { timezone } = event;

    const convertedStartTime = convertToLocalTime(startTime, timezone).format(
      "YYYYMMDDTHHmmss"
    );

    const convertedEndTime = convertToLocalTime(endTime, timezone).format(
      "YYYYMMDDTHHmmss"
    );

    switch (key) {
      case "1":
        onClickDownloadCalendar(convertToLocalTime(startTime, timezone), convertToLocalTime(endTime, timezone), day, titleData);
        break;
      case "2":
        onClickAddGoogleCalendar(convertedStartTime, convertedEndTime, titleData);
        break;
      case "3":
        onClickAddYahooCalendar(convertedStartTime, convertedEndTime, titleData);
        break;
      default:
      //
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

  const planUpgrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  useEffect(() => {
    if (event.description && event.description.blocks) {
      setEditor("draft");
    } else {
      setEditor("froala");
    }
  }, [event]);

  useEffect(() => {
    if (event && updatedEvent && event.id === updatedEvent.id) {
      setEvent({
        ...updatedEvent,
        day: moment(updatedEvent.date, DataFormat).date(),
        month: MONTH_NAMES[moment(updatedEvent.date, DataFormat).month()],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedEvent, event]);

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
    let startTimeTRA = convertToLocalTime(panels?.startDate, eventCouncil?.timezone);
    let endTimeTRA = convertToLocalTime(panels?.endDate, eventCouncil?.timezone);

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
          <b>Session Date</b>:{` ${startTimeTRA.format("LL")}`}
        </p>
        <p className="title-collapse"
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session Start Time:</b> {startTimeTRA.format("HH:mm")} {moment.tz.guess()}
        </p>
        <p className="title-collapse"
          style={{ margin: '0px', marginTop: '3px' }}
        >
          <b>Session End Time:</b> {endTimeTRA.format("HH:mm")} {moment.tz.guess()}
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
              {`${startTimeTRA.format("MMMM DD")} From ${startTimeTRA.format(
                "HH:mm a"
              )} to ${endTimeTRA.format("HH:mm a")} (${userTimezone})`}
              <Dropdown
                overlay={downloadDropdownOptions(
                  panels?.startDate,
                  panels?.endDate,
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
        <div className="ajust-contain">
          {panels?.CouncilEventPanelists?.filter((user) => user.isModerator === false)?.map((user) => {
            return (
              <MemberSpeakers
                key={user?.id}
                usersPanel={user}
              />
            )
          })}
        </div>
        <div className="ajust-contain-2">
          {panels?.CouncilEventPanelists?.filter((user) => user.isModerator === true)?.map((user) => {
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

  let allPanelsConcil = functionOrderPanels(eventCouncil?.CouncilEventPanels)?.map((panels, index) => {

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
    <CustomDrawer
      title={""}
      width={772}
      visible={visible}
      onClose={onDrawerClose}
    >
      <div className="event-details" style={visible ? { display: 'block' } : { display: 'none' }}>
        {showFirewall && (
          <div
            className="event-details-firewall"
            onClick={() => setShowFirewall(false)}
          >
            <div className="upgrade-notification-panel" onClick={planUpgrade}>
              <h3>
                Upgrade to a PREMIUM Membership and get unlimited access to the
                LAB features
              </h3>
            </div>
          </div>
        )}
        <div className="event-details-header">
          {!isEmpty(event.images) && (
            <img src={event.images[0]} alt="event-img" />
          )}
          {isEmpty(event.images) && event.image2 && (
            <img src={event.image2} alt="event-img" />
          )}
          {isEmpty(event.images) && !event.image2 && event.image && (
            <img src={event.image} alt="event-img" />
          )}
        </div>
        <div className="event-details-content">
          <div className="event-details-content-actions">
            {(event.channel === "" || event.channel === undefined || Number(event.channel) > 0) ? (
              <DateAvatar day={convertToLocalTime(event?.startDate, event?.timezone).format("DD") || 0} month={event.month || ""} />
            ) : (
              <DateAvatar day={moment(event?.date, DataFormat).date() || 0} month={event.month || ""} />
            )}
            {(event.status === "past" && userProfile?.id !== undefined) && (
              <div className="claim-buttons">
                <CustomButton
                  className="claim-digital-certificate"
                  text="Confirm I attended this event"
                  size="md"
                  type="primary outlined"
                  onClick={onClickConfirm}
                />
              </div>
            )}
            {(event.status === "confirmed" && userProfile?.id !== undefined) && (
              <React.Fragment>
                {(userProfile || {}).memberShip === "premium" ? (
                  <React.Fragment>
                    {/* <CustomButton
                      className="claim-digital-certificate"
                      text="Claim digital certificate"
                      size="lg"
                      type="primary outlined"
                      onClick={onClickClaimDigitalCertificate}
                    /> */}
                    <CustomButton
                      text="Confirm I attended this event"
                      size="lg"
                      type="primary"
                      onClick={onClickClaimCredits}
                    />
                  </React.Fragment>
                ) : (
                  <CustomButton
                    text="Upgrade to PREMIUM"
                    size="md"
                    type="primary"
                    onClick={planUpgrade}
                  />
                )}
              </React.Fragment>
            )}
            {/* {(event.status === "attend" && userProfile?.id !== undefined) && (
              <CustomButton
                text="REGISTER HERE"
                size="lg"
                type="primary"
                onClick={onAttend}
                loading={loading}
              />
            )} */}
            {(event.channel === "" || event.channel === undefined || Number(event.channel) > 0) && (
              <a
                href={(userProfile?.id !== undefined) ? event.link : "#"}
                style={userProfile?.id !== undefined ? { margin: "0px", padding: "0px" } : { display: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CustomButton
                  text="Attend"
                  size="md"
                  type="primary"
                />
              </a>
            )}
            {(event.status === "going" && userProfile?.id !== undefined) && (
              <React.Fragment>
                <div className="going-label">
                  <CheckOutlined />
                  <span>I'm going</span>
                </div>
                <CustomButton
                  className="not-going-btn"
                  text="Not going"
                  size="lg"
                  type="remove"
                  remove={true}
                  onClick={onCancelAttend}
                />
              </React.Fragment>
            )}
          </div>
          {(event.status === "attend" && userProfile?.id !== undefined) && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <CustomButton
                text="REGISTER HERE"
                size="lg"
                type="primary"
                onClick={onAttend}
                style={{}}
                loading={loading}
              />
            </div>
          )}
          {(event.status === "going" && userProfile?.id !== undefined) && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <div style={{
                background: '#00b574', color: 'white', height: '40px', width: '400px', padding: '10px', fontWeight: '700', fontSize: '20px', borderRadius: '5px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'
              }}>
                You are now registered for this event!
              </div>
            </div>
          )}
          <h1 className="event-title">{event.title}</h1>
          <div className="d-flex items-center event-info">
            {(event.channel === "" || event.channel === undefined || Number(event.channel) > 0) ?
              (
                <h5 className="event-card-topic-title">
                  {`Event date${event.startDate !== event.endDate ? "s" : ""}:`}
                  <span>{event.period2}</span>
                </h5>
              ) : (
                <h5 className="event-card-topic-title">
                  {`Event date${event.startDate !== event.endDate ? "s" : ""}:`}
                  <span>{event.period}</span>
                </h5>
              )}
            {/* <div className="d-flex items-center">
              <h3 className="event-date">{event.period}</h3>
            </div> */}
            {event.status === "going" && (
              <Space direction="vertical">
                {!isEmpty(event.startAndEndTimes) &&
                  event.startAndEndTimes?.map((time, index) => {
                    const startTime = convertToCertainTime(
                      time?.startTime,
                      event.timezone
                    );
                    const endTime = convertToCertainTime(
                      time?.endTime,
                      event?.timezone
                    );

                    return (
                      <Dropdown
                        key={time.startTime}
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
                          {event.startAndEndTimes.length > 1
                            ? `Download Calendar Day ${index + 1}: ${moment(
                              startTime
                            ).format("MMM DD")} `
                            : "Download Calendar"}
                          <DownOutlined />
                        </a>
                      </Dropdown>
                    );
                  })}
              </Space>
            )}
          </div>
          {event.location && (
            <>
              <h5 className="event-card-topic-title">
                Event Type:{" "}
                <span>
                  {event.location.map((loc, index) => {
                    if (loc === "online") {
                      return (
                        <>Online {event.location[index + 1] ? "and " : ""}</>
                      );
                    }

                    return (
                      <>In Person {event.location[index + 1] ? "and " : ""}</>
                    );
                  })}
                </span>
              </h5>
            </>
          )}
          {event.ticket && (
            <h5 className="event-card-topic-title">
              Event tickets:
              <span>
                {event.ticket === "fee"
                  ? `$${event.ticketFee} Registration fee`
                  : event.ticket === "premium"
                    ? "Only PREMIUM members"
                    : capitalizeWord(event.ticket)}
              </span>
            </h5>
          )}

          {event.type && (
            <h5 className="event-card-topic-title">
              Content delivery format:
              {event.type.map((tp, index) => (
                <span>
                  {capitalizeWord(tp)} {event.type[index + 1] && `|`}
                </span>
              ))}
            </h5>
          )}

          {(event.categories && event.categories.length > 0 && dataCategoriesState !== undefined) && (
            <h5 className="event-card-topic-title">
              Event topics:
              {event.categories.map((tp, index) => {
                return (
                  <span>
                    {capitalizeWord(dataCategoriesState[tp])} {event.categories[index + 1] && `|`}
                  </span>
                )
              })}
            </h5>
          )}
        </div>

        {event.description && (
          <div className="event-details-description">
            <h1 className="event-title">Description</h1>
            {editor === "froala" ? (
              <div
                className="event-description"
                dangerouslySetInnerHTML={{
                  __html: (event.description || {}).html || "",
                }}
              />
            ) : (
              <RichEdit data={event.description} />
            )}
          </div>
        )}

        {event.EventInstructors?.length > 0 && (
          <div className="event-details-instructors">
            <h1 className="event-title">Speakers</h1>
            <div className="event-people">
              {event.EventInstructors.map((eventInstructor) => {
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
                    <div className="event-instructor-name">
                      {instructor.name}
                    </div>
                    <Tooltip title={instructor.description}>
                      <div className="event-instructor-name truncate">
                        {instructor.description}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(event.status === "attend" && userProfile?.id !== undefined) && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomButton
              text="REGISTER HERE"
              size="lg"
              type="primary"
              onClick={onAttend}
              style={{}}
              loading={loading}
            />
          </div>
        )}
        {(event.status === "going" && userProfile?.id !== undefined) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{
              background: '#00b574', color: 'white', height: '40px', width: '400px', padding: '10px', fontWeight: '700', fontSize: '20px', borderRadius: '5px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'
            }}>
              You are now registered for this event!
            </div>
          </div>
        )}
        {(event.relationEventCouncil !== -1 && event !== undefined && bulStatus) && (
          <div className="event-details-description" style={{ marginTop: '15px', marginBottom: '40px', paddingBottom: '15px' }}>
            <h1 className="event-title">Agenda</h1>
            {allPanelsConcil}
          </div>
        )}
      </div>
    </CustomDrawer>
  );
};

EventDrawer.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onConfirmCredit: PropTypes.func,
  filter: PropTypes.object,
};

EventDrawer.defaultProps = {
  title: "",
  visible: false,
  event: {},
  onClose: () => { },
  onConfirmCredit: () => { },
  filter: {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  updatedEvent: eventSelector(state).updatedEvent,
  channel: channelSelector(state).selectedChannel,
  allCategories: categorySelector(state).categories,
  ...councilEventSelector
});

const mapDispatchToProps = {
  getChannelEvents,
  ...eventActions,
  ...councilEventActions
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDrawer);
