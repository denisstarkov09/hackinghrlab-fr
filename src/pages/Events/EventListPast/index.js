import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
// import groupBy from "lodash/groupBy";
import moment from "moment";
import { connect } from "react-redux";
// import { convertToLocalTime } from "utils/format";
import TimeZoneList from "enum/TimezoneList";

import {
  // DateAvatar, 
  EventCard,
  CustomButton
} from "components";
import { NoEventCard } from "components";
// import Emitter from "services/emitter";
import {
  // EVENT_TYPES,
  //SETTINGS,
  CARD_TYPE,
  INTERNAL_LINKS
} from "enum";
import { envSelector } from "redux/selectors/envSelector";

import "./style.scss";

// const monthStr = [
//   "JAN",
//   "FEB",
//   "MAR",
//   "APR",
//   "MAY",
//   "JUN",
//   "JUL",
//   "AUG",
//   "SEP",
//   "OCT",
//   "NOV",
//   "DEC",
// ];

// const DataFormat = SETTINGS.DATE_FORMAT;

const EventListPast = ({
  data,
  isMobile,
  onAttend,
  showFilter,
  onClick,
  edit,
  type,
  onMenuClick,
  onAddEvent,
  onConfirmAttendance,
  onConfirmCredit,
  userProfile,
  limit = 'all',
  buttomEdit,
  allLibraries,
  ...rest
}) => {
  // const [groupedByEventData, setGroupedByEventData] = useState({});

  let num = -1

  const onEventChanged = (event, going) => {
    event.going = going;
    onAttend(event);
  };

  // const onShowFilter = () => {
  //   if (isMobile) {
  //     Emitter.emit(EVENT_TYPES.OPEN_EVENT_FILTER_DRAWER);
  //   } else {
  //     showFilter();
  //   }
  // };

  const getRandomNumber = () => Math.floor(Math.random() * 1000);

  // useEffect(() => {

  //   let dateIteraded = data?.map((item) => {
  //     if(item.channel !== null){
  //       return (
  //         { 
  //           ...item,
  //           date: convertToLocalTime(item?.startDate,item?.timezone).format("YYYY-MM-DD hh:mm a") , 
  //           groupKey: convertToLocalTime(item?.startDate,item?.timezone).format("YYYY.MM.DD").slice(0, 10),
  //         }
  //       )
  //     }else{
  //       return (
  //         { 
  //           ...item,
  //           groupKey: item?.date?.slice(0, 10),
  //         }
  //       )
  //     }
  //   })

  //   let groupedData = groupBy(
  //     dateIteraded,
  //     "groupKey"
  //   );

  //   setGroupedByEventData({ ...groupedData });
  // }, [data]);

  const searchTimeZone = (timezone) => {
    let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

    if (currentTimezone) {
      currentTimezone = currentTimezone.utc[0];
    } else {
      currentTimezone = timezone;
    }

    return currentTimezone
  }

  return (
    <div className={(window.location.pathname.substring(0, 15) === INTERNAL_LINKS.EVENTS) ? "event-list-event" : "event-list"}>
      {/* <div className="event-list-filters">
        <CustomButton
          className="event-list-filters-btn"
          text="Filters"
          type="primary outlined"
          size="lg"
          onClick={onShowFilter}
        />
      </div> */}
      {data && data.length === 0 && type !== CARD_TYPE.EDIT && <NoEventCard />}
      {(edit && type === CARD_TYPE.EDIT) && (
        <CustomButton
          text="Add Events"
          htmlType="submit"
          size="sm"
          type="primary"
          className={(buttomEdit === 'home') ? "buttomAddRR" : "buttomAddR"}
          style={(buttomEdit === 'home') ? { left: "110px" } : {}}
          onClick={() => onAddEvent()}
        />
      )}
      {data.map((event, index) => {

        // const day = moment(date, DataFormat).date();
        // const month = moment(date, DataFormat).month();

        let dateFilter = (event.channel !== null)
          ? moment(event?.endDate, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')
          : moment(event?.startAndEndTimes[event.startAndEndTimes.length - 1]?.endTime, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')

        let dateNow = moment(moment.utc().add(1, 'minute'), 'YYYY-MM-DD hh:mm a').tz(searchTimeZone(event?.timezone))?.format('YYYYMMDDHHmm')

        if ((Number(dateNow) > Number(dateFilter)) === true) {

          num++

          return (limit > num || limit === 'all') ? (
            //   {/* <DateAvatar day={day} month={monthStr[month]} /> */}
            //   <Row gutter={[0, 36]}>
            //     {groupedByEventData[date?.groupKey].map((event, index) => (

            <div
              className="event-list-batch"
              key={`${index}-${getRandomNumber()}`}
            >
              <Row gutter={[0, 36]}>
                <Col
                  key={`col-${index}-${getRandomNumber()}`}
                  span={24}
                  className="event-list-item"
                >
                  <EventCard
                    edit={edit}
                    data={event}
                    userProfile={userProfile}
                    onAttend={(going) => onEventChanged(event, going)}
                    onClick={onClick}
                    onMenuClick={(menu) => onMenuClick(menu, event)}
                    onConfirmAttendance={onConfirmAttendance}
                    onConfirmCredit={onConfirmCredit}
                    lengthLibraries={allLibraries.filter((data) => event.id === data.EventId)?.length}
                  />
                </Col>
              </Row>
            </div>
            // ))}
          ) : (
            <div key={`${index}-${getRandomNumber()}`} style={{ display: "none" }}></div>
          )
        } else {
          return (<div key={`${index}-${getRandomNumber()}`} style={{ display: "none" }}></div>)
        }
      })}
    </div>
  );
};

EventListPast.propTypes = {
  data: PropTypes.array,
  edit: PropTypes.bool,
  type: PropTypes.string,
  onAttend: PropTypes.func,
  onClick: PropTypes.func,
  showFilter: PropTypes.func,
  onMenuClick: PropTypes.func,
  onAddEvent: PropTypes.func,
  onConfirmAttendance: PropTypes.func,
  onConfirmCredit: PropTypes.func,
  userProfile: PropTypes.object,
  allLibraries: PropTypes.array,
};

EventListPast.defaultProps = {
  data: [],
  allLibraries: [],
  edit: false,
  type: CARD_TYPE.VIEW,
  userProfile: {},
  onAttend: () => { },
  onClick: () => { },
  showFilter: () => { },
  onMenuClick: () => { },
  onAddEvent: () => { },
  onConfirmAttendance: () => { },
  onConfirmCredit: () => { },
};

const mapStateToProps = (state) => ({
  isMobile: envSelector(state).isMobile,
});

export default connect(mapStateToProps)(EventListPast);
