
import { Collapse, Modal
  // Row, Col
 } from "antd";


import React, { useState, useEffect, useRef } from "react";
import { useHistory,useLocation,Redirect } from "react-router-dom";

import { connect } from "react-redux";
import clsx from "clsx";
import moment from 'moment'

import { CloseCircleFilled} from "@ant-design/icons";
import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import {
  orderLibrariesAction
} from "redux/actions/library-actions";

import {
  LibraryCard,
  ConferenceCard,
  EpisodeCard,
  PodcastSeriesCard,
  CustomButton,
  AnnualConferenceCard, 
  Tabs, 
} from "components";
import Emitter from "services/emitter";
import { EVENT_TYPES, INTERNAL_LINKS, SETTINGS } from "enum";
import IconLogo from "images/logo-sidebar.svg";
import html2canvas from "html2canvas";

import IconLoadingMore from "images/icon-loading-more.gif";

import getPodcastLinks from "utils/getPodcastLinks.js";

import { myLearningSelector } from "redux/selectors/myLearningSelector";
import { certificateSelector } from "redux/selectors/certificateSelector"
import { homeSelector } from "redux/selectors/homeSelector";
import { actions as myLearningActions } from "redux/actions/myLearning-actions";
import { actions as conferenceActions } from "redux/actions/conference-actions";

import { 
  createControlCertificate,
  getAllCertificateType,
  getCodeCertificate
} from "redux/actions/certificate-ations";

import FilterDrawer from "pages/Library/FilterDrawer";

// import LearningFilterDrawer from "./LearningFilterDrawer";

import ObjectCheckbox from "./objectCheckbox";
import { envSelector } from "redux/selectors/envSelector";
// import EventCertificate from "../EventCertificate";
import EventVideo from "./EventVideo";
import "./style.scss";


const { Panel } = Collapse;

