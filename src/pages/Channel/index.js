import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import clsx from "clsx";

import { CustomButton, CardMenu, CustomInput, FroalaEdit, CustomSelect } from "components";
import { Form, Select, Modal, Table, Space, Button, notification} from "antd";
import Login from "pages/Login2";
import { INTERNAL_LINKS, USER_ROLES, TABS_CHANNELS, COUNTRIES, PROFILE_SETTINGS, } from "enum";
import ChannelDrawer from "containers/ChannelDrawer";
// import ChannelFilterPanel from "./ChannelFilterPanel";
import ResourcesList from "./ResourcesList";
import PodcastsList from "./PodcastsList";
import EventsList from "./EventsList";
import BlogList from "./BlogsList";
import Followers from "./Followers";
import InvitPeople from "./InvitPeople";

import { getUser } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { envSelector } from "redux/selectors/envSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import { convertToLocalTime} from "utils/format";
import {
  setFollowChannel,
  unsetFollowChannel,
  getChannelForName,
  downloadFollowersChannels,
  setNewsChannelEditor,
  getChannelEditor,
  deleteChannelEditor,
  sendEmailAttendeeChannelOwner,
  addEmailDraftChannel,
  getAllEmailDraftChannel,
  deleteEmailDraftChannel,
  copyEmailSendChannel,
  getAllEmailSendChannel
} from "redux/actions/channel-actions";
import { searchUser } from "redux/actions/home-actions"
import { capitalizeWord } from "utils/format";

import IconBack from "images/icon-back.svg";
import IconMenu from "images/icon-menu.svg";
import IconLogo from "images/logo-sidebar.svg";
import { CloseCircleFilled, CloseOutlined, CaretRightOutlined, CaretLeftOutlined} from "@ant-design/icons";
import Arrow from "../../images/arrow-conference.svg"
import moment from 'moment'

import "./style.scss";

