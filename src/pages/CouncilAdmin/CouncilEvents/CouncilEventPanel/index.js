import React, { useState } from "react";
import {
  Avatar,
  Dropdown,
  Menu,
  Form,
  Popconfirm,
  AutoComplete,
  // Collapse,
  Switch,
  notification,
  Tooltip,
} from "antd";
import { CustomButton, CustomModal } from "components";
import Emitter from "services/emitter";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { EVENT_TYPES } from "enum";

import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";
import { homeSelector } from "redux/selectors/homeSelector";

// import CommentForm from "./CommentForm";
import "./style.scss";
import { convertToLocalTime } from "utils/format";

// const { Panel } = Collapse;

const CouncilEventPanel = ({
  panel,
  userProfile,
  joinCouncilEvent,
  tz,
  userTimezone,
  status,
  removeCouncilEventPanelist,
  searchUserForCouncilEventPanelist,
  searchedUsersForCouncilEvent,
  closeMainModal,
  councilEventId,
  getCouncilEvents,
  joinCouncilEventWait,
  eventData
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showProfileCompletionFirewall, setShowProfileCompletionFirewall] =
    useState(false);
  const [form] = Form.useForm();

  let startTime = convertToLocalTime(panel.startDate, tz);
  let endTime = convertToLocalTime(panel.endDate, tz);

  const handleJoinPanel = (panel, state) => {
    joinCouncilEvent(
      panel.id,
      userProfile.id,
      state,
      false,
      false,
      councilEventId
    ,() => {getCouncilEvents();});

  };

  const onClickDownloadCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/council/event/panel/${panel.id}/ics?userTimezone=${userTimezone}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
      panel.panelName
    )}&dates=${startTime.format("YYYYMMDDTHHmmSSS")}/${endTime.format(
      "YYYYMMDDTHHmmSSS"
    )}&details=${encodeURIComponent(`Link to join: ${panel.linkToJoin}`)}`;
    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&st=${startTime.format(
      "YYYYMMDDTHHmm"
    )}&et=${endTime.format("YYYYMMDDTHHmm")}&title=${encodeURIComponent(
      panel.panelName
    )}&desc=${encodeURIComponent(`Link to join: ${panel.linkToJoin}`)}`;

    window.open(yahooCalendarUrl, "_blank");
  };

  const downloadDropdownOptions = () => (
    <Menu style={{ position: "relative", bottom: "70px" }}>
      <Menu.Item key="1">
        <a href="/#" onClick={(e) => onClickDownloadCalendar(e)}>
          Download ICS File
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="/#" onClick={(e) => onClickAddGoogleCalendar(e)}>
          Add to Google Calendar
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="/#" onClick={(e) => onClickAddYahooCalendar(e)}>
          Add to Yahoo Calendar
        </a>
      </Menu.Item>
    </Menu>
  );

  const isFull = panel.CouncilEventPanelists.length >= +panel.numberOfPanelists;

  const councilEventPanelist = panel.CouncilEventPanelists.find(
    (panelist) => panelist.User.id === userProfile.id
  );

  const hasJoined = !!councilEventPanelist;

  const checkIfUserProfileIsCompletedAndJoin = () => {
    if (userProfile.percentOfCompletion !== 100) {
      return setShowProfileCompletionFirewall(true);
    }

    handleJoinPanel(panel, "Join");
  };

  const displayJoinBtn = hasJoined ? (
    <CustomButton
      text="Withdraw"
      onClick={() => handleJoinPanel(panel, "Unjoin")}
      type="third"
      size="small"
    />
  ) : (
    <CustomButton
      text={isFull ? "Already Full" : "Join"}
      disabled={isFull}
      onClick={() => checkIfUserProfileIsCompletedAndJoin()}
      size="small"
    />
  );

  const handleRemovePanelist = (id) => {
    removeCouncilEventPanelist(panel.id, id);
  };

  const handleSearchUser = (values) => {
    const runDebounce = debounce(() => {
      searchUserForCouncilEventPanelist(values);
    }, 500);

    runDebounce();
  };

  const handleOnFinish = (values) => {
    if (!values.user) {
      return notification.warn({
        message: "User can't be empty.",
      });
    }

    const user = filteredSearchUser.find(
      (_user) => _user.value === values.user
    );

    joinCouncilEvent(panel.id, user.id, "Join", true, !!values.isModerator, false, () => {
      getCouncilEvents();
    });
    form.resetFields();
    setIsModalVisible(false);
  };

  const addAndFilterSituacion = (panels,users) => {
      let userSelects = users?.map((data) => {
        if(Number(data?.id) === Number(userProfile?.id)){
            return {
                id: panels?.id, 
                isModerator: false, 
                buttonsAccept: true,
                UserId: data?.id,
                User: data,
                pending: true
            } 
        }else{
            return {
                id: panels?.id, 
                isModerator: false, 
                buttonsAccept: true,
                UserId: data?.id,
                User: data,
                pending: (userProfile?.role !== 'admin') ? false : true
            } 
        }  
    })

    let usersSelectss = []
    if(userSelects.length > 0){
        usersSelectss = [...panels?.CouncilEventPanelists, ...userSelects]
    }else{
        usersSelectss = [...panels?.CouncilEventPanelists]
    }    


    return usersSelectss

  }

  const displayPanelists = addAndFilterSituacion(panel, panel.arrayControlIdsEvents)?.map((panelist) => {
    const user = panelist.User;

    const {buttonsAccept} = panelist

    const isPanelModerator = panelist.isModerator;
    const displayIsPanelModerator = isPanelModerator && <span>Moderator</span>;

    return (
      <div className="panelist" key={user.email}>
        <div style={{height: '100px'}}>
          <Avatar
            src={user.img}
            size={100}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </div>
        <div>{`${user.firstName} ${user.lastName}`}</div>
        <div>
          <div>
            <Tooltip title={user.titleProfessions}>
              {user.titleProfessions}
            </Tooltip>
          </div>
          {displayIsPanelModerator}
        </div>
        {userProfile.isExpertCouncilAdmin && (
          <div
            style={{
              marginTop: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: '20px'
            }}
          >
            {!buttonsAccept && <Popconfirm
              title="Do you want to remove this panelist?"
              onConfirm={() => handleRemovePanelist(panelist.id)}
            >
              <CustomButton text="Remove" type="third" size="small" />
            </Popconfirm>}
            {(userProfile.role === 'admin' && buttonsAccept) && 
              <CustomButton
                className="button-speaker"
                text="Approve"
                size="sm"
                style={{marginTop: '10px'}}
                type="secondary"
                onClick={() => {
                  joinCouncilEvent(
                    panel.id,
                    user.id,
                    "Join",
                    false,
                    false,
                    panel.CouncilEventId
                  ,() => {getCouncilEvents();});
                }}
              />
            }
            {(userProfile.role === 'admin' && buttonsAccept) && 
              <CustomButton
                className="button-speaker"
                text="Reject"
                size="sm"
                style={{marginTop: '10px'}}
                type="third"
                onClick={() => {
                  joinCouncilEventWait(
                    panel.id,
                    user,
                    "Unjoin",
                    false,
                    false,
                    eventData,
                    () => getCouncilEvents()
                  );
                }}
              />
            }
          </div>
        )}
      </div>
    );
  });

  const filteredSearchUser = searchedUsersForCouncilEvent.filter(
    (user) =>
      !panel.CouncilEventPanelists.some(
        (panelist) => panelist.UserId === user.id
      )
  );

  const completeProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
  };

  return (
    <div style={{ marginTop: "1rem", background: "#f2f2f2", padding: "1rem" }}>
      <div className="d-flex justify-between" key={panel?.panelName}>
        <div>
          <div>
            <b>Panel</b>: {panel?.panelName}
          </div>
          <div>
            <b>Panel Date</b>:{` ${startTime.format("LL")}`}
          </div>
          <div>
            <b>Panel Start Time</b>: {startTime.format("HH:mm")} {userTimezone}
          </div>
          <div>
            <b>Panel End Time</b>: {endTime.format("HH:mm")} {userTimezone}
          </div>
          <div
            className="d-flex"
            style={{ marginTop: "1rem", flexWrap: "wrap" }}
          >
            {displayPanelists}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {userProfile.isExpertCouncilAdmin && (
            <CustomButton
              size="small"
              text="Add user"
              style={{ marginBottom: "1rem" }}
              type="secondary"
              onClick={() => setIsModalVisible(true)}
            />
          )}
          {status !== "closed" && displayJoinBtn}
          {hasJoined && (
            <>
              <div style={{ marginTop: "5px" }}>
                <Dropdown overlay={downloadDropdownOptions}>
                  <a
                    href="/#"
                    className="ant-dropdown-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Download calendar <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            </>
          )}
        </div>
        <CustomModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          title="Add user"
          width={420}
        >
          <Form form={form} layout="vertical" onFinish={handleOnFinish}>
            <Form.Item
              name="user"
              label="Search user"
              required={[{ required: true }]}
            >
              <AutoComplete
                size="large"
                onSearch={handleSearchUser}
                options={filteredSearchUser}
              />
            </Form.Item>
            <Form.Item name="isModerator" label="Is a moderator">
              <Switch />
            </Form.Item>
            <Form.Item>
              <CustomButton htmlType="submit" text="Add" block />
            </Form.Item>
          </Form>
        </CustomModal>
      </div>
      {/* {hasJoined && (
        <div style={{ marginTop: "1rem" }}>
          <Collapse accordion>
            <Panel header="Click here to see comments" key="1">
              <CommentForm
                councilEventPanelComments={panel.CouncilEventPanelComments}
                CouncilEventPanelId={panel.id}
                CouncilEventPanelistId={councilEventPanelist?.id}
              />
            </Panel>
          </Collapse>
        </div>
      )} */}
      {showProfileCompletionFirewall && (
        <div
          className="skill-cohort-firewall"
          onClick={() => {
            closeMainModal();
            setShowProfileCompletionFirewall(false);
          }}
        >
          <div className="upgrade-notification-panel" onClick={completeProfile}>
            <h3>
              You must fully complete your profile before joining an event.
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...councilEventSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...councilEventActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilEventPanel);