const MyLearingPage = ({
  getAllSaved,
  allSaved,
  getAllCompleted,
  allCompleted,
  searchConferenceLibraries,
  getAllItemsWithHRCredits,
  getMoreItemsWithHRCredits,
  allItemsWithHRCredits,
  allItemsWithHRCreditsCurrentPage,
  loading,
  getAllEventVideos,
  allEventVideos,
  allEventVideosCurrentPage,
  getMoreEventVideos,
  allCompletedCurrentPage,
  getMoreCompleted,
  allSavedCurrentPage,
  getMoreSaved,
  userProfile,
  createControlCertificate,
  isMobile,
  orderLibrariesAction,
  getAllCertificateType,
  certificateLearning,
  getCodeCertificate
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const history = useHistory();

  const [currentTab, setCurrentTab] = useState(query.get("tab") || "0");
  const [listOfYears, setListOfYears] = useState([2020]);


  const [filters,] = useState({});

  const [bulPopUpDownloadEventCertificate, setBulPopUpDownloadEventCertificate] = useState(false)
  const [dataEvent,setDataEvent] = useState({})
  const [durationEvent, setDurationEvent] = useState(0)

  const [, setFilter] = useState({});
  const [loading2, setLoading2] = useState(false);
  const certificateRef = useRef(null);
  const [checked, setChecked] = useState(false)
  const [bulReset, setBulReset] = useState(false)
  const [bulOpenButton, setBulOpenButton] = useState(true)
  const [urlRedirect,setUrlRedirect] = useState('')
  const idEvent = query?.get("id");

  let checkedObject = {}

  useEffect(() => {
    if(!bulPopUpDownloadEventCertificate){
    }else{
      let duration = 0 

      dataEvent.startAndEndTimes.forEach((date) => {
        duration = (date !== null)
        ? duration + moment(date?.endTime,'YYYY-MM-DDTHH:mm:ssZ').diff(date?.startTime, 'hours')
        : duration
      })

      setDurationEvent(duration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulPopUpDownloadEventCertificate]);

  const onDownloadCertificateEvent = async () => {
    if (userProfile?.memberShip === "premium") {
      setLoading2(true);
      const domElement = certificateRef.current;
      const canvas = await html2canvas(domElement, {
        scale: 4,
      });
  
      let a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${dataEvent?.title} - ${userProfile?.firstName} ${userProfile?.lastName} Certificate.png`;
      a.click();
      createControlCertificate({
        type: 'learning', 
        idTypeCertificate: dataEvent?.id,
        title: dataEvent.title
      },() => {
        getAllCertificateType('learning')
      })
      setLoading2(false);
      setBulPopUpDownloadEventCertificate(false)
      setBulReset(true)
    } else {
      Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "learningCertificate");
    }
  };

  const handleTabChange = (tab) => {
    history.replace({
      pathname: window.location.pathname,
      search: `tab=${tab}`,
    });
    setCurrentTab(tab);
  };

  useEffect(() => {
    getAllSaved({});
    getAllCompleted({});
    getAllItemsWithHRCredits({});
    getAllEventVideos({});
    getAllCertificateType('learning')

    const getListOfYears = (startYear) => {
      const currentYear = new Date().getFullYear();
      const years = [];

      while (startYear <= currentYear) {
        years.push(startYear++);
      }

      return years;
    };

    if(isMobile){
      setBulOpenButton(false)
    }

    const listOfYears = getListOfYears([2020]);
    searchConferenceLibraries({}, listOfYears);
    setListOfYears(listOfYears.reverse());

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentTab === "0") {
      getAllEventVideos({
        ...filters,
      });
    } else if (currentTab === "1") {
      getAllItemsWithHRCredits({
        ...filters,
      });
    } else if (currentTab === "2") {
      getAllSaved({
        ...filters,
      });
    } else {
      getAllCompleted({
        ...filters,
      });
    }

    // eslint-disable-next-line
  }, [currentTab]);

  const planUpdate = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const showMoreItemsWithHRCredits = () => {
    getMoreItemsWithHRCredits({
      ...filters,
      page: allItemsWithHRCreditsCurrentPage + 1,
    });
  };

  const showMoreCompleted = () => {
    getMoreCompleted({
      ...filters,
      page: allCompletedCurrentPage + 1,
    });
  };

  const showMoreSaved = () => {
    getMoreSaved({
      ...filters,
      page: allSavedCurrentPage + 1,
    });
  };

  const onFilterChange = (values) => {
    setFilter(values);
  };

  // const showFilterPanel = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  // };

  const displaySavedItems = () => (
    <>
      <div className="saved-for-later">
        {allSaved?.rows?.map((item, index) => {
          if (item.type === "libraries") {
            return (
              <LibraryCard key={index} data={item} onClickAccess={planUpdate} />
            );
          } else if (item.type === "conferences") {
            return (
              <ConferenceCard
                key={index}
                data={item}
                listOfYearsIndex={listOfYears.findIndex(
                  (year) => year === item.year
                )}
              />
            );
          } else if (item.type === "podcasts") {
            return (
              <EpisodeCard
                key={index}
                links={getPodcastLinks(item)}
                episode={item}
              />
            );
          } else if (
            item.type === "Certificate Track and Panels" ||
            item.type === "Presentation"
          ) {
            return (
              <AnnualConferenceCard
                key={item.id}
                session={item}
                typeConference="conference-library"
                onWatch={() =>
                  history.push(`${INTERNAL_LINKS.MICRO_CONFERENCE}/${item.id}`)
                }
                savedItem
              />
            );
          } else {
            return <PodcastSeriesCard key={index} data={item} />;
          }
        }) || []}
      </div>
      <>
        {allSavedCurrentPage * SETTINGS.MAX_SEARCH_ROW_NUM < allSaved.count && (
          <div className="search-results-container-footer d-flex justify-center items-center">
            {loading && (
              <div className="my-learnings-page-loading-more">
                <img src={IconLoadingMore} alt="loading-more-img" />
              </div>
            )}
            {!loading && (
              <CustomButton
                text="Show More"
                type="primary outlined"
                size="lg"
                onClick={showMoreSaved}
              />
            )}
          </div>
        )}
      </>
    </>
  );

  const displayCompletedItems = () => (
    <>
      <div className="completed-items">
        {allCompleted?.rows?.map((item, index) => {
          if (item.type === "libraries") {
            return (
              <LibraryCard key={index} data={item} onClickAccess={planUpdate} />
            );
          } else if (item.type === "conferences") {
            return (
              <ConferenceCard
                key={index}
                data={item}
                listOfYearsIndex={listOfYears.findIndex(
                  (year) => year === item.year
                )}
              />
            );
          } else if (item.type === "podcasts") {
            return (
              <EpisodeCard
                key={index}
                links={getPodcastLinks(item)}
                episode={item}
              />
            );
          } else if (
            item.type === "Certificate Track and Panels" ||
            item.type === "Presentation"
          ) {
            return (
              <AnnualConferenceCard
                key={item.id}
                session={item}
                typeConference="conference-library"
                onWatch={() =>
                  history.push(`${INTERNAL_LINKS.MICRO_CONFERENCE}/${item.id}`)
                }
                savedItem
              />
            );
          } else {
            return <PodcastSeriesCard key={index} data={item} />;
          }
        }) || []}
      </div>
      <>
        {allCompletedCurrentPage * SETTINGS.MAX_SEARCH_ROW_NUM <
          allCompleted.count && (
          <div className="search-results-container-footer d-flex justify-center items-center">
            {loading && (
              <div className="my-learnings-page-loading-more">
                <img src={IconLoadingMore} alt="loading-more-img" />
              </div>
            )}
            {!loading && (
              <CustomButton
                text="Show More"
                type="primary outlined"
                size="lg"
                onClick={showMoreCompleted}
              />
            )}
          </div>
        )}
      </>
    </>
  );

  const allItemWithHRCreditsCount = allItemsWithHRCredits?.rows?.length || 0;

  const displayItemsWithHRCredits = () => (
    <>
      <div className="items-with-hr-credits">
        {allItemsWithHRCredits.rows?.map((item, index) => {
          if (item.type === "conferences") {
            return (
              <ConferenceCard
                key={index}
                data={item}
                listOfYearsIndex={listOfYears.findIndex(
                  (year) => year === item.year
                )}
                isInHRCredits={true}
              />
            );
          } else if (item.type === "libraries") {
            return (
              <LibraryCard
                key={index}
                data={item}
                onClickAccess={planUpdate}
                isInHRCredits={true}
              />
            );
          } else {
            return (
              <PodcastSeriesCard key={index} data={item} isInHRCredits={true} />
            );
          }
        })}
      </div>
      {allItemWithHRCreditsCount < allItemsWithHRCredits.count && (
        <div className="search-results-container-footer d-flex justify-center items-center">
          {loading && (
            <div className="my-learnings-page-loading-more">
              <img src={IconLoadingMore} alt="loading-more-img" />
            </div>
          )}
          {!loading && (
            <CustomButton
              text="Show More"
              type="primary outlined"
              size="lg"
              onClick={showMoreItemsWithHRCredits}
            />
          )}
        </div>
      )}
    </>
  );

  const changePosition = (e,index,id) => {
    if(e.target.className === 'iconTop'){

      orderLibrariesAction({
        position:{
          change: Number(e.target.parentElement.parentElement.parentElement.children[index-1].children[0].id),
          id: Number(id)
        },
        position2:{
          change: Number(e.target.parentElement.id),
          id: Number(e.target.parentElement.parentElement.parentElement.children[index-1].id)
        }
      }, () => {
        getAllEventVideos({});
      })

    }
    if(e.target.className === 'iconBottom'){

      orderLibrariesAction({
        position:{
          change: Number(e.target.parentElement.parentElement.parentElement.children[index+1].children[0].id),
          id: Number(id)
        },
        position2:{
          change: Number(e.target.parentElement.id),
          id: Number(e.target.parentElement.parentElement.parentElement.children[index+1].id)
        }
      }, () => {
        getAllEventVideos({});
      })

    }

  }

  const orderAllEventVideos = (data) => {

    let arrayOrderTime = data.sort((a,b) => {

      let aTime = moment(a?.startDate, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")
      let bTime = moment(b?.startDate, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")

      return  Number(bTime) - Number(aTime)

    })

    return arrayOrderTime

  }

  const displayEventVideos = () => {

    return (
      <div className="event-videos">
        <Collapse defaultActiveKey={[idEvent]}>
          {(orderAllEventVideos(allEventVideos) || []).map((event) => {
            const isEventPremium = event.ticket === "premium";
            const isUserPremium = userProfile.memberShip === "premium";

            const newEventsOrder = event.Libraries.sort((a,b) => {

              return a.orderLibraries - b.orderLibraries
        
            })

            let collapsible = "disabled";

            if (isEventPremium && isUserPremium) {
              collapsible = "header";
            } else if (!isEventPremium) {
              collapsible = "header";
            }

            const header =
              collapsible === "disabled" ? (
                <div>
                  {`${event.title} - `}
                  <b>FOR PREMIUM USERS ONLY</b>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: "row"}}>
                  <p style={{margin: "0px"}}>{event.title}</p>
                  <div 
                    className={bulOpenButton ? "containerButtonLearning" : "containerButtonLearningData"}
                    id="downloadCollapse"
                    onClick={(e) => {
                      if(userProfile?.memberShip === "premium"){
                        if(bulOpenButton){
                          e.preventDefault()
                          e.stopPropagation()
                          setBulPopUpDownloadEventCertificate(true)
                          setDataEvent(event)
                        }
                      }else{
                        e.preventDefault()
                        e.stopPropagation()
                        Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "learningCertificate");
                      }
                    }}
                  >
                    <div className="shadowDataButton"></div>
                    <CustomButton 
                      type="primary" 
                      size="sm"
                      text="Download Event Certificate"
                      className="butonLearningSelectTag"
                      style={bulOpenButton ? {opacity: '100%', transition: 'all 1s ease-in-out', position: "absolute"} : {opacity: '0%', transition: 'all 1s ease-in-out', position: "absolute"} }
                    />
                    <div
                      className="containerArrowMore"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setBulOpenButton(!bulOpenButton)
                      }}
                    >
                      <div className="arrowMore">

                      </div>
                    </div>
                  </div>
                </div>
              );

              


            return (
              <Panel header={header} key={event.id} collapsible={collapsible} className="panelDataHeight"> 
                {newEventsOrder.map((library,index) => {
                  return (
                    <div style={{width:'100%', height: '100%', position: 'relative'}} id={library.id}>
                      {(userProfile?.email === "morecontrol64@gmail.com" || userProfile?.email === "enrique@hackinghr.io") && 
                        (<div className="iconPanelDrag" id={library.orderLibraries}>
                          {(index !== 0) && <div className="iconTop"
                            onClick={(e) => changePosition(e,index,library.id)}
                          ></div>}
                          {(index !== newEventsOrder.length-1) && <div className="iconBottom"
                            onClick={(e) => changePosition(e,index,library.id)}
                          ></div>}
                        </div>)
                      }
                      <div style={(userProfile?.email === "morecontrol64@gmail.com" || userProfile?.email === "enrique@hackinghr.io") ? {
                        width: 'calc(100% - 40px)',
                        marginLeft: '40px'
                      } : {
                        width: 'calc(100%)'
                      }}>
                        <EventVideo library={library} key={library.id} />
                      </div>
                    </div>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  };

  // const liveCertificate = () => {
  //   return <EventCertificate />;
  // };

  const redirectToCertificate = (event) => {
    getCodeCertificate({
      idTypeCertificate: event?.id,
    },(urlCode) => {
      if(urlCode){
        setUrlRedirect(`${INTERNAL_LINKS.VERIFY}/${urlCode}`)
      }
    })
  }

  const filterCertificatesSelects = (data) => {

    let arrayIds = certificateLearning?.map((data) => data.idTypeCertificate)

    let newArray = data.filter((info) => arrayIds?.includes(info.id))

    return newArray

  }

  const displayButtonsCertificates = () => {
    return (
      <div style={{width: '100%',height: 'auto',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <p
          style={{
            paddingTop:'20px',
            paddingLeft: '10%',
            paddingRight: '10%'
          }}
        >
          In this section you can see the history of Hacking HR learning programs that you have joined and confirmed your participation in. For items to show in here you first need to go to the next tab: Event Videos. Select the event, click on “Download Digital Certificate”, confirm that you attended live and/or watched the recorded videos, and then the event and the digital certificate will show in your “My Achievements” tab.
        </p>
        {(orderAllEventVideos(filterCertificatesSelects(allEventVideos)) || []).map((event) => {
          return(
            <CustomButton
              text={event.title}
              size="md"
              type="primary"
              onClick={(e) => {
                if(userProfile?.memberShip === "premium"){
                  redirectToCertificate(event)
                }else{
                  e.preventDefault()
                  e.stopPropagation()
                  Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "learningCertificate");
                }
              }}
              style={{marginTop: '1rem', width: '80%',textDecoration:'none'}}
            />
          )
        })}
      </div>
    )
  }

  const TabData = [
    {
      title: 'My Achievements',
      content: displayButtonsCertificates
    },
    {
      title: "Event Videos",
      content: displayEventVideos,
    },
    {
      title: "Items w/ HR Credits",
      content: displayItemsWithHRCredits,
    },
    {
      title: "Saved Items",
      content: displaySavedItems,
    },
    {
      title: "Completed Items",
      content: displayCompletedItems,
    },
  ]

  // const handleFilterChange = (filter) => {
  //   getAllSaved(filter);
  //   getAllCompleted(filter);
  //   getAllItemsWithHRCredits(filter);
  //   getAllEventVideos(filter);

  //   setFilters(filter);
  // };

  const groupCheckbox = (data) => {
    if(data.Libraries !== undefined){

      if(data.Libraries !== undefined){
        data.Libraries.forEach((data) => {
          checkedObject[data.id] = true
        })
      }

      return data?.Libraries?.map((library, index) => (
        <ObjectCheckbox
          functionState={(data, bul) => {
            checkedObject[data] = bul

            isPosibleConfirm()
          }}
          message={library.title}
          id={library.id}
          key={index}
          bulReset={bulReset}
          functionReset={() => {setBulReset(false)}}
        />
      ))
    }else{
      return (<div></div>)
    }
  }

  const isPosibleConfirm = () => {
    let confirmData = dataEvent.Libraries.filter((data) => {
      return checkedObject[data.id] === true
    })
    if(confirmData.length === 0){
      setChecked(true)
    }else{
      setChecked(false)
    }
  }

  return (
    <div className="my-learnings-page">
      {/* <div className="learnings-filter-panel">
        <LearningFilterDrawer onChange={handleFilterChange} />
      </div> */}
      <FilterDrawer onChange={onFilterChange} />
      <div className="search-results-container">
        {/* <Row>
          <Col span={24}>
            <div className="search-results-container-mobile-header">
              <h3 className="filters-btn" onClick={showFilterPanel}>
                Filters
              </h3>
            </div>
          </Col>
        </Row> */}
        <div className="my-learnings-page-container">
          <div className="search-results-container">
            <Tabs
              data={TabData}
              current={currentTab}
              onChange={handleTabChange}
            />
          </div>
        </div>
      </div>
      {(urlRedirect !== '') && 
        <Redirect to={urlRedirect} />
      }
      <Modal
          className={clsx("custom-modal")}
          wrapClassName={clsx("custom-modal-wrap")}
          centered
          onCancel={() => {
            setBulPopUpDownloadEventCertificate(false)
            setBulReset(true)
          }}
          visible={bulPopUpDownloadEventCertificate}
          closable={true}
          footer={[]}
          width="500px"
          style={{top: "100px"}}
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
              <p 
                style={{
                  margin: '0px', 
                  marginTop: '5px', 
                  fontWeight: 'bold',
                  fontSize: '22px',
                  width: '100%',
                  textAlign: 'center',
                  color: "#3c4752",
                }}
              >Download Event Certificate</p>
              <div className="custom-modal-logo">
                  <img src={IconLogo} alt="custom-logo" />
              </div>
            </div>
          }
          closeIcon={<CloseCircleFilled className="custom-modal-close" />}
      >
        <div className="library-claim-modal">
          <p>
            Thank you for attending Hacking HR’s event <strong>{dataEvent?.title}</strong>
          </p>
          <p>
            To download your Digital Certificate of Attendance, please verify that you attended 
            LIVE or watched all the sessions below and then click on CONFIRM. 
          </p>
          <p>
            When you click CONFIRM an image PNG will download. In addition, we will send you 
            the certificate automatically via email and also the certificate ID and unique URL so 
            that you can share your badge on LinkedIn or any other platform.
          </p>
          {groupCheckbox(dataEvent)}
          <p>
            Thank you!
          </p>
          <div className="podcast-claim-modal-footer">
            <CustomButton
              disabled={!checked}
              text="Confirm/Download"
              size="md"
              onClick={() => onDownloadCertificateEvent()}
              loading={loading2}
            />
          </div>
        </div>
      </Modal>
      <div style={{position: 'absolute', left: '-100%'}}>
        <div
          className="skill-cohort-certificate-page-wrapperr"
          id="certificate-panel"
          ref={certificateRef}
        >
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR's Certificate of Participation To
              </h3>
              <h1 className="certificate-username">{`${userProfile?.firstName} ${userProfile?.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">
                For Successfully Participating in the Hacking HR Event:
              </h5>
              <h3 className="certificate-text2" style={{textAlign: 'center'}}>{dataEvent.title}</h3>
              <h5 className="certificate-text1 organizer">Duration: {durationEvent} hours</h5>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">{`${moment(
                  dataEvent.startDate,"YYYY-MM-DDTHH:mm:ss"
                ).format("ll")} - ${moment(dataEvent.endDate,"YYYY-MM-DDTHH:mm:ss").format("ll")}`}</h5>
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
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...myLearningSelector(state),
  userProfile: homeSelector(state).userProfile,
  isMobile: envSelector(state).isMobile,
  certificateLearning: certificateSelector(state).certificateLearning
});

const mapDispatchToProps = {
  ...myLearningActions,
  ...conferenceActions,
  createControlCertificate,
  orderLibrariesAction,
  getAllCertificateType,
  getCodeCertificate
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLearingPage);
