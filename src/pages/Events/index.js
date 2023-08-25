import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment-timezone";
// import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import clsx from "clsx";
import { notification } from "antd";
import converter from "number-to-words";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useParams } from "react-router-dom";
import { Modal } from 'antd'
import IconLogo from "images/logo-sidebar.svg";
import { CloseCircleFilled } from "@ant-design/icons";
// import TimeZoneList from "enum/TimezoneList";

import { Tabs, EventFilterPanel, CustomButton } from "components";
import EventDrawer from "containers/EventDrawer";
import { MONTH_NAMES } from "enum";
import EventList from "./EventList";
import EventListPast from "./EventListPast";
import {
  getAllEvent,
  addToMyEventList,
  removeFromMyEventList,
  getMyEvents,
  claimEventAttendance,
  claimEventCredit,
  getAllEventsChannels,
  verifySuscribedUser,
  suscriptionSendingBlue
} from "redux/actions/event-actions";
import {
  setLoading,
  attendToGlobalConference,
} from "redux/actions/home-actions";
import {
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
} from "redux/actions/advertisment-actions";
import {
  getAllLibraries
} from "redux/actions/myLearning-actions";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { myLearningSelector } from "redux/selectors/myLearningSelector";
import EventFilterDrawer from "./EventFilterDrawer";
import EventClaimModal from "./EventClaimModal";

import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";
import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";

import { convertBlobToBase64 } from "utils/format";

import "./style.scss";

