import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notification } from "antd";
import moment from "moment";

import EventList from "pages/Events/EventList";
import EventAddEditDrawer from "containers/EventAddEditDrawer";
import EventDrawer from "containers/EventDrawer";
import { CARD_TYPE, MONTH_NAMES } from "enum";
import NoItemsMessageCard from "components/NoItemsMessageCard";

import {
  getChannelEvents,
  deleteEvent,
  setEvent,
  addToMyEventList
} from "redux/actions/event-actions";
import { actions as eventActions } from "redux/actions/event-actions";
import { eventSelector } from "redux/selectors/eventSelector";
import { channelSelector } from "redux/selectors/channelSelector";

const DataFormat = "YYYY.MM.DD hh:mm A";

const EventsList = ({
  isOwner,
  isEditor,
  filter,
  channelEvents,
  channel,
  getChannelEvents,
  deleteEvent,
  addToMyEventList,
  setEvent,
  limit,
  buttomEdit
}) => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [visibleEventDrawer, setVisibleEventDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [futureDataFilter, setFutureDataFilter] = useState([]);

  const onAddEvent = () => {
    setEditMode(false);
    setVisibleDrawer(true);
  };

  const onEventChanged = (event) => {
    addToMyEventList(event, null, () => {
      getChannelEvents({ ...filter, channel: channel.id });
    });
  };

  const handleEvent = (menu, event) => {
    switch (menu) {
      case "edit":
        setEditMode(true);
        setEvent(event);
        setVisibleDrawer(true);
        break;
      case "delete":
        deleteEvent(event, (err) => {
          if (err) {
            notification.error({
              message: err,
            });
          } else {
            notification.info({
              message: "Event was successfully deleted.",
            });
            getChannelEvents({ ...filter, channel: channel.id });
          }
        });
        break;
      default:
        break;
    }
  };

  const onEventClick = (event) => {
    setVisibleEventDrawer(true);
    setSelectedEvent({
      ...event,
      day: moment(event.date, DataFormat).date(),
      month: MONTH_NAMES[moment(event.date, DataFormat).month()],
    });
  };

  useEffect(() => {
    futureDataFilter.map((item) => {
      if (item.id === selectedEvent.id) {
        setSelectedEvent({
          ...item,
          day: moment(item.date, DataFormat).date(),
          month: MONTH_NAMES[moment(item.date, DataFormat).month()],
        });
      }
      return futureDataFilter;
    });
  }, [futureDataFilter, selectedEvent.id]);

  useEffect(() => {
    if (channel && channel.id) {
      getChannelEvents({ ...filter, channel: channel.id });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, filter]);

  useEffect(() => {
    const dateFilter = () => {
      setFutureDataFilter((prev) => {
        prev = channelEvents.filter((item) => {
          const flag = new Date(item.startDate) > new Date();
          return flag
        });
        prev = prev.map((item) => {
          return {...item, channelSelect: channel}
        })
        return [...prev];
      });
    };

    dateFilter();
  }, [channelEvents, channel]);

  return (
    <div className="channel-page__list-wrap channels-page__events-list-wrap">
      <EventAddEditDrawer
        visible={visibleDrawer}
        edit={editMode}
        onAdded={() => {
          setVisibleDrawer(false);
          getChannelEvents({ ...filter, channel: channel.id });
        }}
        onClose={() => setVisibleDrawer(false)}
      />
      {!isOwner && !isEditor && futureDataFilter?.length === 0 ? (
        <NoItemsMessageCard
          message={`There are no Events for you at the moment`}
        />
       ) : (
        <EventList
          edit={(isOwner || isEditor)}
          type={CARD_TYPE.EDIT}
          data={futureDataFilter}
          onClick={onEventClick}
          onAddEvent={onAddEvent}
          onAttend={onEventChanged}
          onMenuClick={handleEvent}
          limit={limit}
          buttomEdit={buttomEdit}
        />
      )}
      <EventDrawer
        visible={visibleEventDrawer}
        event={selectedEvent}
        onClose={() => setVisibleEventDrawer(false)}
      />
    </div>
  );
};

EventsList.propTypes = {
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  filter: PropTypes.object,
};

EventsList.defaultProps = {
  isOwner: false,
  isEditor: false,
  filter: {},
};

const mapStateToProps = (state) => ({
  channelEvents: eventSelector(state).channelEvents,
  channel: channelSelector(state).selectedChannel,
  ...eventActions,
});

const mapDispatchToProps = {
  getChannelEvents,
  deleteEvent,
  addToMyEventList,
  setEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