const Channel = ({
  history,
  selectedChannel,
  channelLoading,
  userProfile,
  setFollowChannel,
  unsetFollowChannel,
  getChannelForName,
  allCategories,
  followers,
  searchUsers,
  searchUser,
  downloadFollowersChannels,
  setNewsChannelEditor,
  getChannelEditor,
  deleteChannelEditor,
  userChannelEditor,
  channelOptimizate,
  getUser,
  s3Hash,
  sendEmailAttendeeChannelOwner,
  addEmailDraftChannel,
  emailDraftChannel,
  getAllEmailDraftChannel,
  deleteEmailDraftChannel,
  copyEmailSendChannel,
  getAllEmailSendChannel,
  emailSendChannel
}) => {
  const selectDiv = useRef()
  const firstSelect = useRef()
  const contentBackground = useRef() 
  const widthTab = useRef()
  const selectInvit = useRef()
  const { pathname } = useLocation();
  const [rolesCHannelsForms] = Form.useForm();
  const [emailsForms] = Form.useForm();
  const formControlEmail = useRef(null);
  // const query = new URLSearchParams(search);

  // const [currentTab, setCurrentTab] = useState(query.get("tab") || "0");
  const [isChannelOwner, setIsChannelOwner] = useState(true);
  const [isChannelEditor, setIsChannelEditor] = useState(true);
  const [heightData, setHeightData] = useState(`0px`)
  const [tabData, setTabData] = useState(0)
  const [type, setType] = useState(undefined)
  // const [filter, setFilter] = useState({});
  const [followed, setFollowed] = useState(false);
  const [dataCategoriesState, setDataCategoriesState] = useState()
  const [openCannelDrawer, setOpenChannelDrawer] = useState(false);
  const [openPopUpSpeakers, setOpenPopUpSpeakers] = useState(false);
  const [openPopUpEmails, setOpenPopUpEmails] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [backToFollowers, setBackToFollowers] = useState([])
  const [bulMessageRequired, setBulMessageReqired] = useState(false)
  const [clickModal, setClickModal] = useState(false)
  const [openPopUpConfirmEmail, setOpenPopUpConfirmEmail] = useState(false)
  const [collapseSearchDraftEamil, setCollapseSearchDraftEamil] = useState(false)
  const [testActive, setTestActive] = useState(false)
  const [bulMessageRequiredTestEmail, setBulMessageRequiredTestEmail] = useState(false)
  const [messageRequiredTestEmail, setMessageRequiredTestEmail] = useState(false)
  const [valueTestEmail, setValueTestEmail] = useState('')
  const [saveAsDraft, setSaveAsDraft] = useState(false)
  const [idDraftEmail, setIdDraftEmail] = useState(-1)
  const [bulInviteModal, setBulInviteModal] = useState(false)
  const [bulSelectOptionResponsiveInvite, setBulSelectOptionResponsiveInvite] = useState(false)
  const [bulNext, setBulNext] = useState(false);
  const [description, setDescription] = useState({
    value: "",
    validateStatus: null,
  });
  const [idPeopleSendInvitation, setIdPeopleSendInvitation] = useState([])
  const [dataSelected, setDataSelected] = useState({
    location: [],
    recentJobLevel: [],
    sizeOfOrganization: [],
    topicsOfInterest: [],
    search: ''
  })

  let clock;
  const { Option } = Select;

  useEffect(() => {
    let objectAllCategories = {}

    allCategories.forEach((category) => {
      objectAllCategories[`${category.value}`] = category.title
    })

    setDataCategoriesState(objectAllCategories)
  }, [allCategories, setDataCategoriesState])

  const onChangeDescription = (e) => {
    setDescription({ ...validateDescription(e.html), value: e.html });
  };

  // useEffect(() => {
  //   if (query.get("tab") === "blogs") {
  //     setCurrentTab("4");
  //     history.replace({
  //       pathname: pathname,
  //       search: "",
  //     });
  //   }
  // }, [query, history, pathname]);

  // const onFilterChange = (values) => {
  //   setFilter(values);
  // };

  const handleSearchSpeakers = (data) => {
    if(data !== ""){
      searchUser(data)
    }
  }

  const validateDescription = (value) => {
    if (value.length > 0)
      return {
        validateStatus: "success",
      };

    return {
      validateStatus: "error",
    };
  };

  const followChannel = () => {
    if (followed) {
      unsetFollowChannel(selectedChannel);
    } else {
      setFollowChannel(selectedChannel);
    }
  };

  useEffect(() => {
    if (userProfile && selectedChannel) {
      setIsChannelOwner(
        userProfile.role === USER_ROLES.CHANNEL_ADMIN &&
          !!userProfile.channel &&
          userProfile.channel === selectedChannel.id
      );
      setIsChannelEditor(
        userProfile.role === USER_ROLES.CHANNEL_CONTENT_EDITOR &&
          !!userProfile.channel &&
          userProfile.channel === selectedChannel.id
      )
      setFollowed(
        (selectedChannel.followedUsers || []).includes(userProfile.id)
      );
    }
  }, [userProfile, selectedChannel]);

  const fixNameUrl = (name) => {

    let spaces = name.split("-").length - 1
    let spaces2 = name.split("_").length - 1
    let newTitle = name

    for(let i = 0; i < Number(spaces) ; i++){
      newTitle = newTitle.replace("-"," ")
    }

    for(let i = 0; i < Number(spaces2) ; i++){
      newTitle = newTitle.replace("_","'")
    }

    return newTitle
  }

  useEffect(() => {
      let isMounted = true;
      let pathNameFixed = pathname.substring(1,pathname.length)
      
      if (pathname && channelOptimizate && selectedChannel?.name !== fixNameUrl(pathNameFixed)) {
        getChannelForName( JSON.stringify({name: fixNameUrl(pathNameFixed)}) , (error) => {
          if (isMounted && error) {
            history.push(INTERNAL_LINKS.NOT_FOUND);
          }
        });
      }

      if(localStorage.getItem("community") !== null){
        getChannelEditor(selectedChannel?.id)
        getAllEmailDraftChannel(selectedChannel?.id)
        getAllEmailSendChannel(selectedChannel?.id)
        getUser()
      }
  
      return () => {
        isMounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const selectTabs = (e, index) => {
    setTabData(index)
    if(e !== undefined){
      selectDiv.current.style.cssText = `left: ${e.target.offsetLeft}px; width: ${e.target.clientWidth}px; display: 'block'`
      clearTimeout(clock)
      clock = setTimeout(() => {
        setHeightData(`${Number(contentBackground?.current?.clientHeight) + 15}px`)
      }, 100)
    }
  }

  const loadFunction = () => {
    setHeightData(`${Number(contentBackground?.current?.clientHeight) + 15}px`) 
  } 

  const onChannelCreated = (data) => {
    setOpenChannelDrawer(false);
    getUser()
    getChannelForName( fixNameUrl(data) , (error) => {
      if (error) {
        if(data !== undefined){
          history.push(data);
        }else{
          history.push(INTERNAL_LINKS.NOT_FOUND)
        }
      }
    });
    if(localStorage.getItem("community") !== null){
      getChannelEditor(selectedChannel?.id)
      getAllEmailDraftChannel(selectedChannel?.id)
      getAllEmailSendChannel(selectedChannel?.id)
      getUser()
    }
  };

  const dataSourceColumnsContentEditors = [
    {
      title: "Profile",
      dataIndex: "firstName",
      key: "1",
      width:300,
      align: "center",
      render: (text, record) => {
        return (
          <Followers
            followers={record}
          />
        )
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "2",
      width:250,
      align: "center",
      render: () => {
        return ('Content editor')
      },
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      align:"center",
      width: 150,
      render: (_, data) => (
        <Space>
          <CustomButton
            text="Delete"
            size="sm"
            style={{padding:"0px 10px"}}
            onClick={() => {
              if(isChannelOwner){
                deleteChannelEditor(data?.id, (err) => {
                  if(!err){
                    if(localStorage.getItem("community") !== null){
                      getChannelEditor(selectedChannel?.id)
                    }
                  }
                })
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const dataEmailsSends = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "1",
      width:250,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "2",
      width:250,
      align: "center",
      render: (text, record) => {
        return (`${convertToLocalTime(record.date, moment.tz.guess()).format("MM-DD-YYYY hh:mm a")}`)
      },
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      align:"center",
      width: 150,
      render: (_, data) => (
        <Space>
          <CustomButton
            text="Copy"
            size="sm"
            style={{padding:"0px 10px"}}
            onClick={() => {
              if(isChannelOwner || isChannelEditor){
                setOpenPopUpEmails(true);
                copyEmailSendChannel(data, (err) => {
                  if(!err && formControlEmail?.current !== undefined){
                    description.value = data.message
                    formControlEmail.current.setFieldsValue({
                      name: data.name,
                      to: data.to,
                      subject: data.subject,
                    });
                    getAllEmailDraftChannel(selectedChannel?.id)
                  }
                })
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const onFinishEmail = (data) => {
    let values
    let comprobadorEmail = /\w+@\w+\.+[a-z]/;

    values = {
      ...data,
      idChannel: selectedChannel.id,
      id: idDraftEmail,
      message: description.value,
      test: testActive,
      testEmail: valueTestEmail,
      nameChannel: selectedChannel.name,
      to: (data.to[0] === 'all') ? followers.map((data) => data.id) : data.to,
    }

    if(values.message === ''){
      setBulMessageReqired(true)
      setTimeout(() => {
        setBulMessageReqired(false)
      }, 2000);
      return
    }
    if(values.testEmail === '' && testActive === true){
      setBulMessageRequiredTestEmail(true)
      setTestActive(false)
      setTimeout(() => {
        setBulMessageRequiredTestEmail(false)
      }, 2000);
      return
    }
    if(!comprobadorEmail.test(values.testEmail) && values.testEmail !== '' && testActive === true){
      setMessageRequiredTestEmail(true)
      setTestActive(false)
      setTimeout(() => {
        setMessageRequiredTestEmail(false)
      }, 2000);
      return
    }

    if(saveAsDraft){
      addEmailDraftChannel(values, () => {
        setSaveAsDraft(false)
        setOpenPopUpEmails(false); 
        emailsForms.resetFields(); 
        description.value = ''
        if(idDraftEmail !== -1){
          if(localStorage.getItem("community") !== null){
            getAllEmailDraftChannel(selectedChannel?.id)
            getAllEmailSendChannel(selectedChannel?.id) 
            notification.success({
              message: "Email draft edit successflly",
            });
          }
        }else{
          notification.success({
            message: "Email draft add successflly",
          });
        }
        setIdDraftEmail(-1)
      })
    }else{
      sendEmailAttendeeChannelOwner(values, () => {
        if(!testActive){
          if(localStorage.getItem("community") !== null){
            getAllEmailSendChannel(selectedChannel?.id)
            getAllEmailDraftChannel(selectedChannel?.id)
          }
          setOpenPopUpEmails(false)
          emailsForms.resetFields()
          description.value = ''
          setIdDraftEmail(-1)
        }else{
          setTestActive(false)
        }
      })
    }
    
  }

  const quitAllFollowers = (data) => {
    let newData = []

    let bul = data.filter((value) => value === 'all')
    let bul2 = backToFollowers.filter((value) => value === 'all')

    if(backToFollowers.length > 0 && bul2[0]){

      data.forEach((value) => {
        if(value !== 'all'){
          newData.push(value)
        }
      })

      formControlEmail.current.setFieldsValue({
        to: newData
      });

      setBackToFollowers(newData)

    }else if(backToFollowers.length > 0 && bul[0]){

      data.forEach((value) => {
        if(value === 'all'){
          newData.push(value)
        }
      })

      formControlEmail.current.setFieldsValue({
        to: newData
      });

      setBackToFollowers(newData)

    }else{

      setBackToFollowers(data)

    }

  }

  useEffect(() => {
    if(formControlEmail?.current !== undefined && formControlEmail?.current !== null){
      formControlEmail.current.setFieldsValue({
        replyToEmail: userProfile?.email
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopUpEmails])

  const handleOk = () => {
    setOpenPopUpConfirmEmail(true)
  }

  const handleConfirm = () => {
    emailsForms.submit();
  }

  const handleCancel = () => {
    if(!clickModal){
      setOpenPopUpEmails(false); 
      emailsForms.resetFields(); 
      description.value = ''
    }
  }

  const handleInvite = () => {

    let pathNameFixed = pathname.substring(1,pathname.length)
    let values

    values = {
      linkChannel: pathNameFixed,
      to: idPeopleSendInvitation.map((data) => data.id),
      invitePeople: true,
      replyToEmail: userProfile?.email,
      nameChannel: selectedChannel.name,
      idChannel: selectedChannel.id,
    }

    if(isChannelOwner || isChannelEditor){
      sendEmailAttendeeChannelOwner(values, () => {
        setIdPeopleSendInvitation([])
        setBulInviteModal(false)
        setDataSelected({
          location: [],
          recentJobLevel: [],
          sizeOfOrganization: [],
          topicsOfInterest: [],
          search: ''
        })
      })
    }
  }

  useEffect(() => {
    let where = {}
    let clock2;

    if(dataSelected.location[0] !== undefined){
      where = {
        ...where,
        location: dataSelected.location
      }
    }
    if(dataSelected.recentJobLevel[0] !== undefined){
      where = {
        ...where,
        recentJobLevel: dataSelected.recentJobLevel
      }
    }
    if(dataSelected.sizeOfOrganization[0] !== undefined){
      where = {
        ...where,
        sizeOfOrganization: dataSelected.sizeOfOrganization
      }
    }
    if(dataSelected.topicsOfInterest[0] !== undefined){
      where = {
        ...where,
        topicsOfInterest: dataSelected.topicsOfInterest
      }
    }
    if(dataSelected.search !== ''){
      where = {
        ...where,
        search: dataSelected.search
      }
    }

    if(Object.entries(where)[0] !== undefined){
      clearTimeout(clock2)
      clock2 = setTimeout(() => {
        searchUser({
          channel: true,
          ...where
        })
      }, 250);
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSelected])

  return (
    <div 
      className="channel-page" 
      onLoad={() => loadFunction()} 
      onMouseUp={() => {
        setClickModal(false)
      }}
      onMouseDown={(e) => {
        if(e.target?.className === 'ant-modal-wrap'){
          setOpenPopUpEmails(false); 
          setBulInviteModal(false)
        }
        if(e.target?.parentElement?.parentElement?.id === 'close-email' || e.target?.parentElement?.id === 'close-email'){
          setOpenPopUpEmails(false); 
          setBulInviteModal(false)
        }
        if(e.target?.parentElement?.parentElement?.id === 'close-collapse-draft-email' || e.target?.parentElement?.id === 'close-collapse-draft-email'){
          setCollapseSearchDraftEamil(false)
        }
        if(e.target?.id === 'close-collapse-draft-email-fond'){
          setCollapseSearchDraftEamil(false)
        }
      }}
    >
      {/* <ChannelFilterPanel onChange={onFilterChange} /> */}
      <div className="channel-page__container">
        {localStorage.getItem("community") !== null && 
          <Link to={INTERNAL_LINKS.CHANNELS} >
            <div className="channel-page__content-top">
              <div className="channel-page__content-top-back">
                <img src={IconBack} alt="icon-back" />
              </div>
              <h4>Back to Channels</h4>
            </div>
          </Link>
        }
        <div className="channel-page__results">
          <div className="channel-page__row" ref={contentBackground}>
            <div className="background-forms" style={{height: heightData}}>

            </div>
            <div className="channel-info__user">
              {selectedChannel?.image2 ? (
                <img src={selectedChannel?.image2} alt="user-icon" />
              ) : (
                <div className="container-image">
                  <h3>{"Upload image (900 x 175 px)"}</h3>
                </div>
              )}
              {(isChannelOwner || isChannelEditor) && <div className="pencil-container" onClick={() => {setOpenChannelDrawer(true); setType('bannerImage')}}>
                <div className="pencil"></div>
              </div>}
            </div>
            <div className="channel-page__info-column">
              {!isEmpty(selectedChannel) && (
                <>
                  {(isChannelOwner || isChannelEditor) && <div className="pencil-container" onClick={() => {setOpenChannelDrawer(true); setType('content')}}>
                    <div className="pencil"></div>
                  </div>}
                  <div className="channel-info__general-info">
                    <p className="channel-info__name">
                      {selectedChannel.name}
                    </p>
                    <p className="channel-info__description">
                      {selectedChannel.description}
                    </p>
                    <div className="channel-info__topics">
                      <div className="content-title-channel-topics">
                        <span>Channel Topics: </span>
                      </div>
                      <div className="container-topics">
                        {(dataCategoriesState !== undefined) && selectedChannel?.categories?.map((category,index) => (
                          <span>{capitalizeWord(dataCategoriesState[category])} {selectedChannel?.categories[index + 1] && `|`}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                      <CustomButton
                        htmlType="button"
                        text={followed ? "Followed" : "Follow Channel"}
                        type={followed ? "secondary" : "primary"}
                        size="sm"
                        style={{marginLeft: "30px"}}
                        loading={channelLoading}
                        onClick={() => {
                          if(localStorage.getItem("community") !== null){
                            followChannel()
                          }else{
                            setRegisterModal(true)
                          }
                        }}
                      />
                      <CustomButton
                        htmlType="button"
                        text="Invite"
                        size="sm"
                        style={(isChannelOwner || isChannelEditor) ? {marginLeft: "30px", display: "inline-block"} : {marginLeft: "30px", display: "none"}}
                        onClick={() => {setBulInviteModal(true)}}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="channel-page__content">
              <div className="tabs-channels" ref={widthTab}>
                <div className="calc-with-tabs">
                  <p 
                    ref={firstSelect}
                    className={(tabData === 0) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 0 )}}
                  >Home</p>
                  <p 
                    className={(tabData === 1) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 1 )}}
                  >Resources</p>
                  <p 
                    className={(tabData === 2) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 2 )}}
                  >Podcasts</p>
                  <p 
                    className={(tabData === 3) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 3 )}}
                  >Videos</p>
                  <p 
                    className={(tabData === 4) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 4 )}}
                  >Events</p>
                  <p 
                    className={(tabData === 5) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 5 )}}
                  >Blogs</p>
                  <p
                    className={(tabData === 6) ? "select" : ""}
                    onClick={(e) => {selectTabs( e , 6 )}}
                  >Followers</p>
                  {(isChannelOwner || isChannelEditor) && <p
                    className={(tabData === 7) ? "select" : ""}
                    onClick={(e) => {
                      selectTabs( e , 7 ); 
                      if(localStorage.getItem("community") !== null){
                        getChannelEditor(selectedChannel?.id)
                      }
                    }}
                  >Admin Tools</p>}
                </div>
                <div className="box-select" ref={selectDiv} style={{left: "15px", width: "80px", display: 'block'}}></div>
                <div 
                  className="container-card-menu"
                  style={(widthTab?.current?.clientWidth > widthTab?.current?.children[0]?.clientWidth) ?
                    {display: 'none'} :
                    {display: "flex"}
                  }
                >
                  <CardMenu 
                    menus={
                      (isChannelOwner || isChannelEditor) ? 
                      TABS_CHANNELS : 
                      TABS_CHANNELS.slice(1,Object.entries(TABS_CHANNELS).length-2)
                    } 
                    onClick={(value) => {
                      selectDiv.current.style.cssText = `left: 15px; width: 80px; display: none;`
                      if(value === 7){
                        if(localStorage.getItem("community") !== null){
                          getChannelEditor(selectedChannel?.id)
                        }
                      }
                      selectTabs( undefined , value )
                    }} 
                    container={widthTab.current}
                  >
                    <div className="library-card-menu-tab">
                      <img src={IconMenu} alt="icon-menu" />
                    </div>
                  </CardMenu>
                </div>
              </div>
              {(tabData === 0) &&
                <div>
                  {(selectedChannel?.librariesResources > 0) &&
                    <div className="card-content-home">
                      <h3>Resources</h3>
                      <ResourcesList
                        type="article"
                        refresh={tabData === 0}
                        isOwner={isChannelOwner}
                        isEditor={isChannelEditor}
                        limit={2}
                        buttomEdit={'home'}
                      />
                    </div>
                  } 
                  {(selectedChannel?.podcast > 0) &&
                    <div className="card-content-home">
                      <h3>Podcasts</h3>
                      <PodcastsList 
                        isOwner={isChannelOwner}
                        isEditor={isChannelEditor} 
                        limit={2}
                        buttomEdit={'home'}
                      />
                    </div>
                  }
                  {(selectedChannel?.librariesVideos > 0) &&
                    <div className="card-content-home">
                      <h3>Videos</h3>
                      <ResourcesList
                        type="videoHome"
                        refresh={tabData === 0}
                        isOwner={isChannelOwner}
                        isEditor={isChannelEditor}
                        limit={2}
                        buttomEdit={'home'}
                      />
                    </div>
                  }
                  {(selectedChannel?.channelEvents > 0) &&
                    <div className="card-content-home">
                      <h3>Events</h3>
                      <EventsList 
                        isOwner={isChannelOwner}
                        isEditor={isChannelEditor}
                        limit={2}
                        buttomEdit={'home'}
                      />
                    </div>
                  } 
                  {(selectedChannel?.blogsPostByChannel > 0) &&
                    <div className="card-content-home">
                      <h3>Blogs</h3>
                      <BlogList
                        isOwner={isChannelOwner}
                        isEditor={isChannelEditor}
                        limit={2}
                        buttomEdit={'home'}
                      />
                    </div>
                  } 
                </div>
              }
              {(tabData === 1) && (
                <div className="card-content-home">
                  <h3>Resources</h3>
                  <ResourcesList
                    type="article"
                    refresh={tabData === 1}
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor}
                    limit={'all'}
                    buttomEdit={'resources'}
                  />
                </div>
              )}
              {(tabData === 2) && (
                <div className="card-content-home">
                  <h3>Podcasts</h3>
                  <PodcastsList 
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor} 
                    limit={'all'}
                    buttomEdit={'Podcasts'}
                  />
                </div>
              )}
              {(tabData === 3) && (
                <div className="card-content-home">
                  <h3>Videos</h3>
                  <ResourcesList
                    type="video"
                    refresh={tabData === 3}
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor}
                    limit={'all'}
                    buttomEdit={'Videos'}
                  />
                </div>
              )}
              {(tabData === 4) && (
                <div className="card-content-home">
                  <h3>Events</h3>
                  <EventsList 
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor}
                    limit={'all'}
                    buttomEdit={'Events'}
                  />
                </div>
              )}
              {(tabData === 5) && (
                <div className="card-content-home">
                  <h3>Blogs</h3>
                  <BlogList
                    isOwner={isChannelOwner}
                    isEditor={isChannelEditor}
                    limit={'all'}
                    buttomEdit={'Blogs'}
                  />
                </div>
              )}
              {(tabData === 6) && (
                <div className="card-content-home">
                <h3>Followers</h3>
                <div className="ajust-contain">
                  {followers?.map((user, index) => (
                    <div key={index}>
                      <Followers
                        followers={user}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
              )}
              {(tabData === 7 && localStorage.getItem("community") !== null) && (
                <div>
                  <div className="card-content-home">
                    <div className="ajust-buttoms">
                      {(isChannelOwner || isChannelEditor) && <div className="content-botton">
                        <CustomButton
                          htmlType="button"
                          text={"Download list of followers"}
                          type={"primary"}
                          size="sm"
                          onClick={() => {downloadFollowersChannels(selectedChannel?.id)}}
                        />
                      </div>}
                      {(isChannelOwner || isChannelEditor) && <div className="content-botton">
                        <CustomButton
                          htmlType="button"
                          text={"Create New Email To Followers"}
                          type={"primary"}
                          size="sm"
                          onClick={() => {
                            setOpenPopUpEmails(true)
                          }}
                        />
                      </div>}
                      {isChannelOwner && <div className="content-botton">
                        <CustomButton
                          htmlType="button"
                          text={"Add content editor"}
                          type={"primary"}
                          size="sm"
                          onClick={() => {setOpenPopUpSpeakers(true)}}
                        />
                      </div>}
                    </div>
                  </div>
                  {isChannelOwner && 
                    <div className="card-content-home">
                      <h4>Content Editor</h4>
                      <div>
                        <Table
                          dataSource={userChannelEditor}
                          columns={dataSourceColumnsContentEditors}
                          rowKey="id"
                          pagination={false}
                          scroll={(window.clientWidth <= 1500) ? { y: "400px", x: "100vw" } : { y: "400px", x: "100px" }}
                          style={{testAlign:"center"}}
                        />
                      </div>
                    </div>
                  }
                  {(isChannelOwner || isChannelEditor) && 
                    <div className="card-content-home">
                      <h4>Emails Sent</h4>
                      <div>
                        <Table
                          dataSource={emailSendChannel}
                          columns={dataEmailsSends}
                          rowKey="id"
                          pagination={false}
                          scroll={(window.clientWidth <= 1500) ? { y: "330px", x: "100vw" } : { y: "330px", x: "100px" }}
                          style={{testAlign:"center"}}
                        />
                      </div>
                    </div>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChannelDrawer
        visible={openCannelDrawer}
        edit={true}
        onClose={() => setOpenChannelDrawer(false)}
        onCreated={onChannelCreated}
        type={type}
        history={history}
      />
      <Modal
        visible={openPopUpSpeakers}
        onCancel={() => {setOpenPopUpSpeakers(false)}}
        onOk={() => {
          rolesCHannelsForms.submit();
        }}
      >
        <Form
          form={rolesCHannelsForms}
          layout="vertical"
          onFinish={(data) => {
            setNewsChannelEditor({
              idUsers:data?.Users, 
              channelId:selectedChannel?.id
            }, (err) => {
              if(!err){
                setOpenPopUpSpeakers(false)
                if(localStorage.getItem("community") !== null){
                  getChannelEditor(selectedChannel?.id)
                }
              }
            })
          }}
        >
          <Form.Item
              label="Users"
              name="Users"
              size="large"
            >
              <Select 
                style={{ width: "100%" }} 
                mode="multiple" 
                onKeyUp={(e) => {
                  handleSearchSpeakers(e.target.value);
                }}
                optionFilterProp="children"
              >
                {searchUsers !== undefined ? searchUsers.map((users) => {

                  return (
                    <Option key={users.id} value={users.id}>
                      {`${users.firstName} / ${users.email}`}
                    </Option>
                  )
                  }): <div style={{display: "none"}}></div>}
              </Select>
          </Form.Item> 
        </Form>
      </Modal>
      <Modal
        visible={openPopUpEmails}
        width={900}
        style={{top: '90px'}}
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
        <div className="collapse-search-email-draft" onClick={() => setCollapseSearchDraftEamil(!collapseSearchDraftEamil)}>
          <img className={collapseSearchDraftEamil ? "arrow-collapse" : "arrow"} src={Arrow} alt="arrow"/>
          <p className="p-collapse-emails">Search Email Draft</p>
        </div>
        <div className={collapseSearchDraftEamil ? "all-email-draft-collapse" : "all-email-draft"}>
          <div className="container-dat" >
            <div className="header-option-email-draft">Subject / Name</div>
            <div className="header-action">Actions</div>
            <div className="section-exit">
              <CloseOutlined className="custom-modal-close" id="close-collapse-draft-email" style={{color:"white", fontSize: "15px", fontWeight: "bold"}} />
            </div>
          </div>
          {
            emailDraftChannel?.map((email) => {
              return(
                <div className="container-dat">
                  <div 
                    className="container-option-email-draft"
                    onClick={() => {
                      description.value = email.message
                      formControlEmail.current.setFieldsValue({
                        name: email.name,
                        to: email.to,
                        subject: email.subject,
                      });
                      setIdDraftEmail(email.id)
                      setCollapseSearchDraftEamil(false)
                    }}
                  >
                      {email?.subject} / {email?.name}
                  </div>
                  {/* <div className="container-action">
                    <CustomButton
                      htmlType="button"
                      text={"Edit"}
                      type={"primary"}
                      size="sm"
                      onClick={() => {
                        description.value = email.message
                        formControlEmail.current.setFieldsValue({
                          name: email.name,
                          to: email.to,
                          subject: email.subject,
                        });
                        setEditEmailDraft(true)
                        setIdDraftEmail(email.id)
                        setCollapseSearchDraftEamil(false)
                      }}
                    />
                  </div> */}
                  <div className="container-action">
                  <CustomButton
                      htmlType="button"
                      text={"Delete"}
                      type={"primary"}
                      size="sm"
                      onClick={() => {
                        deleteEmailDraftChannel(email.id, () => {
                          getAllEmailDraftChannel(selectedChannel?.id)
                        })
                      }}
                    />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={collapseSearchDraftEamil ? "background-fond-collapse" : "background-fond"} id="close-collapse-draft-email-fond"></div>
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
                  quitAllFollowers(value)
                }}
                className={clsx("custom-select", { border: "bordered" })}
                optionFilterProp="children"
              >
                <Option key={-1} value={'all'}>All followers</Option>
                {followers.map((users) => {
                  return (
                    <Option key={users.id} value={users.id}>
                      {`${users.firstName} / ${users.titleProfessions}`}
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
          </Form.Item>
          <Form.Item label="Send Test Message To">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
              <CustomInput onChange={(e) => {setValueTestEmail(e)}} />
              <CustomButton
                htmlType="button"
                text={"Send Test"}
                type={"primary"}
                size="sm"
                style={{marginLeft: "30px"}}
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
        visible={registerModal}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => setRegisterModal(false)}
      >
        <Login
          login={true}
          signUp={false}
          history={null}
          match={{ params: {} }}
          modal={setRegisterModal}
          onClose={() => setRegisterModal(false)}
        />
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
                <p style={{margin: '10px', marginTop: '20px'}}>When you click CONFIRM your email will be immediately sent. BUT, before you click on confirm:</p>
                <ul>
                  <li style={{margin: '10px', marginLeft: '30px', fontWeight: '400', color: 'black'}}>
                    Did you send yourself a test email to check the format, title, etc.?
                  </li>
                  <li style={{margin: '10px', marginLeft: '30px', fontWeight: '400', color: 'black'}}>
                    Did you add a signature to your email?
                  </li>
                </ul>
                <p style={{margin: '10px', marginBottom: '20px'}}>If yes, then it is good time to send your email. Thank you!</p>
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
                  style={{padding: "0px 10px"}}
                  onClick={() => setOpenPopUpConfirmEmail(false)}
              />
              <CustomButton
                  key="Confirm"
                  text="Confirm"
                  type="primary"
                  size="xs"
                  className="button-modal"
                  style={{padding: "0px 10px", marginLeft: "10px"}}
                  onClick={() => {
                    setOpenPopUpConfirmEmail(false)
                    handleConfirm()
                  }}
              />
          </div>
      </Modal>
      <Modal
        visible={bulInviteModal}
        footer={[
          <Button key="back" onClick={handleInvite}>
            Invite
          </Button>
        ]}
        title={(
          <div style={{display:"flex", flexDirection: "row"}}>
            <p>Invite</p>
            <div className="configuration-invitation-left">
              Invitations left this month: {Math.abs( selectedChannel?.invitationsSends - 50 )}/50
            </div>
          </div>
        )}
        width={900}
        style={{top: '40px'}}
        closable={true}
        closeIcon={<CloseCircleFilled className="custom-modal-close" id="close-email" />}
      >
        <div className="container-invite-modal">
          <div className="container-search-user">
            <CustomInput
              style={{ width: "100%", border: 'none', fontSize: "18px", margin: "0px" }} 
              onKeyUp={(e) => {
                setDataSelected({
                  ...dataSelected,
                  search: e.target.value
                })
              }}
              placeholder="Search by name / email"
            >
            </CustomInput>
            <CustomSelect
                  className="border"
                  showSearch
                  options={COUNTRIES}
                  value={dataSelected.location}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setDataSelected({
                      ...dataSelected,
                      location: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "95%", minWidth: "none"}}
                  style={{width: "100%", minWidth: "none", marginTop: "10px"}}
                  placeholder="Location"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={PROFILE_SETTINGS.JOB_LEVELS}
                  value={dataSelected.recentJobLevel}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setDataSelected({
                      ...dataSelected,
                      recentJobLevel: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "95%", minWidth: "none"}}
                  style={{width: "100%", minWidth: "none", marginTop: "10px"}}
                  placeholder="Level"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={PROFILE_SETTINGS.ORG_SIZES}
                  value={dataSelected.sizeOfOrganization}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setTimeout(() => {
                      selectInvit.current.scroll(selectInvit.current.clientWidth,0)
                      setBulNext(true)
                    }, 100);
                    setDataSelected({
                      ...dataSelected,
                      sizeOfOrganization: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "95%", minWidth: "none"}}
                  style={{width: "100%", minWidth: "none", marginTop: "10px"}}
                  placeholder="Company size"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={allCategories}
                  value={dataSelected.topicsOfInterest}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setTimeout(() => {
                      selectInvit.current.scroll(selectInvit.current.clientWidth,0)
                      setBulNext(true)
                    }, 100);
                    setDataSelected({
                      ...dataSelected,
                      topicsOfInterest: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "100%", minWidth: "none"}}
                  style={{width: "100%", minWidth: "none", marginTop: "10px"}}
                  placeholder="Topic interest"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <div className="space-selected border">
                  <div 
                    className={!bulSelectOptionResponsiveInvite ? "container-option-tab-select selectOption" : "container-option-tab-select"}
                    onClick={() => {setBulSelectOptionResponsiveInvite(!bulSelectOptionResponsiveInvite)}}
                  >
                    Users found
                  </div>
                  <div 
                    className={bulSelectOptionResponsiveInvite ? "container-option-tab-select selectOption" : "container-option-tab-select"}
                    onClick={() => {setBulSelectOptionResponsiveInvite(!bulSelectOptionResponsiveInvite)}}  
                  >
                    Users selected
                  </div>
                </div>
          </div>
          <div className="container-distribution-invite-modal">
            <div className="box-left-invite-modal">
              {bulNext &&<div className="before-arrow" onClick={() => {
                setBulNext(false)
                selectInvit.current.scroll(0,0)
              }}>
                <CaretLeftOutlined />
              </div>}
              {!bulNext && <div className="next-arrow" onClick={() => {
                setBulNext(true)
                selectInvit.current.scroll(selectInvit.current.clientWidth,0)
              }}>
                <CaretRightOutlined />
              </div>}
              <div className="container-selects-topics-invite-modal" ref={selectInvit}>
                <CustomSelect
                  className="border"
                  showSearch
                  options={COUNTRIES}
                  value={dataSelected.location}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setDataSelected({
                      ...dataSelected,
                      location: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "250px", minWidth: "250px"}}
                  style={{marginLeft:'15px', transform: "scale(0.9)"}}
                  placeholder="Location"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={PROFILE_SETTINGS.JOB_LEVELS}
                  value={dataSelected.recentJobLevel}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setDataSelected({
                      ...dataSelected,
                      recentJobLevel: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "150px", minWidth: "150px"}}
                  style={{marginLeft:'15px', transform: "scale(0.9)"}}
                  placeholder="Level"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={PROFILE_SETTINGS.ORG_SIZES}
                  value={dataSelected.sizeOfOrganization}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setTimeout(() => {
                      selectInvit.current.scroll(selectInvit.current.clientWidth,0)
                      setBulNext(true)
                    }, 100);
                    setDataSelected({
                      ...dataSelected,
                      sizeOfOrganization: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "150px", minWidth: "150px"}}
                  style={{marginLeft:'15px', transform: "scale(0.9)"}}
                  placeholder="Company size"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
                <CustomSelect
                  className="border"
                  showSearch
                  options={allCategories}
                  value={dataSelected.topicsOfInterest}
                  optionFilterProp="location"
                  onChange={(value) => {
                    setTimeout(() => {
                      selectInvit.current.scroll(selectInvit.current.clientWidth,0)
                      setBulNext(true)
                    }, 100);
                    setDataSelected({
                      ...dataSelected,
                      topicsOfInterest: value
                    })
                  }}
                  change={true}
                  mode="multiple"
                  dropdownStyle={{width: "300px", minWidth: "300px"}}
                  style={{marginLeft:'15px', transform: "scale(0.9)"}}
                  placeholder="Topic interest"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </div>
              <div className="container-scroll">
                <div className="ajust-contain">
                  {searchUsers !== undefined ? searchUsers?.map((user, index) => (
                    <div key={index} style={{width: "100%"}}>
                      <InvitPeople
                        followers={user}
                        index={index}
                        arrayId={idPeopleSendInvitation}
                        setArrayId={setIdPeopleSendInvitation}
                        invitationsSends={selectedChannel?.invitationsSends}
                        userFollowed={followers}
                      />
                    </div>
                  )) : <div style={{display: "none"}}></div>}
              </div>
              </div>
            </div>
            <div className={`box-right-invite-modal ${!bulSelectOptionResponsiveInvite ? 'hidden-reflex-select-tab' : ''}`}>
              <div className="container-reset">
                <p>{idPeopleSendInvitation.length} selected</p>
                <p style={{fontWeight: "bold", cursor: "pointer"}} onClick={() => {setIdPeopleSendInvitation([])}}>Unselect all</p>
              </div>
              <div className="container-selecteds">
                  {idPeopleSendInvitation?.map((user, index) => (
                    <div key={index}>
                      <Followers
                        followers={user}
                        index={index}
                        type={''}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  selectedChannel: channelSelector(state).selectedChannel,
  followers: channelSelector(state).followers,
  channelLoading: channelSelector(state).loading,
  userProfile: homeSelector(state).userProfile,
  updateEvent: channelSelector(state).selectedChannel,
  allCategories: categorySelector(state).categories,
  searchUsers: homeSelector(state).searchedUsers,
  userChannelEditor: channelSelector(state).userChannelEditor,
  emailDraftChannel: channelSelector(state).emailDraftChannel,
  emailSendChannel: channelSelector(state).emailSendChannel,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
  getChannelForName,
  setFollowChannel,
  getUser,
  unsetFollowChannel,
  downloadFollowersChannels,
  searchUser,
  setNewsChannelEditor,
  getChannelEditor,
  deleteChannelEditor,
  sendEmailAttendeeChannelOwner,
  addEmailDraftChannel,
  getAllEmailDraftChannel,
  deleteEmailDraftChannel,
  copyEmailSendChannel,
  getAllEmailSendChannel
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