const EventsPage = ({
  allEvents,
  myEvents,
  updatedEvent,
  userProfile,
  getAllEvent,
  getMyEvents,
  addToMyEventList,
  attendToGlobalConference,
  removeFromMyEventList,
  claimEventAttendance,
  claimEventCredit,
  setLoading,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  advertisementsByPage,
  advertisementById,
  isAdPreview = false,
  createAdvertisementClick,
  getAllEventsChannels,
  allEventsChannels,
  getAllLibraries,
  allLibraries,
  getCouncilEvents,
  verifySuscribedUser,
  suscriptionSendingBlue
}) => {
  // const [filteredEvents, setFilteredEvents] = useState([]);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [currentTab, setCurrentTab] = useState("0");
  const [filterParams, setFilterParams] = useState({});
  // const [pastFilterData, setPastFilterData] = useState([]);
  // const [allEventFilterData, setAllEventFilterData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [allCouncilEvents, setAllCouncilEvents] = useState(undefined)
  const [eventForCredit, setEventForCredit] = useState({});
  const [bulModal, setBulModal] = useState(false)
  const [activeMessages, setActiveMessages] = useState('')

  const { id } = useParams();

  useEffect(() => {
    if (isAdPreview) {
      getAdvertisementById(id);
    } else {
      getAdvertisementsTodayByPage("events");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getCouncilEvents((data) => {
      setAllCouncilEvents(data)
    });
  }, [getCouncilEvents, setAllCouncilEvents])

  const displayAds = (
    <div className="events-advertisement-wrapper">
      {advertisementsByPage?.events?.map((advertisement) => {
        return (
          <div
            className="events-advertisement-wrapper-content"
            key={advertisement?.id}
          >
            <div
              className="advertisement"
              onClick={() => {
                createAdvertisementClick(advertisement?.id);
                window.open(advertisement?.advertisementLink, "_blank");
              }}
            >
              <img
                src={advertisement?.adContentLink}
                alt="advertisement"
                className="advertisement-img"
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const displayPreviewAd = isAdPreview && (
    <div className="events-advertisement-wrapper-preview">
      <div
        className="advertisement"
        onClick={() =>
          window.open(advertisementById?.advertisementLink, "_blank")
        }
      >
        <img
          src={advertisementById?.adContentLink}
          alt="advertisement"
          className="advertisement-img"
        />
      </div>
    </div>
  );

  const DataFormat = "YYYY.MM.DD hh:mm A";

  const addMyEvents = (event, image) => {

    event.imageEmail = image
    const timezone = moment.tz.guess();

    if (event.going) {
      addToMyEventList(event, timezone, () => {
        notification.success({
          message: "Event successfully added",
          description: "An email has been sent to you with more information.",
        })
        verifySuscribedUser((data) => {
          if (data) {
            setBulModal(true)
          }
        })
      });
      if (event.isAnnualConference === 1) {
        attendToGlobalConference();
      }
    } else {
      removeFromMyEventList(event);
      if (event?.isAnnualConference === 1) {
        attendToGlobalConference();
      }
    }
  };

  const onEventClick = (event) => {
    setVisible(true);
    setEvent({
      ...event,
      day: moment(event.date, DataFormat).date(),
      month: MONTH_NAMES[moment(event.date, DataFormat).month()],
    });
  };

  const onConfirmAttendance = (event) => {
    claimEventAttendance(event.id);
  };

  const onConfirmCredit = (event) => {
    setEventForCredit(event);
    setModalVisible(true);
  };

  const onClaimCredit = async () => {
    const pdf = await generatePDF();

    claimEventCredit(eventForCredit.id, pdf, (err) => {
      if (err) {
        notification.error({
          message: "Error",
          description: (err || {}).msg,
        });
      } else {
        notification.info({
          message: "Email was sent successfully.",
        });
        setModalVisible(false);
      }
    });
  };

  const orderListEvents = (data) => {

    let arrayOrderTime = data.sort((a, b) => {

      let aTime = moment(a.startDate, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")
      let bTime = moment(b.startDate, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")

      return Number(aTime) - Number(bTime)

    })

    if (filterParams.date !== null && filterParams.date !== undefined) {
      arrayOrderTime = arrayOrderTime.filter((data) =>
        moment(data.startDate, "YYYY-MM-DD").format("YYYY-MM-DD") === moment(filterParams?.date, "YYYY-MM-DD")?.format("YYYY-MM-DD")
      )
    }


    return arrayOrderTime
  }

  const orderListPersonalEvents = (data) => {

    const data1 = data.filter((item) => {
      let flag = false;

      if (item.users?.includes(String(userProfile.id)) || item.users?.includes(userProfile.id)) {
        flag = true;
      }

      return flag;
    });

    return data1;

  }

  const filterEvents = (data) => {

    let newD = data.filter((dat) => {
      return dat.categories !== null &&
        dat.title !== null &&
        dat.image2 !== null &&
        dat.date !== null &&
        dat.date2 !== null &&
        dat.link !== null &&
        dat.timezone !== null
    })

    return newD
  }

  const searchIfAttendOrNo = (data) => {

    let newMap = data.map((event) => {

      if (event.status !== undefined && event.status !== 'attend' && event.status !== 'going' && event.status !== 'past') {
        return {
          ...event,
          status: 'attend'
        }
      } else {
        return event
      }

    })

    return newMap

  }

  const TabData = [
    {
      title: "Upcoming Events",
      content: () => (
        <EventList
          data={orderListEvents([
            ...searchIfAttendOrNo(allEvents),
            ...filterEvents(allEventsChannels)
          ])}
          onAttend={addMyEvents}
          onClick={onEventClick}
          userProfile={userProfile}
          showFilter={() => setVisibleFilter(true)}
          setActiveMessages={(data) => {
            setActiveMessages(data)
            setTimeout(() => {
              setActiveMessages('')
            }, 1000);
          }}
        />
      ),
    },
    {
      title: "My Upcoming Events",
      content: () => (
        <EventList
          // data={myEvents.filter((event) => event.status === "going")}
          data={orderListPersonalEvents(orderListEvents([...searchIfAttendOrNo(allEvents)]))}
          onAttend={addMyEvents}
          onClick={onEventClick}
          userProfile={userProfile}
          showFilter={() => setVisibleFilter(true)}
          setActiveMessages={(data) => {
            setActiveMessages(data)
            setTimeout(() => {
              setActiveMessages('')
            }, 1000);
          }}
        />
      ),
    },
    {
      title: "My Past Events",
      content: () => (
        <EventListPast
          data={orderListPersonalEvents(orderListEvents([...allEvents]))}
          onAttend={addMyEvents}
          onClick={onEventClick}
          userProfile={userProfile}
          onConfirmAttendance={onConfirmAttendance}
          onConfirmCredit={onConfirmCredit}
          showFilter={() => setVisibleFilter(true)}
          allLibraries={allLibraries}
          setActiveMessages={(data) => {
            setActiveMessages(data)
            setTimeout(() => {
              setActiveMessages('')
            }, 1000);
          }}
        />
      ),
    },
  ];

  // const searchTimeZone = (timezone) => {
  //   let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

  //   if (currentTimezone) {
  //     currentTimezone = currentTimezone.utc[0];
  //   } else {
  //     currentTimezone = timezone;
  //   }

  //   return currentTimezone
  // }

  const onFilterChange = (params, redirect = false) => {
    setFilterParams(params);
    if (moment(params.date).isAfter(moment())) {
      return futureFilter(params);
    } else if (moment(params.date).isBefore(moment())) {
      return pastFilter(params);
    }

    if (!params.date) {
      futureFilter(params);
      pastFilter(params);
    }

    // setAllEventFilterData((prev) => {
    //   prev = allEvents.filter((item) => {
    //     let flag = true;
    //     flag = dateFilter(flag, params, item);

    //     // const lastDayOfEvent =
    //     //   item.startAndEndTimes[item.startAndEndTimes.length - 1]?.endTime;

    //     let dateFilterData = (item.channel !== null) 
    //       ? moment(item?.endDate, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')
    //       : moment(item?.startAndEndTimes[item.startAndEndTimes.length - 1]?.endTime, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')

    //     let dateNow = moment(moment.utc().add(1, 'minute'),'YYYY-MM-DD hh:mm a').tz(searchTimeZone(item?.timezone))?.format('YYYYMMDDHHmm')

    //     if (
    //       (Number(dateNow) < Number(dateFilterData) === true) ||
    //       !item.users?.includes(userProfile.id) 
    //     ) {
    //       flag = false;
    //     }
    //     return flag;
    //   });
    //   return [...prev];
    // });
    // if (redirect) {
    //   setCurrentTab("0");
    // }
  };

  const futureFilter = (params) => {
    // setFilteredEvents((prev) => {
    //   prev = allEvents.filter((item) => {
    //     let flag = true;
    //     flag = dateFilter(flag, params, item);

    //     const last = item.startAndEndTimes[item.startAndEndTimes.length - 1];

    //     if (!isEmpty(last) && moment().isBefore(last.endTime)) {
    //       flag = true;
    //     }

    //     return flag;
    //   });
    //   return [...prev];
    // });
  };

  const pastFilter = (params) => {
    // setPastFilterData((prev) => {
    //   prev = allEvents.filter((item) => {
    //     // let flag = true;

    //     // flag = dateFilter(flag, params, item);

    //     // if (new Date(item.endDate) > moment.utc() || !item.status === "attend") {
    //     //   flag = false;
    //     // }

    //     // return flag;

    //     const lastDayOfEvent =
    //       item.startAndEndTimes[item.startAndEndTimes.length - 1]?.endTime;

    //     if (
    //       moment(lastDayOfEvent).utc() > moment.utc() ||
    //       !item.users?.includes(userProfile.id)
    //     ) {
    //       return null;
    //     }

    //     return item;
    //   });
    //   return [...prev];
    // });
  };

  // const dateFilter = (flag, params, item) => {
  //   if (params.date) {
  //     const res = moment(item.date, "YYYY.MM.DD h:mm a");
  //     const eventDate = {
  //       year: res.year(),
  //       month: res.month(),
  //       day: res.date(),
  //     };

  //     const currentDate = {
  //       year: params.date.year(),
  //       month: params.date.month(),
  //       day: params.date.date(),
  //     };

  //     flag = isEqual(eventDate, currentDate);
  //   }

  //   if (params["Topics"] && params["Topics"].length > 0) {
  //     flag =
  //       flag &&
  //       (params["Topics"] || []).some((tpc) => item.categories.includes(tpc));
  //   }

  //   if (isEmpty(params)) {
  //     const eventDate = moment(
  //       item?.startAndEndTimes[item?.startAndEndTimes.length - 1]?.endTime,
  //       "YYYY.MM.DD h:mm a"
  //     );
  //     flag = eventDate.isAfter(moment());
  //   }

  //   return flag;
  // };

  const onEventDrawerClose = () => {
    setVisible(false);
  };

  const getPerodOfEvent = (startDate, endDate) => {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));

    return duration.asHours();
  };

  const period = getPerodOfEvent(
    eventForCredit.startDate,
    eventForCredit.endDate
  );

  const generatePDF = async () => {
    setLoading(true);
    const domElement = document.getElementById("certificate-panel");
    const canvas = await html2canvas(domElement, { scale: 4 });

    const width = domElement.clientWidth;
    const height = domElement.clientHeight;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPdf({
      orientation: "landscape",
      format: [2000, (2000 / width) * height],
      unit: "px",
      hotfixes: ["px_scaling"],
      precision: 32,
    });

    pdf.addImage(
      imgData,
      "jpeg",
      0,
      0,
      2000,
      (2000 / width) * height,
      "",
      "SLOW"
    );

    const blobPdf = pdf.output("blob");

    setLoading(false);
    return await convertBlobToBase64(blobPdf);
  };

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      getAllEvent();
    }
    if (!myEvents || myEvents.length === 0) {
      getMyEvents();
    }
    if (!allEventsChannels || allEventsChannels.length === 0) {
      getAllEventsChannels()
    }
    if (!allLibraries || allLibraries.length === 0) {
      getAllLibraries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onFilterChange(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents]);

  useEffect(() => {
    if (event && updatedEvent && event.id === updatedEvent.id) {
      setEvent({
        ...updatedEvent,
        day: moment(updatedEvent.date, DataFormat).date(),
        month: MONTH_NAMES[moment(updatedEvent.date, DataFormat).month()],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedEvent]);

  useEffect(() => {
    onFilterChange({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="events-page">
      {(activeMessages !== '') &&
        <div className="container-messages-general" style={{ zIndex: "100000" }}>
          <div className="messages">{activeMessages}</div>
        </div>
      }
      <EventFilterDrawer
        onFilterChange={(data) => onFilterChange(data, true)}
      />
      <div className={clsx("events-page-filter", { visible: visibleFilter })}>
        <EventFilterPanel
          title="Categories"
          onFilterChange={(data) => onFilterChange(data, true)}
          onClose={() => setVisibleFilter(false)}
        />
      </div>
      <div className="events-page-wrapper">
        <div className="events-page-container">
          <Tabs
            data={TabData}
            current={currentTab}
            onChange={setCurrentTab}
            centered
          />
        </div>
        {displayAds}
        {displayPreviewAd}
      </div>
      <EventDrawer
        visible={visible}
        event={event}
        onClose={onEventDrawerClose}
        onConfirmCredit={onConfirmCredit}
        allCouncilEvents={allCouncilEvents}
      />
      <EventClaimModal
        visible={modalVisible}
        title="HR Credit Offered"
        destroyOnClose={true}
        data={eventForCredit}
        onClaim={onClaimCredit}
        onCancel={() => setModalVisible(false)}
      />
      {!isEmpty(eventForCredit) && (
        <div
          className="event-certificate certificate-page-wrapper"
          id="certificate-panel"
        >
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR's Certificate of Participation
              </h3>
              <h1 className="certificate-username">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">
                {`For Attending ${eventForCredit.organizer} Session:`}
              </h5>
              <h4 className="certificate-text2">{eventForCredit.title}</h4>
              <h5 className="certificate-text1 duration">{`Duration: ${converter.toWords(
                period
              )} Hour${period > 1 ? "s" : ""}`}</h5>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">{`${moment(
                  eventForCredit.startDate
                ).format("MMMM DD, YYYY")}`}</h5>
                <div className="certificate-divider" />
                <h5 className="certificate-text1">Date</h5>
              </div>
              <div className="certificate-bottom-image">
                <img src={ImgCertificateStamp} alt="certificate-img" />
              </div>
              <div className="certificate-bottom-sign">
                <div className="certificate-signature">
                  <img src={ImgSignature} alt="certificate-signature" />
                </div>
                <div className="certificate-divider" />
                <h5 className="certificate-text1 signature">
                  Founder at Hacking HR
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        className={clsx("custom-modal")}
        wrapClassName={clsx("custom-modal-wrap")}
        title={
          <div className="custom-modal-title">
            <h3>Thank you for registering to attend this event!</h3>
            <div className="custom-modal-logo">
              <img src={IconLogo} alt="custom-logo" />
            </div>
          </div>
        }
        centered
        onCancel={() => setBulModal(false)}
        visible={bulModal}
        closable={true}
        footer={[]}
        width={"300px"}
        closeIcon={<CloseCircleFilled className="custom-modal-close" />}
      >
        <p>Please keep in mind that you must be subscribed to our email list to get information (updates, links to connect, etc.) about the event. If you are not subscribed to our email list you will not receive further information about the event.</p>
        <div className="container-buttons">
          <CustomButton
            key="Cancel"
            text="Cancel"
            type="third"
            size="xs"
            className="button-modal"
            style={{ padding: "0px 10px", marginLeft: "10px" }}
            onClick={() => { setBulModal(false) }}
          />
          <CustomButton
            key="Subscribe to email list"
            text="Subscribe to email list"
            type="primary"
            size="xs"
            className="button-modal"
            style={{ padding: "0px 10px", marginLeft: "10px" }}
            onClick={() => {
              suscriptionSendingBlue(() => {
                setBulModal(false)
              })
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

EventsPage.propTypes = {
  title: PropTypes.string,
};

EventsPage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  myEvents: eventSelector(state).myEvents,
  allEvents: eventSelector(state).allEvents,
  updatedEvent: eventSelector(state).updatedEvent,
  userProfile: homeSelector(state).userProfile,
  allEventsChannels: eventSelector(state).allEventsChannels,
  allLibraries: myLearningSelector(state).allLibraries,
  ...advertisementSelector(state),
  ...councilEventSelector
});

const mapDispatchToProps = {
  getAllEvent,
  getMyEvents,
  addToMyEventList,
  removeFromMyEventList,
  attendToGlobalConference,
  claimEventAttendance,
  claimEventCredit,
  suscriptionSendingBlue,
  setLoading,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
  getAllEventsChannels,
  verifySuscribedUser,
  getAllLibraries,
  ...councilEventActions
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
