import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Form,
  DatePicker,
  InputNumber,
  Tag,
  Space,
  Popconfirm,
  // Tooltip,
  notification,
  Select,
  Checkbox,
  Modal,
  Button
} from "antd";
import { envSelector } from "redux/selectors/envSelector";
import { PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import SocketIO from "services/socket";
import moment from "moment-timezone";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import clsx from "clsx";
import Arrow from "../../../images/arrow-conference.svg"
import {
  CustomDrawer,
  CustomInput,
  CustomButton,
  CustomModal,
  CustomSelect,
  CustomCheckbox,
  FroalaEdit
} from "components";

import IconLogo from "images/logo-sidebar.svg";

import {
  getAllEvent,
} from "redux/actions/event-actions";

import { useSearchCity } from "hooks";
import { INTERNAL_LINKS, SOCKET_EVENT_TYPE } from "enum";

import { actions as councilEventActions } from "redux/actions/council-events-actions";
import { councilEventSelector } from "redux/selectors/councilEventSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import CouncilEventPanel from "./CouncilEventPanel";

import "./style.scss";
import { convertToLocalTime, getNameOfCityWithTimezone } from "utils/format";
import FormListPanelItem from "./FomrListPanelItem";

const { RangePicker } = DatePicker;
const { Option } = Select;

const statusColor = {
  active: "#108ee9",
  draft: "orange",
  closed: "black",
};

const EventTypes = [
  {
    text: "Presentation",
    value: "presentation",
  },
  {
    text: "Workshop",
    value: "workshop",
  },
  {
    text: "Panel",
    value: "panel",
  },
  {
    text: "Peer-to-Peer Conversation",
    value: "peer-to-peer",
  },
  {
    text: "Conference",
    value: "conference",
  },
];

const CouncilEvents = ({
  upsertCouncilEvent,
  allCouncilEvents,
  getCouncilEvents,
  deleteCouncilEvent,
  setJoinCouncilEvent,
  getAllEvent,
  allEvents,
  userProfile,
  setCouncilEventPanelComment,
  exportCouncilEvents,
  s3Hash,
  emailDraftChannel,
  allEmailSendEvent,
  sendEmailAttendeeEventAdmin,
  addEmailDraftEvent,
  deleteEmailDraftEvent,
  getAllEmailDraftEvent,
  getAllEmailSendEvent,
}) => {

  const [emailsForms] = Form.useForm();
  const formControlEmail = useRef(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(1);
  const [numOfPanels, setNumOfPanels] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [panelsMemory, setPanelsMemory] = useState({})
  const [status, setStatus] = useState(null);
  const [event, setEvent] = useState({});
  const [edit, setEdit] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const cities = useSearchCity(searchCity);
  const [openPopUpEmails, setOpenPopUpEmails] = useState(false);
  const [bulMessageRequired, setBulMessageReqired] = useState(false)
  const [bulMessageLimitText, setBulMessageLimitText] = useState(false)
  const [clickModal, setClickModal] = useState(false)
  const [testActive, setTestActive] = useState(false)
  const [bulMessageRequiredTestEmail, setBulMessageRequiredTestEmail] = useState(false)
  const [messageRequiredTestEmail, setMessageRequiredTestEmail] = useState(false)
  const [valueTestEmail, setValueTestEmail] = useState('')
  const [saveAsDraft, setSaveAsDraft] = useState(false)
  const [idDraftEmail, setIdDraftEmail] = useState(-1)
  const [backToFollowers, setBackToFollowers] = useState([])
  const [collapseSearchDraftEamil, setCollapseSearchDraftEamil] = useState(false)
  const [collapseSearchSendEmail, setCollapseSearchSendEmail] = useState(false)
  const [openPopUpConfirmEmail, setOpenPopUpConfirmEmail] = useState(false)
  const [description, setDescription] = useState({
    value: "",
    validateStatus: null,
  });
  const [form] = Form.useForm();

  const userTimezone = moment.tz.guess();

  const timezone = !isEmpty(event) && event.timezone;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getCouncilEvents();

    SocketIO.on(SOCKET_EVENT_TYPE.UPDATE_COUNCIL_EVENT_PANEL, (data) =>
      setJoinCouncilEvent(data)
    );

    SocketIO.on(SOCKET_EVENT_TYPE.UPDATE_COUNCIL_EVENT_COMMENTS, (data) =>
      setCouncilEventPanelComment(data)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeDescription = (e) => {
    setDescription({ ...validateDescription(e.html), value: e.html });
  };

  const validateDescription = (value) => {
    if (value.length > 0)
      return {
        validateStatus: "success",
      };

    return {
      validateStatus: "error",
    };
  };

  const userOfAllEvents = () => {
    let newArrayData3 = []

    selectedEvent.CouncilEventPanels.forEach((data) => {
      let ndt = data.CouncilEventPanelists.map(data2 => data2.User.id)
      newArrayData3 = [...newArrayData3, ...ndt]
      return
    })

    return newArrayData3
  }

  const userOfOneOrMoreEvents = (ids) => {
    let newArrayData = selectedEvent?.CouncilEventPanels.filter((data) => ids.some(idS => data.id === idS))
    let newArrayData2 = []

    newArrayData.forEach(data => {
      let ndt = data.CouncilEventPanelists.map(data2 => data2.User.id)
      newArrayData2 = [...newArrayData2, ...ndt]
      return
    })

    return newArrayData2
  }

  const onFinishEmail = (data) => {
    let values
    let comprobadorEmail = /\w+@\w+\.+[a-z]/;

    values = {
      ...data,
      idChannel: selectedEvent.id,
      id: idDraftEmail,
      message: description.value,
      test: testActive,
      testEmail: valueTestEmail,
      nameEvent: selectedEvent.title,
      to: (data.to[0] === 'all') ? userOfAllEvents() : userOfOneOrMoreEvents(data.to),
    }

    if (values.message === '') {
      setBulMessageReqired(true)
      setTimeout(() => {
        setBulMessageReqired(false)
      }, 2000);
      return
    }

    if (description.value.length < 10) {
      setBulMessageLimitText(true)
      setTimeout(() => {
        setBulMessageLimitText(false)
      }, 2000);
      return
    }

    if (values.testEmail === '' && testActive === true) {
      setBulMessageRequiredTestEmail(true)
      setTestActive(false)
      setTimeout(() => {
        setBulMessageRequiredTestEmail(false)
      }, 2000);
      return
    }

    if (!comprobadorEmail.test(values.testEmail) && values.testEmail !== '' && testActive === true) {
      setMessageRequiredTestEmail(true)
      setTestActive(false)
      setTimeout(() => {
        setMessageRequiredTestEmail(false)
      }, 2000);
      return
    }

    if (saveAsDraft) {
      addEmailDraftEvent(values, () => {
        setSaveAsDraft(false)
        setOpenPopUpEmails(false);
        emailsForms.resetFields();
        description.value = ''
        if (idDraftEmail !== -1) {
          getAllEmailDraftEvent(selectedEvent.id)
          notification.success({
            message: "Email draft edit successflly",
          });
        } else {
          notification.success({
            message: "Email draft add successflly",
          });
        }
        setIdDraftEmail(-1)
      })
    } else {
      sendEmailAttendeeEventAdmin(values, () => {
        if (!testActive) {
          getAllEmailDraftEvent(selectedEvent.id)
          getAllEmailSendEvent()
          setOpenPopUpEmails(false)
          emailsForms.resetFields()
          description.value = ''
          setIdDraftEmail(-1)
        } else {
          setTestActive(false)
        }
      })
    }

  }

  const handleOk = () => {
    setOpenPopUpConfirmEmail(true)
  }

  const handleConfirm = () => {
    emailsForms.submit();
  }

  useEffect(() => {
    if (selectedEvent?.id !== undefined) {
      getAllEmailDraftEvent(selectedEvent.id)
      getAllEmailSendEvent()
    }
  }, [selectedEvent, getAllEmailDraftEvent, getAllEmailSendEvent])

  const handleCancel = () => {
    if (!clickModal) {
      setIdDraftEmail(-1)
      setOpenPopUpEmails(false);
      emailsForms.resetFields();
      description.value = ''
    }
  }

  const emailDraftResponse = ((emailDraftChannel !== undefined) ? emailDraftChannel : []).map((email) => {
    return (
      <div className="container-dat">
        <div
          className="container-option-email-draft"
          onClick={() => {
            description.value = email.message
            formControlEmail.current.setFieldsValue({
              name: email.name,
              subject: email.subject,
            });
            setIdDraftEmail(email.id)
            setCollapseSearchDraftEamil(false)
          }}
        >
          {email.subject} / {email.name}
        </div>
        <div className="container-action">
          <CustomButton
            htmlType="button"
            text={"Delete"}
            type={"primary"}
            size="sm"
            onClick={() => {
              deleteEmailDraftEvent(email.id, () => {
                getAllEmailDraftEvent(selectedEvent.id)
              })
            }}
          />
        </div>
      </div>
    )
  })

  const emailSendResponse = ((allEmailSendEvent !== undefined) ? allEmailSendEvent : []).map((email) => {
    return (
      <div className="container-dat-send"
        onClick={() => {
          description.value = email.message
          formControlEmail.current.setFieldsValue({
            name: email.name,
            subject: email.subject,
          });
          setIdDraftEmail(email.id)
          setCollapseSearchDraftEamil(false)
        }}
      >
        <div
          className="container-option-email-draft"
        >
          {email.subject} / {email.name}
        </div>
        <div className="container-data-send2">
          {(allCouncilEvents || []).filter((data) => data.id === email.idChannel)[0]?.eventName}
        </div>
        <div className="container-data-send">
          {email.date}
        </div>
      </div>
    )
  })

  const quitAllUsers = (data) => {
    let newData = []

    let bul = data.filter((value) => value === 'all')
    let bul2 = backToFollowers.filter((value) => value === 'all')

    if (backToFollowers.length > 0 && bul2[0]) {

      data.forEach((value) => {
        if (value !== 'all') {
          newData.push(value)
        }
      })

      formControlEmail.current.setFieldsValue({
        to: newData
      });

      setBackToFollowers(newData)

    } else if (backToFollowers.length > 0 && bul[0]) {

      data.forEach((value) => {
        if (value === 'all') {
          newData.push(value)
        }
      })

      formControlEmail.current.setFieldsValue({
        to: newData
      });

      setBackToFollowers(newData)

    } else {

      setBackToFollowers(data)

    }

  }

  useEffect(() => {
    if (formControlEmail.current !== undefined && formControlEmail.current !== null) {
      formControlEmail.current.setFieldsValue({
        replyToEmail: 'info@hackinghrlab.io'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopUpEmails])

  useEffect(() => {
    if (!isEmpty(event)) {
      const _event = allCouncilEvents.find((eve) => eve.id === event.id);
      setEvent(_event);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCouncilEvents]);

  useEffect(() => {
    if (!isEmpty(event) && event.CouncilEventPanels !== undefined) {
      const councilEventPanels = event.CouncilEventPanels;
      let panel = councilEventPanels[0];

      let startTime = moment.utc(panel.startDate);
      let endTime = moment.utc(panel.endDate);

      panel = {
        ...panel,
        councilEventPanelId: panel.id,
      };

      const panels = councilEventPanels.slice(1).map((panel) => {
        let startTime = moment.utc(panel.startDate);
        let endTime = moment.utc(panel.endDate);

        return {
          ...panel,
          panelStartAndEndDate: [startTime, endTime],
          type: panel.typePanel
        };
      });

      const startDate = moment.utc(event.startDate);
      const endDate = moment.utc(event.endDate);
      const startAndEndDate = [startDate, endDate];


      const city = getNameOfCityWithTimezone(event.timezone);

      if (city) {
        setSearchCity(city);
      }

      setPanelsMemory(panels.length)

      form.setFieldsValue({
        ...event,
        startAndEndDate,
        panels,
        panelName: panel.panelName,
        numberOfPanelists: panel.numberOfPanelists,
        councilEventPanelId: panel.councilEventPanelId,
        panelStartAndEndDate: [startTime, endTime],
        linkToJoin: panel.linkToJoin,
        timezone: `${city}/${event.timezone}`,
        link: event.linkComments,
        type: panel.typePanel
      });

      setLimit(event.numberOfPanels); //max panels
      setNumOfPanels(event.CouncilEventPanels.length); //total panels
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      getAllEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disableDate = (date = moment(), isPanel = false) => {


    const startAndEndDate = isPanel && form.getFieldValue(["startAndEndDate"]);

    if (startAndEndDate) {
      return (
        moment(date).isBefore(moment()) ||
        (isPanel &&
          moment(date).isBefore(moment(startAndEndDate[0]).startOf("day"))) ||
        (isPanel &&
          moment(date).isAfter(
            moment(startAndEndDate[1]).add(1, "days").startOf("day")
          ))
      );
    } else {
      return (
        moment(date).isBefore(moment()) ||
        (isPanel && moment(date).isBefore(moment().startOf("day")))
      );
    }
  };

  const limitOnChange = (value) => {
    setLimit(+value);
  };

  const checkIfOverTheLimit = (add) => {
    if (numOfPanels <= limit) {
      add();
      setNumOfPanels((state) => state + 1);
    }
  };

  const handleOnFinish = (values) => {
    const timezoneFirstSliceIndex = values.timezone.indexOf("/");
    const convertedStartTime = moment
      .utc(values.startAndEndDate[0].format("YYYY-MM-DD"))
      .format();

    const convertedEndTime = moment
      .utc(values.startAndEndDate[1].format("YYYY-MM-DD"))
      .format();

    const panel = {
      panelName: values.panelName,
      startDate: moment.utc(
        values.panelStartAndEndDate[0].format("YYYY-MM-DD HH:mm")
      ),
      endDate: moment.utc(
        values.panelStartAndEndDate[1].format("YYYY-MM-DD HH:mm")
      ),
      numberOfPanelists: values.numberOfPanelists,
      timezone: values.timezone.slice(
        timezoneFirstSliceIndex + 1,
        values.timezone.length
      ),
      linkToJoin: values.linkToJoin,
      id: values.councilEventPanelId,
      councilEventId: event ? event.id : null,
      type: values.type
    };

    let panels = values.panels || [];

    panels = panels.map((panel) => {
      return {
        ...panel,
        startDate: moment
          .utc(panel.panelStartAndEndDate[0].format("YYYY-MM-DD HH:mm"))
          .format(),
        endDate: moment
          .utc(panel.panelStartAndEndDate[1].format("YYYY-MM-DD HH:mm"))
          .format(),
      };
    });
    panels = [panel, ...panels];

    const transformedValues = {
      ...values,
      id: event ? event.id : null,
      startDate: convertedStartTime,
      endDate: convertedEndTime,
      timezone: values.timezone.slice(
        timezoneFirstSliceIndex + 1,
        values.timezone.length
      ),
      panels,
      status,
      isEdit: edit,
      idEvent: event?.id,
    };

    upsertCouncilEvent(transformedValues, (error) => {
      if (error) {
        notification.error({
          message: "Something went wrong.",
        });
      } else {
        form.resetFields();
        setEvent({});
        setIsDrawerOpen(false);
        setEdit(false);
        getCouncilEvents();
      }
    });
  };

  const handleSubmit = (status) => {
    setStatus(status);
    form.submit();
  };

  const handleEdit = (eve) => {
    setEdit(true);
    setEvent(eve);
    setLimit(event.numberOfPanels);
    setNumOfPanels(event.numberOfPanels);
    setIsDrawerOpen(true);
  };

  const handleCloseEvent = (eve) => {
    upsertCouncilEvent({
      id: eve.id,
      status: "closed",
    });
  };

  const handleConfirmDelete = (id) => {
    deleteCouncilEvent(id);
  };

  const handleSearchCity = (value) => {
    if (value === "") {
      return;
    }

    let timer = setTimeout(() => {
      setSearchCity(value);
      clearTimeout(timer);
    }, 1000);
  };

  const displayPanels = event?.CouncilEventPanels?.map((panel) => {
    return (
      <CouncilEventPanel
        key={panel.id}
        panel={panel}
        tz={event.timezone}
        userTimezone={userTimezone}
        closeMainModal={() => setIsModalOpen(false)}
        councilEventId={event.id}
        getCouncilEvents={() => getCouncilEvents()}
        eventData={event}
      />
    );
  });

  const displayCouncilEvents = allCouncilEvents
    .filter((eve) => {
      if (!userProfile.isExpertCouncilAdmin) {
        return eve.status === "active";
      } else {
        return true;
      }
    })
    .map((eve) => (
      <div
        className="council-event-card2"
        key={eve.eventName}
        onClick={(e) => {
          setEvent(eve);
          setIsModalOpen(true);
        }}
      >
        <div className="council-event-card2-content">
          <div
            className="d-flex justify-between"
            style={{ marginBottom: "1rem", height: '120px' }}
          >
            <div style={{ width: "235px" }}>
              <p className="titulo-card-e">{eve.eventName}</p>
            </div>
            {userProfile.isExpertCouncilAdmin && (
              <div>
                <Tag color={statusColor[eve.status]}>{eve.status}</Tag>
              </div>
            )}
            <p style={{
              position: 'absolute',
              opacity: '0%'
            }} id={`textoACopiar${eve?.id}`}>{process.env.REACT_APP_DOMAIN_URL}{INTERNAL_LINKS.EVENTS_COUNCIL}/{eve?.id}</p>
          </div>
          <div>Start date: {moment.utc(eve.startDate).format("LL")}</div>
          <div style={{ marginBottom: "10px" }}>
            End date: {moment.utc(eve.endDate).format("LL")}
          </div>
          <div style={{ marginTop: "auto" }}>
            {userProfile.isExpertCouncilAdmin ? (
              <>
                <Space wrap>
                  <CustomButton
                    text="Edit"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(eve);
                    }}
                    size="small"
                  />
                  <CustomButton
                    text="Close"
                    type="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseEvent(eve);
                    }}
                    size="small"
                  />
                  <span onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                      title="Are you sure to delete this event?"
                      onConfirm={() => handleConfirmDelete(eve.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <CustomButton text="Delete" type="third" size="small" />
                    </Popconfirm>
                  </span>
                </Space>
                <Space wrap>
                  <div style={{ marginTop: "5px" }}>
                    <CustomButton
                      text="More info"
                      type="third"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEvent(eve);
                        setIsModalOpen(true);
                      }}
                      size="small"
                    />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    <CustomButton
                      text="Copy link"
                      type="third"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let codigoACopiar = document.getElementById(`textoACopiar${eve?.id}`);

                        if (codigoACopiar !== undefined) {
                          let seleccion = document.createRange();
                          seleccion.selectNodeContents(codigoACopiar);
                          window.getSelection().removeAllRanges();
                          window.getSelection().addRange(seleccion);
                          document.execCommand('copy');
                          window.getSelection().removeRange(seleccion);
                        }
                      }}
                      size="small"
                    />
                  </div>
                </Space>
                {(userProfile.role === 'admin' && (userProfile?.email === "morecontrol64@gmail.com" || userProfile?.email === "enrique@hackinghr.io")) && <Space wrap>
                  <CustomButton
                    style={{ marginLeft: '5px' }}
                    text="Exports panels"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      exportCouncilEvents(eve.id)
                    }}
                    size="small"
                  />
                </Space>}
                {(userProfile.role === 'admin' && (userProfile?.email === "morecontrol64@gmail.com" || userProfile?.email === "enrique@hackinghr.io")) && <Space>
                  <CustomButton
                    style={{ marginTop: '5px' }}
                    text="Send email"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedEvent(eve)
                      setOpenPopUpEmails(true)
                    }}
                    size="small"
                  />
                </Space>}
              </>
            ) : (
              <CustomButton
                text="More info"
                type="primary"
                block
                onClick={() => {
                  setEvent(eve);
                  setIsModalOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    ));

  const dataEventSelect = (data) => {

    const eventTitle = form.getFieldValue('eventName')
    const eventDate = form.getFieldValue('panelStartAndEndDate')
    const timezone = form.getFieldValue('timezone')

    const _event = allEvents.find((eve) => eve.id === Number(data))

    const city = getNameOfCityWithTimezone(_event.timezone);

    if (city) {
      setSearchCity(city);
    }

    const startDate = moment.utc(_event.startAndEndTimes[0].startTime);
    const endDate = moment.utc(_event.startAndEndTimes[_event.startAndEndTimes.length - 1].endTime);
    const startAndEndDate = [startDate, endDate];

    if (eventTitle === '' || eventTitle === null || eventTitle === undefined) {
      form.setFieldsValue({
        eventName: _event.title,
      });
    }

    if (eventDate === '' || eventDate === null || eventDate === undefined) {
      form.setFieldsValue({
        startAndEndDate
      });
    }

    if (timezone === '' || timezone === null || timezone === undefined) {
      form.setFieldsValue({
        timezone: `${city}/${_event.timezone}`,
      });
    }

  }

  return (
    <div className="council-events-wrapper"
      onMouseUp={() => {
        setClickModal(false)
      }}
      onMouseDown={(e) => {
        if (e.target.className === 'ant-modal-wrap') {
          setOpenPopUpEmails(false);
          emailsForms.resetFields();
          setIdDraftEmail(-1)
        }
        if (e.target.parentElement.parentElement.id === 'close-email' || e.target.parentElement.id === 'close-email') {
          setOpenPopUpEmails(false);
          emailsForms.resetFields();
          setIdDraftEmail(-1)
        }
        if (e.target.parentElement.parentElement.id === 'close-collapse-draft-email' || e.target.parentElement.id === 'close-collapse-draft-email') {
          setCollapseSearchDraftEamil(false)
          setCollapseSearchSendEmail(false)
        }
        if (e.target.id === 'close-collapse-draft-email-fond') {
          setCollapseSearchDraftEamil(false)
          setCollapseSearchSendEmail(false)
        }
      }}
    >
      <div className="council-event-content">
        {userProfile.isExpertCouncilAdmin && (
          <div
            className="council-event-card"
            onClick={() => {
              setIsDrawerOpen(true);
              form.resetFields();
              setEdit(false);
            }}
          >
            <PlusOutlined style={{ fontSize: "2rem" }} />
          </div>
        )}
        {displayCouncilEvents}
      </div>
      <CustomDrawer
        onClose={() => {
          setEvent({});
          setIsDrawerOpen(false);
          form.resetFields();
          setEdit(false);
        }}
        visible={isDrawerOpen}
        width={520}
      >
        <Form form={form} layout="vertical" onFinish={handleOnFinish}>
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true }]}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            label="Date"
            name="startAndEndDate"
            rules={[{ required: true }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              size="large"
              disabledDate={disableDate}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <CustomInput multiple />
          </Form.Item>
          <Form.Item
            label="Number of panels"
            name="numberOfPanels"
            initialValue="1"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              min="1"
              style={{ width: "100%" }}
              onChange={limitOnChange}
            />
          </Form.Item>
          <Form.Item
            label="Max number of panels a user can join"
            name="maxNumberOfPanelsUsersCanJoin"
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              min="1"
              style={{ width: "100%" }}
              onChange={limitOnChange}
            />
          </Form.Item>

          <Form.Item
            name={"timezone"}
            label="Select the timezone using the city name"
            rules={[{ required: true, message: "City is required." }]}
          >
            <CustomSelect
              showSearch
              options={cities}
              optionFilterProp="children"
              onSearch={(value) => handleSearchCity(value)}
              className="border"
            />
          </Form.Item>

          <Form.Item
            name={"relationEventAdmin"}
            label="Select a event."
          >
            <Select
              onChange={(data) => dataEventSelect(data)}
              showSearch
              placeholder="Select users"
              optionFilterProp="children"
            >
              {allEvents.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Link for comments"
            name="link"
            rules={[{ required: true, type: "url" }]}
          >
            <CustomInput />
          </Form.Item>

          <Form.Item>
            <div>
              <h3>Panel #1</h3>
            </div>
          </Form.Item>
          <Form.Item name="councilEventPanelId" noStyle />
          <Form.Item
            label="Panel name"
            name="panelName"
            rules={[{ required: true }]}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            label="Start And End Date"
            name="panelStartAndEndDate"
            rules={[{ required: true }]}
          >
            <RangePicker
              disabledDate={(date) => disableDate(date, true)}
              style={{ width: "100%" }}
              size="large"
              format="YYYY-MM-DD HH:mm"
              showTime
            />
          </Form.Item>
          <Form.Item
            label="Number of panelists"
            name="numberOfPanelists"
            initialValue="1"
            rules={[{ required: true }]}
          >
            <InputNumber size="large" min="1" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Link to join each panel"
            name="linkToJoin"
            rules={[{ required: true, type: "url" }]}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Checkbox.Group className="d-flex flex-column event-edit-form-cbgrp">
              {EventTypes.map((type) => (
                <CustomCheckbox key={type.value} value={type.value}>
                  {type.text}
                </CustomCheckbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Form.List name="panels">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <FormListPanelItem
                    key={key}
                    restField={restField}
                    index={index}
                    name={name}
                    limit={limit}
                    numOfPanels={numOfPanels}
                    setNumOfPanels={setNumOfPanels}
                    remove={remove}
                    disableDate={disableDate}
                    panelsMemory={panelsMemory}
                    setPanelsMemory={setPanelsMemory}
                  />
                ))}
                {numOfPanels < limit && (
                  <Form.Item>
                    <CustomButton
                      text="Add Panel"
                      onClick={() => checkIfOverTheLimit(add)}
                      icon={<PlusOutlined />}
                      type="ghost"
                    />
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
          <div className="form-btns">
            <Form.Item>
              <CustomButton
                text="Draft"
                type="secondary"
                style={{ marginRight: "1rem" }}
                onClick={() => handleSubmit("draft")}
              />
            </Form.Item>
            <Form.Item>
              <CustomButton
                text="Submit"
                onClick={() => handleSubmit("active")}
              />
            </Form.Item>
          </div>
        </Form>
      </CustomDrawer>
      <CustomModal
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        width={1000}
      >
        <div style={{ padding: "1rem" }}>
          <Space direction="vertical">
            <h2>Event Name: {event?.eventName}</h2>
            <h4>
              Date:{" "}
              {convertToLocalTime(event?.startDate, timezone).format("LL")} -{" "}
              {convertToLocalTime(event?.endDate, timezone).format("LL")} (
              {userTimezone})
            </h4>
            <h4>Description: {event?.description}</h4>
          </Space>
        </div>
        <div>
          <div className="display-panel">{displayPanels}</div>
        </div>
      </CustomModal>
      <Modal
        visible={openPopUpEmails}
        width={900}
        style={{ top: '90px' }}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button onClick={() => {
            setSaveAsDraft(true)
            emailsForms.submit();
          }}>
            Save As Draft
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Send
          </Button>,
        ]}
        closable={true}
        closeIcon={<CloseCircleFilled className="custom-modal-close" id="close-email" />}
      >
        <div className="collapse-search-email-draft" onClick={() => { setCollapseSearchDraftEamil(!collapseSearchDraftEamil); setCollapseSearchSendEmail(false); }}>
          <img className={collapseSearchDraftEamil ? "arrow-collapse" : "arrow"} src={Arrow} alt="arrow" />
          <p className="p-collapse-emails">Search Email Draft</p>
        </div>
        <div className={collapseSearchDraftEamil ? "all-email-draft-collapse" : "all-email-draft"}>
          <div className="container-dat" >
            <div className="header-option-email-draft">Subject / Name</div>
            <div className="header-action">Actions</div>
            <div className="section-exit">
              <CloseOutlined className="custom-modal-close" id="close-collapse-draft-email" style={{ color: "white", fontSize: "15px", fontWeight: "bold" }} />
            </div>
          </div>
          {emailDraftResponse}
        </div>
        <div className={collapseSearchDraftEamil ? "background-fond-collapse" : "background-fond"} id="close-collapse-draft-email-fond"></div>
        <div className="collapse-search-email-draft2" onClick={() => { setCollapseSearchSendEmail(!collapseSearchSendEmail); setCollapseSearchDraftEamil(false); }}>
          <img className={collapseSearchSendEmail ? "arrow-collapse" : "arrow"} src={Arrow} alt="arrow" />
          <p className="p-collapse-emails">Search Email Send</p>
        </div>
        <div className={collapseSearchSendEmail ? "all-email-draft-collapse" : "all-email-draft"}>
          <div className="container-dat-send" >
            <div className="header-option-email-draft">Subject / Name</div>
            <div className="header-action-send">Event title</div>
            <div className="header-action-send2">Date</div>
            <div className="section-exit">
              <CloseOutlined className="custom-modal-close" id="close-collapse-draft-email" style={{ color: "white", fontSize: "15px", fontWeight: "bold" }} />
            </div>
          </div>
          {emailSendResponse}
        </div>
        <div className={collapseSearchSendEmail ? "background-fond-collapse" : "background-fond"} id="close-collapse-draft-email-fond"></div>
        <Form
          form={emailsForms}
          layout="vertical"
          ref={formControlEmail}
          onFinish={(data) => {
            onFinishEmail(data)
          }}
          onMouseDown={() => {
            setClickModal(true)
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <CustomInput />
          </Form.Item>
          <Form.Item name="replyToEmail" label="Reply-To Email">
            <CustomInput disabled />
          </Form.Item>
          <Form.Item
            label="To"
            name="to"
            size="large"
            rules={[{ required: true, message: 'To is required' }]}
          >
            <Select
              style={{ width: "100%" }}
              mode="multiple"
              onChange={(value) => {
                quitAllUsers(value)
              }}
              className={clsx("custom-select", { border: "bordered" })}
              optionFilterProp="children"
            >
              <Option key={-1} value={'all'}>All users</Option>
              {((selectedEvent?.CouncilEventPanels !== undefined)
                ? selectedEvent?.CouncilEventPanels[0] !== undefined
                : selectedEvent?.CouncilEventPanels !== undefined) && selectedEvent?.CouncilEventPanels.map((data) => {
                  return (
                    <Option key={data?.id} value={data?.id}>
                      {`${data?.panelName}`}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Subject is required' }]}>
            <CustomInput />
          </Form.Item>
          <Form.Item
            label="Message"
            validateStatus={description.validateStatus}
            required
          >
            <FroalaEdit
              s3Hash={s3Hash}
              value={{ html: description.value }}
              onChange={onChangeDescription}
              additionalConfig={{
                placeholderText: "Add message...",
                toolbarButtons: [
                  "bold",
                  "italic",
                  "strikeThrough",
                  "paragraphFormat",
                  "align",
                  "formatOL",
                  "formatUL",
                  "indent",
                  "outdent",
                ],
              }}
            />
            {bulMessageRequired && <p className="message-required" >Message is required</p>}
            {bulMessageLimitText && <p className="message-required" >the content must have more than 10 characters</p>}
          </Form.Item>
          <Form.Item label="Send Test Message To">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
              <CustomInput onChange={(e) => { setValueTestEmail(e) }} />
              <CustomButton
                htmlType="button"
                text={"Send Test"}
                type={"primary"}
                size="sm"
                style={{ marginLeft: "30px" }}
                onClick={() => {
                  setTestActive(true)
                  emailsForms.submit();
                }}
              />
            </div>
            {bulMessageRequiredTestEmail && <p className="message-required" >Test email is required</p>}
            {messageRequiredTestEmail && <p className="message-required" >This is not a valid email!</p>}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        className={clsx("custom-modal")}
        wrapClassName={clsx("custom-modal-wrap")}
        title={
          <div
            className="custom-modal-title"
            style={{
              paddingLeft: '20px',
              paddingRight: '20px',
              display: 'flex',
              justifyContent: "center",
              alignItems: 'start'
            }}
          >
            <p style={{ margin: '10px', marginTop: '20px' }}>When you click CONFIRM your email will be immediately sent. BUT, before you click on confirm:</p>
            <ul>
              <li style={{ margin: '10px', marginLeft: '30px', fontWeight: '400', color: 'black' }}>
                Did you send yourself a test email to check the format, title, etc.?
              </li>
              <li style={{ margin: '10px', marginLeft: '30px', fontWeight: '400', color: 'black' }}>
                Did you add a signature to your email?
              </li>
            </ul>
            <p style={{ margin: '10px', marginBottom: '20px' }}>If yes, then it is good time to send your email. Thank you!</p>
            <div className="custom-modal-logo">
              <img src={IconLogo} alt="custom-logo" />
            </div>
          </div>
        }
        centered
        onCancel={() => setOpenPopUpConfirmEmail(false)}
        visible={openPopUpConfirmEmail}
        closable={true}
        footer={[]}
        width={"450px"}
        closeIcon={<CloseCircleFilled className="custom-modal-close" />}
      >
        <div className="container-buttons">
          <CustomButton
            key="Cancel"
            text="Cancel"
            type="primary outlined"
            size="xs"
            className="button-modal"
            style={{ padding: "0px 10px" }}
            onClick={() => setOpenPopUpConfirmEmail(false)}
          />
          <CustomButton
            key="Confirm"
            text="Confirm"
            type="primary"
            size="xs"
            className="button-modal"
            style={{ padding: "0px 10px", marginLeft: "10px" }}
            onClick={() => {
              setOpenPopUpConfirmEmail(false)
              handleConfirm()
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...councilEventSelector(state),
  allEvents: eventSelector(state).allEvents,
  userProfile: homeSelector(state).userProfile,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
  ...councilEventActions,
  getAllEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilEvents);
