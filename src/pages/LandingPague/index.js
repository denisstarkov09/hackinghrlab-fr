//joel
import { Button } from 'antd';
import { WechatOutlined } from "@ant-design/icons";
//joel*

/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState, useRef } from "react";
import { Carousel } from 'antd';
import { connect } from "react-redux";
// import FilterDrawer from "../Home/FilterDrawer";
import MembersSpeakers from "./MembersSpeakers";
import moment from "moment-timezone";
import TimeZoneList from "enum/TimezoneList";

import { getUser } from "redux/actions/home-actions";
import { getCouncilMembers, sendEmailsForPartOfCouncil } from "redux/actions/council-actions"
import { Modal } from "antd";
import Login from "../Login2";
import { isEmpty } from "lodash";
import ModalCompleteYourProfile2 from "./ModalCompleteYourProfile2";
import EventModalContainer from "containers/EventModalContainer";

import {
  getAllEvent,
} from "redux/actions/event-actions";
import { getCheckoutSession } from "api/module/stripe";

import { useHistory, useLocation } from "react-router-dom";

import { eventSelector } from "redux/selectors/eventSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { councilSelector } from "redux/selectors/councilSelector";
import { authSelector } from "redux/selectors/authSelector";

import { addToMyEventList } from "redux/actions/event-actions";

import { CustomButton, CustomCheckbox } from "components";
import { loadStripe } from "@stripe/stripe-js";
import { actions as councilEventActions } from "redux/actions/council-events-actions";

import castForEducation from '../../images/castforeducation.png'
import people from '../../images/People.png'
import space from '../../images/space.png'
import myspace from '../../images/myspace.png'
import bruj from '../../images/bruj.png'
import people3 from '../../images/people3.png'
import Illustration4 from '../../images/Illustration_4.svg'
import Illustration5 from '../../images/Illustration_5.svg'
import Illustration6 from '../../images/Illustration_6.svg'
import checkHome from '../../images/checkhome.svg'
import closeHome from '../../images/closehome.svg'
import clsx from "clsx";
import IconLogo from "images/logo-sidebar.svg";
import { CloseCircleFilled } from "@ant-design/icons";

import { INTERNAL_LINKS } from "enum";

import "./style.scss";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const HomePage = ({
  // history,
  // location,
  userProfile,
  getUser,
  allEvents,
  getCouncilMembers,
  councilMembers,
  sendEmailsForPartOfCouncil,
  getAllEvent,
  isAuthenticated,
  updatedEvent,
  live,
  redirectHome,
  getCouncilEvents
}) => {

  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [typeRedrect, setTypeRedirect] = useState('nothing')
  const [idUrl, setIdUrl] = useState('')
  const [bulModal, setBulModal] = useState(false)
  const [bulModal2, setBulModal2] = useState(false)
  const [bulModal3, setBulModal3] = useState(false)
  const [bulModal4, setBulModal4] = useState(false)
  const [bulModal5, setBulModal5] = useState(false)
  const [bulModal6, setBulModal6] = useState(false)
  const [checked, setChecked] = useState(false)
  const [message, setMessage] = useState(false)
  const [changueModal, setChangueModal] = useState(false)
  const [changueModal2, setChangueModal2] = useState(false)
  const [changueModal3, setChangueModal3] = useState(false)
  const [activeModal, setActiveModal] = useState(false)
  const [objectEvent, setObjectEvent] = useState({})
  const [allCouncilEvents, setAllCouncilEvents] = useState(undefined)

  useEffect(() => {
    getCouncilEvents((data) => {
      setAllCouncilEvents(data)
    });
  }, [getCouncilEvents, setAllCouncilEvents])

  const { firstName } = userProfile

  const container1 = useRef(null)
  const container2 = useRef(null)
  const containerFather = useRef(null)

  const id = query?.get("id");

  const history = useHistory();

  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (redirectHome) {
      setTypeRedirect('home')
    } else {
      setTypeRedirect('nothing')
    }
  }, [redirectHome])

  useEffect(() => {
    if (changueModal === true && firstName !== '' && firstName !== undefined) {
      setTimeout(() => {
        if (userProfile.percentOfCompletion === '100' || userProfile.percentOfCompletion === 100) {
          setBulModal2(true);
          setBulModal(false)
          setBulModal5(false)
        } else {
          if (!bulModal2) {
            setBulModal5(true)
            setBulModal(false)
            setBulModal2(false);
          }

        }
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, changueModal, setBulModal, setBulModal2, setBulModal5, userProfile])

  useEffect(() => {
    if (changueModal2 === true && firstName !== '' && firstName !== undefined) {
      setTimeout(() => {
        setBulModal5(false);
        if (userProfile.percentOfCompletion === '100' || userProfile.percentOfCompletion === 100) {
          setBulModal2(true)
        }
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, changueModal2, setBulModal2, setBulModal5])

  useEffect(() => {
    if (changueModal3 === true && firstName !== '' && firstName !== undefined) {
      setTimeout(() => {
        if (userProfile.percentOfCompletion === '100' || userProfile.percentOfCompletion === 100) {
          setBulModal2(true);
        } else {
          if (!bulModal2) {
            setBulModal5(true)
          }
        }
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, changueModal3, setBulModal2, setBulModal5, userProfile])

  useEffect(() => {
    instanceStripe();
  }, []);

  useEffect(() => {
    if (id !== idUrl) {
      setIdUrl(id)
      history.push(`${INTERNAL_LINKS.LANDING_PAGUE}#${idUrl}`)

      if (idUrl === 'experts-home-segment') {
        let position = parseInt(container1.current.getBoundingClientRect().top)
        containerFather.current.scroll(0, position)
      }
      if (idUrl === 'events-home-segment') {
        let position = parseInt(container2.current.getBoundingClientRect().top)
        containerFather.current.scroll(0, position)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, idUrl])

  const instanceStripe = async () => {
    setStripe(await stripePromise);
  };

  useEffect(() => {
    if (localStorage.getItem("community") === null) {
      getUser();
    }
  }, [getUser])

  useEffect(() => {
    getCouncilMembers()
    getAllEvent()
  }, [getCouncilMembers, getAllEvent])

  const orderInformation = (data) => {
    let num = 0
    let arrayDistribution = [[]]

    data.map((data2, index) => {
      if (num !== Math.floor(index / 18)) {
        arrayDistribution[Math.floor(index / 18)] = []
        num++
      }
      arrayDistribution[Math.floor(index / 18)].push(data2)

      return true
    })

    return arrayDistribution
  }

  const containersCouncilMembers = orderInformation(councilMembers)?.map((data, index) => {
    return (
      <div key={index}>
        <div className="container-experts-carousel">
          {data?.map((user) => {
            return (
              <MembersSpeakers
                key={user?.id}
                usersPanel={user}
              />
            )
          })}
        </div>
      </div>
    )

  })

  const filterAllEvents = (data) => {
    let newDataS = data.filter((d) => (d.image2 !== null || d.images[0] !== undefined))

    return newDataS
  }

  const searchTimeZone = (timezone) => {
    let currentTimezone = TimeZoneList.find((item) => item.value === timezone);

    if (currentTimezone) {
      currentTimezone = currentTimezone.utc[0];
    } else {
      currentTimezone = timezone;
    }

    return currentTimezone
  }

  const filterUpcoming = (data) => {

    let dataFilter = data.filter((event) => {
      let dateFilter = (event.channel !== null)
        ? moment(event?.endDate, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')
        : moment(event?.startAndEndTimes[event.startAndEndTimes.length - 1]?.endTime, "YYYY-MM-DD hh:mm a")?.format('YYYYMMDDHHmm')

      let dateNow = moment(moment.utc().add(1, 'minute'), 'YYYY-MM-DD hh:mm a').tz(searchTimeZone(event?.timezone))?.format('YYYYMMDDHHmm')

      return ((Number(dateNow) < Number(dateFilter)) === true)
    })

    return dataFilter

  }

  useEffect(() => {
    if (window.location.pathname.substring(0, 15) !== INTERNAL_LINKS.CONFERENCE_2023) {
      if (isAuthenticated) {
        if (history != null) {
          if (typeRedrect !== 'nothing') {
            if (live && live.live === true) {
              history.push(INTERNAL_LINKS.LIVE);
            }
            if (typeRedrect === 'home') {
              history.push(INTERNAL_LINKS.HOME);
            }
            if (typeRedrect === 'events') {
              history.push(INTERNAL_LINKS.EVENTS)
            }
            if (typeRedrect === 'changue') {
              setTypeRedirect('nothing')
              getUser();
              setTimeout(() => {
                setBulModal4(false)
                setActiveModal(true)
              }, 200);
            }
          }
        } else {
          if (updatedEvent.ticket === "premium") {
            if (!isEmpty(userProfile) && userProfile.memberShip === "premium") {
              addToMyEventList(updatedEvent);
            }
          } else if (updatedEvent.ticket === "fee") {

            const userTimezone = moment.tz.guess();

            getCheckoutSession({
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
              event: { ...updatedEvent, userTimezone },
              callback_url: window.location.href,
            }).then((sessionData) =>
              stripe.redirectToCheckout({ sessionId: sessionData.data.id })
            );
          } else {
            addToMyEventList(updatedEvent);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userProfile]);

  //joel
  const [isShow, setIsShow] = useState(false)

  const displayChattingRoom = () => {
    isShow ? document.querySelector('.chatting-room').style.display = 'none' : document.querySelector('.chatting-room').style.display = 'block'
    setIsShow(!isShow)
  }
  //joel*
  return (
    <div className="home-page-container" ref={containerFather}>
      <div className='chat-pos'>
        <div className='chatting-room'>
          <iframe src='http://198.44.132.153:5173/' title='chatting-room'/>
        </div>
        <Button type='danger' onClick={displayChattingRoom} style={{fontSize: '2rem', position: 'absolution', right: '20px', backgroundColor: '#fe5621', height: '55px', width: '55px', borderRadius:'100%', padding: '0px',boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px'}}>
          <WechatOutlined />
        </Button>
      </div>
      <div className="first-session-home-pague" id="home-segment">
        <div className="container-father">
          <div className="text-session-home-pague">
            <p className="title-text">We are <span className="color-changue-text">POWERING</span> the future of Human Resources</p>
            <p className="description-session">With learning, community and collaboration. We are a community of business and HR leaders, HR practitioners, technologists, entrepreneurs, consultants.</p>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'start' }}>
              <CustomButton
                className="button-speaker font-size-more"
                text="Join The Hacking HR Community Now!"
                size="md"
                style={{ padding: '20px', width: '360px', height: '60px' }}
                type={"primary"}
                onClick={() => {
                  if (localStorage.getItem("community") === null) {
                    setTypeRedirect('home')
                    setBulModal3(true)
                  } else {
                    history.push(INTERNAL_LINKS.HOME)
                  }
                }}
              />
            </div>
          </div>
          <div className="container-banner-start"></div>
        </div>
      </div>
      <div className="segment-conference2023">
        <div className="imagen-conference2">
          <div className="container-content-picture">
            <p className="parrafo-hachinglab-picture">Hacking HR Presents</p>
            <p className="title-hachinglab-picture1">2023 Global Conference</p>
            <p className="title-hachinglab-picture2"><span className="span-color">FORWARD2023</span></p>
            <p className="date-picture">March 6-9, 2023 | Virtual</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CustomButton
                className="button-speaker font-size-more"
                text="Register here"
                size="md"
                style={{ padding: '10px', height: '40px', width: '320px' }}
                type={"primary"}
                onClick={() => {
                  const link = document.createElement("a");
                  link.setAttribute("href", `${INTERNAL_LINKS.CONFERENCE_2023}`);
                  link.setAttribute("target", "_blank");

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="segment2-community">
        <div className="container-father">
          <div className="image-of-second-part-home"></div>
          <div className="background-points"></div>
          <div className="background-circle"></div>
          <div className="text-communty">
            <p className="second-title-community">The <span className="color-changue-text">#1</span> Community for HR</p>
            <p className="description-session">We want to create THE BEST HR that has ever existed by focusing on all things at the fabulous intersection of future of work, technology, organization, innovation, people, transformation and the impact in HR, the workforce and workplace.</p>
            <p className="description-session">If you want HR to become the trailblazer, leading people and organizations to the future then Hacking HR is the community to join!</p>
          </div>
        </div>
      </div>
      <div className="segment3-community">
        <div className="container-father">
          <div className="text-communty">
            <p className="second-title-community">What <span className="color-changue-text">Hacking HR</span> offers you</p>
            <p className="description-session">We are focused on providing the most valuable learning programms, together with community and collaboration opportunities.</p>
          </div>
          <div className="image-of-second-part-home">
            <div className="container-distributioncard-community">
              <div className="container-card-community">
                <span className="white-circle"><span className="circle"><img src={castForEducation} alt="castForEducation" /></span></span>
                <p className="font-alt ">Learning</p>
              </div>
              <div className="container-card-community">
                <span className="white-circle"><span className="circle"><img src={myspace} alt="castForEducation" /></span></span>
                <p className="font-alt ">Community</p>
              </div>
            </div>
            <div className="container-distributioncard-community" style={{ marginTop: '70px' }}>
              <div className="container-card-community">
                <span className="white-circle"><span className="circle"><img src={people} alt="castForEducation" /></span></span>
                <p className="font-alt ">Collaboration</p>
              </div>
              <div className="container-card-community">
                <span className="white-circle"><span className="circle"><img src={space} alt="castForEducation" /></span></span>
                <p className="font-alt ">And More!</p>
              </div>
            </div>
          </div>
          <div className="background-points"></div>
          <div className="background-circle"></div>
        </div>
      </div>
      <div className="segment4-how">
        <div className="container-father">
          <p className="second-title-community">How It Works</p>
          <p className="description-session">It's Easy</p>
          <div className="lines-how"></div>
          <div className="container-distribution-cards">
            <div className="card-how">
              <div className="container-img-how">
                <img className="img-how" src={people3} alt="people3" />
              </div>
              <p className="second-title-community2">Create your <span className="color-changue-text">Account</span></p>
              <p className="description-session2">You can create a free premium account.</p>
            </div>
            <div className="card-how">
              <div className="container-img-how">
                <img className="img-how2" src={bruj} alt="bruj" />
              </div>
              <p className="second-title-community2">Start <span className="color-changue-text">Exploring</span></p>
              <p className="description-session2">Access all the content for free, including podcast episodes, podcast series, conference library, learning library.</p>
            </div>
            <div className="card-how">
              <div className="container-img-how">
                <img className="img-how" src={people3} alt="people3" />
              </div>
              <p className="second-title-community2">Engage with <span className="color-changue-text">Community</span></p>
              <p className="description-session2">Become the member or mentee, chat with others.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="segment5-tools">
        <div className="container-father">
          <p className="description-session">The Hacking HR Lab</p>
          <p className="second-title-community">Tools For Everyone</p>
          <div className="background-points"></div>
          <div className="container-distribution-cards">
            <div className="card-tool">
              <div className="container-img-tool">
                <img className="img-tool" src={Illustration4} alt="Illustration4" />
              </div>
              <p className="second-title-community2">HR Professionals</p>
              <p className="description-session2">Learning programs: events, ProjectX, podcast, mentoring, HR Business Partners community and more</p>
              <p className="description-session2" style={{ paddingTop: '20px' }}>For HR Leaders: all of the above and the Hacking HR’s Experts Council</p>
            </div>
            <div className="card-tool">
              <div className="container-img-tool">
                <img className="img-tool2" src={Illustration5} alt="Illustration5" />
              </div>
              <p className="second-title-community2">Creators</p>
              <p className="description-session2">All the learning programs that HR professionals have access to:</p>
              <p className="description-session2" style={{ paddingTop: '20px' }}>A CHANNEL to share your content (videos, resources, events, podcasts) that we amplify in the Hacking HR LAB</p>
            </div>
            <div className="card-tool">
              <div className="container-img-tool">
                <img className="img-tool" src={Illustration6} alt="Illustration6" />
              </div>
              <p className="second-title-community2">Vendors</p>
              <p className="description-session2">All the learning programs that HR professionals have access to:</p>
              <p className="description-session2" style={{ paddingTop: '20px' }}>Opportunities to advertise your products</p>
              <p className="description-session2" style={{ paddingTop: '20px' }}>Matchmaking tools</p>
              <p className="description-session2" style={{ paddingTop: '20px' }}>Special sponsorships and partnerships</p>
            </div>
          </div>
        </div>
      </div>
      <div className="segment6-plans">
        <div className="container-father">
          <p className="description-session">Pricing Plans</p>
          <p className="second-title-community">Choose a plan that suits your needs</p>
          <div className="container-first-column-price">
            <div className="first-segment" style={{ opacity: '0' }}>
              <p className="title-plans1">Get Started</p>
              <p className="descripton-plans1">Start Your Free Trial Now!</p>
              <div className="arrow-position"></div>
            </div>
            <div className="container-price">
              <p className="title-plans2">Free</p>
              <p className="description-plans2">$0 /mo</p>
            </div>
            <div className="container-price">
              <p className="title-plans2">Premium</p>
              <p className="description-plans2">$119 /mo</p>
            </div>
            <div className="container-price">
              <p className="title-plans2">Creator</p>
              <p className="description-plans2">$369 /mo</p>
            </div>
          </div>
          <div className="table-information">
            <div className="column-table-information">
              <p className="title-plans11 border4">Participation in all Hacking HR online events</p>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block border3"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
            </div>
            <div className="column-table-information">
              <p className="title-plans11">Access to: learning library, conference library, podcast and podcast series</p>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
            </div>
            <div className="column-table-information">
              <p className="title-plans11">Access to ProjectX: Hacking HR's cohort based learning</p>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
            </div>
            <div className="column-table-information">
              <p className="title-plans11">HR certification credits (for applicable learning items in the learning library, conference library, podcast series or classes)</p>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
            </div>
            <div className="column-table-information">
              <p className="title-plans11">Content sharing with the community: events, podcasts, videos, classes and other resources</p>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
            </div>
            <div className="column-table-information">
              <p className="title-plans11 border1"></p>
              <div className="container-block">
                <CustomButton
                  className="button-speaker font-size-more"
                  text="Choose Plan"
                  size="md"
                  style={{ padding: '10px', height: '40px' }}
                  type={"primary"}
                  onClick={() => {

                  }}
                />
              </div>
              <div className="container-block">
                <CustomButton
                  className="button-speaker font-size-more"
                  text="Choose Plan"
                  size="md"
                  style={{ padding: '10px', height: '40px' }}
                  type={"primary"}
                  onClick={() => {

                  }}
                />
              </div>
              <div className="container-block border2">
                <CustomButton
                  className="button-speaker font-size-more"
                  text="Choose Plan"
                  size="md"
                  style={{ padding: '10px', height: '40px' }}
                  type={"primary"}
                  onClick={() => {

                  }}
                />
              </div>
            </div>
          </div>
          <div className="cards-information-plans">
            <div className="cards-information-plans-specific">
              <p className="title-plans222">Free</p>
              <p className="title-plans222" style={{ paddingBottom: '30px' }}>$0 /mo</p>
              <div className="column-table-information">
                <p className="title-plans11 border4">Participation in all Hacking HR online events</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to: learning library, conference library, podcast and podcast series</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to ProjectX: Hacking HR's cohort based learning</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">HR certification credits (for applicable learning items in the learning library, conference library, podcast series or classes)</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Content sharing with the community: events, podcasts, videos, classes and other resources</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              </div>
              <div className="column-table-information">
                <div className="container-block" style={{ width: '100%', padding: '10px' }}>
                  <CustomButton
                    className="button-speaker font-size-more"
                    text="Choose Plan"
                    size="md"
                    style={{ padding: '10px', height: '40px' }}
                    type={"primary"}
                    onClick={() => {

                    }}
                  />
                </div>
              </div>
            </div>
            <div className="cards-information-plans-specific">
              <p className="title-plans222">Premium</p>
              <p className="title-plans222" style={{ paddingBottom: '30px' }}>$119 /mo</p>
              <div className="column-table-information">
                <p className="title-plans11 border4">Participation in all Hacking HR online events</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to: learning library, conference library, podcast and podcast series</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to ProjectX: Hacking HR's cohort based learning</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">HR certification credits (for applicable learning items in the learning library, conference library, podcast series or classes)</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Content sharing with the community: events, podcasts, videos, classes and other resources</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={closeHome} alt="closeHome" /></div>
              </div>
              <div className="column-table-information">
                <div className="container-block" style={{ width: '100%', padding: '10px' }}>
                  <CustomButton
                    className="button-speaker font-size-more"
                    text="Choose Plan"
                    size="md"
                    style={{ padding: '10px', height: '40px' }}
                    type={"primary"}
                    onClick={() => {

                    }}
                  />
                </div>
              </div>
            </div>
            <div className="cards-information-plans-specific">
              <p className="title-plans222">Creator</p>
              <p className="title-plans222" style={{ paddingBottom: '30px' }}>$369 /mo</p>
              <div className="column-table-information">
                <p className="title-plans11 border4">Participation in all Hacking HR online events</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to: learning library, conference library, podcast and podcast series</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Access to ProjectX: Hacking HR's cohort based learning</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">HR certification credits (for applicable learning items in the learning library, conference library, podcast series or classes)</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <p className="title-plans11">Content sharing with the community: events, podcasts, videos, classes and other resources</p>
                <div className="container-block"><img style={{ width: '37px', heught: '37px' }} src={checkHome} alt="checkHome" /></div>
              </div>
              <div className="column-table-information">
                <div className="container-block" style={{ width: '100%', padding: '10px' }}>
                  <CustomButton
                    className="button-speaker font-size-more"
                    text="Choose Plan"
                    size="md"
                    style={{ padding: '10px', height: '40px' }}
                    type={"primary"}
                    onClick={() => {

                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="segment7-experts" id="experts-home-segment" ref={container1}>
        <div className="container-father">
          <p className="second-title-community">Hacking HR Experts Council</p>
          <p className="description-session">Our goal with the Council is simple: bring together the most diverse, global and top-notch cadre of business/HR leaders to create a center of knowledge, new ideas, insights, information, expertise, excellence for everything we do in HR... and share that information with the extended HR community. The Hacking HR's Experts Council is a community for senior HR leaders to share and also ask, to be safe while having vulnerable and open conversations about the challenges in HR, and from there to generate insights and ideas and innovations for the extended Hacking HR community!</p>
          <Carousel autoplay style={{ paddingBottom: '40px' }}>
            {containersCouncilMembers}
          </Carousel>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomButton
              className="button-speaker font-size-more"
              text="Join the Hacking HR Experts Council"
              size="md"
              style={{ padding: '10px', height: '40px', width: '320px' }}
              type={"primary"}
              onClick={() => {
                if (localStorage.getItem("community") === null) {
                  setBulModal(true)
                } else {
                  getUser();
                  setChangueModal3(true)
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="segment8-events" id="events-home-segment" ref={container2}>
        <div className="container-father">
          <p className="second-title-community">Events</p>
          <div style={{ position: 'relative' }}>
            <Carousel autoplay style={{ paddingBottom: '220px' }}>
              {filterUpcoming(filterAllEvents(allEvents)).map((data, index) => {

                const { image2, images } = data

                return (
                  <div key={index}>
                    <div className="event-card-img" style={{ position: 'relative' }}>
                      {!isEmpty(images) && (
                        <img src={images[0]} alt="card-img" style={{ width: "100%" }} />
                      )}
                      {isEmpty(images) && image2 && <img src={image2} alt="card-img" />}
                      <div style={(window.innerWidth > 600)
                        ? { display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '10%', width: '100%' }
                        : { width: '100%', display: 'flex', justifyContent: 'center' }
                      }>
                        <CustomButton
                          className="button-speaker font-size-more"
                          text="Event Information"
                          size="md"
                          style={{ padding: '10px', height: '40px', width: '320px' }}
                          type={"primary"}
                          onClick={() => {
                            if (localStorage.getItem("community") === null) {
                              setBulModal4(true)
                              setObjectEvent(data)
                              setTypeRedirect('changue')
                            } else {
                              getUser();
                              setActiveModal(true)
                              setObjectEvent(data)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </Carousel>
            <div className="new-detail-events" style={{ display: 'flex', height: '200px', justifyContent: 'center', marginBottom: '40px', width: '105.26%', marginLeft: '-2.263158%' }}>
              <Carousel autoplay style={{ paddingBottom: '220px', width: '400px', overflow: 'hidden' }} dotPosition={2}>
                {filterUpcoming(filterAllEvents(allEvents)).map((data, index) => {

                  const { image2, images } = data

                  return (
                    <div key={index}>
                      <div className="event-card-img" style={{ position: 'relative' }}>
                        {!isEmpty(images) && (
                          <img src={images[0]} alt="card-img" style={{ width: "100%" }} />
                        )}
                        {isEmpty(images) && image2 && <img src={image2} alt="card-img" />}
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '0px', width: '100%' }}>
                          <CustomButton
                            className="button-speaker font-size-more"
                            text="Event Information"
                            size="md"
                            style={{ padding: '10px', height: '40px', width: '320px', transform: 'scale(0.6)' }}
                            type={"primary"}
                            onClick={() => {
                              if (localStorage.getItem("community") === null) {
                                setBulModal4(true)
                                setObjectEvent(data)
                                setTypeRedirect('changue')
                              } else {
                                getUser();
                                setActiveModal(true)
                                setObjectEvent(data)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Carousel>
              <Carousel autoplay style={{ paddingBottom: '220px', width: '400px', overflow: 'hidden' }} dotPosition={3}>
                {filterUpcoming(filterAllEvents(allEvents)).map((data, index) => {

                  const { image2, images } = data

                  return (
                    <div key={index}>
                      <div className="event-card-img" style={{ position: 'relative' }}>
                        {!isEmpty(images) && (
                          <img src={images[0]} alt="card-img" style={{ width: "100%" }} />
                        )}
                        {isEmpty(images) && image2 && <img src={image2} alt="card-img" />}
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '0px', width: '100%' }}>
                          <CustomButton
                            className="button-speaker font-size-more"
                            text="Event Information"
                            size="md"
                            style={{ padding: '10px', height: '40px', width: '320px', transform: 'scale(0.6)' }}
                            type={"primary"}
                            onClick={() => {
                              if (localStorage.getItem("community") === null) {
                                setBulModal4(true)
                                setObjectEvent(data)
                                setTypeRedirect('changue')
                              } else {
                                getUser();
                                setActiveModal(true)
                                setObjectEvent(data)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Carousel>
              <Carousel autoplay style={{ paddingBottom: '220px', width: '400px', overflow: 'hidden' }} dotPosition={4}>
                {filterUpcoming(filterAllEvents(allEvents)).map((data, index) => {

                  const { image2, images } = data

                  return (
                    <div key={index}>
                      <div className="event-card-img" style={{ position: 'relative' }}>
                        {!isEmpty(images) && (
                          <img src={images[0]} alt="card-img" style={{ width: "100%" }} />
                        )}
                        {isEmpty(images) && image2 && <img src={image2} alt="card-img" />}
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '0px', width: '100%' }}>
                          <CustomButton
                            className="button-speaker font-size-more"
                            text="Event Information"
                            size="md"
                            style={{ padding: '10px', height: '40px', width: '320px', transform: 'scale(0.6)' }}
                            type={"primary"}
                            onClick={() => {
                              if (localStorage.getItem("community") === null) {
                                setBulModal4(true)
                                setObjectEvent(data)
                                setTypeRedirect('changue')
                              } else {
                                getUser();
                                setActiveModal(true)
                                setObjectEvent(data)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Carousel>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
            <CustomButton
              className="button-speaker font-size-more"
              text="SHOW ALL EVENTS"
              size="md"
              style={{ padding: '10px', height: '40px', width: '320px' }}
              type={"primary"}
              onClick={() => {
                if (localStorage.getItem("community") === null) {
                  setTypeRedirect('events')
                  setBulModal4(true)
                } else {
                  history.push(INTERNAL_LINKS.EVENTS)
                }
              }}
            />
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>© hackinghr 2023. All Rights Reserved.</p>
        <p>Privacy · Terms · FAQ</p>
      </footer>
      <Modal
        visible={bulModal || bulModal2 || bulModal5}
        footer={null}
        width={400}
        bodyStyle={{ marginBottom: '40px', padding: "20px", display: 'flex', justifyContent: 'center' }}
        className="modal-container-login"
        onCancel={() => { setBulModal(false); setBulModal2(false); setChecked(false); setBulModal5(false) }}
      >
        {bulModal && <Login
          login={true}
          signup={false}
          type={'ladingPague'}
          history={null}
          confirm={() => {
            getUser();
            if (bulModal) {
              setChangueModal(true)
            }
          }}
          match={{ params: {} }}
          onClose={() => {
            setBulModal(false); setChecked(false)
          }}
        />
        }{bulModal2 &&
          <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              marginTop: '100px',
              width: '470px',
              background: 'white',
              height: '700px',
              borderRadius: '5px',
              display: 'flex',
              padding: '40px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center'
            }}>
              <p style={{ margin: '5px' }}>Hi {userProfile.firstName},</p>
              <p style={{ margin: '5px' }}>We are so excited you want to join us at the Hacking HR’s Experts Council!</p>
              <p style={{ margin: '5px' }}>Our goal is to provide insights, ideas, recommendations, and expertise about very specific topics to the thousands of members of the Hacking HR community and the extended HR community.</p>
              <p style={{ margin: '5px' }}>In addition, Founding Members in the Council will always be our priority to invite for our Hacking HR events, particularly our annual global online conference, and also podcasts, and much more!</p>
              <p style={{ margin: '5px' }}>The time commitment is as much or as little as you want and can. We will always invite you to everything and you choose when you are available or interested to join us.</p>
              <p style={{ margin: '5px' }}>Please note that to be considered for the Council you have to be an HR leader (director, VP, SVP or CHRO/CPO) in a company with more than 50 employees. We are not including consultants or HR tech vendors at the moment. </p>
              <p style={{ margin: '5px' }}>Confirm below and we will receive your information via email and get back to you soon!</p>
              <p style={{ margin: '5px' }}>Thank you!</p>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }}>
                <CustomCheckbox
                  size="sm"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                >
                  Confirm here
                </CustomCheckbox>
                {message && <p style={{
                  color: '#fe5621',
                  margin: '5px'
                }}>You need to confirm</p>}
                <CustomButton
                  className="button-speaker font-size-more"
                  text="Join the Hacking HR Experts Council"
                  size="md"
                  style={{ padding: '10px', height: '40px', width: '320px', marginTop: '20px' }}
                  type={"primary"}
                  onClick={() => {
                    if (!checked) {
                      setMessage(true)
                      setTimeout(() => {
                        setMessage(false)
                      }, 1000);
                    } else {
                      sendEmailsForPartOfCouncil(userProfile, () => {
                        setBulModal(false)
                        setBulModal2(false)
                        setBulModal5(false)
                        setChecked(false)
                      })
                    }
                  }}
                />
              </div>
            </div>
          </div>
        }{bulModal5 &&
          <ModalCompleteYourProfile2
            style={{ marginTop: '100px' }}
            userProfile={userProfile}
            onOk={() => {
              setChangueModal2(true)
            }}
          />
        }

      </Modal>
      <Modal
        visible={bulModal3}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => { setBulModal3(false); setTypeRedirect('nothing') }}
      >
        <Login
          login={true}
          signup={false}
          type={'ladingPague'}
          history={null}
          confirm={() => { }}
          match={{ params: {} }}
          modal={() => { setBulModal3(false); setTypeRedirect('nothing') }}
          onClose={() => { setBulModal3(false); setTypeRedirect('nothing') }}
        />
      </Modal>
      <Modal
        visible={bulModal4}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => { setBulModal4(false); setTypeRedirect('nothing') }}
      >
        <Login
          login={true}
          signup={false}
          type={'ladingPague'}
          history={null}
          confirm={() => { }}
          match={{ params: {} }}
          modal={() => { setBulModal4(false); setTypeRedirect('nothing') }}
          onClose={() => { setBulModal4(false); setTypeRedirect('nothing') }}
        />
      </Modal>
      <Modal
        className={clsx("custom-modal")}
        wrapClassName={clsx("custom-modal-wrap")}
        title={
          <div className="custom-modal-title">
            <div className="custom-modal-logo">
              <img src={IconLogo} alt="custom-logo" />
            </div>
          </div>
        }
        centered
        onCancel={() => { setActiveModal(false); setBulModal6(false); setTypeRedirect('nothing'); }}
        visible={activeModal || bulModal6}
        closable={true}
        footer={[]}
        width={"600px"}
        style={{ top: '100px' }}
        closeIcon={<CloseCircleFilled className="custom-modal-close" />}
      >
        {bulModal6 &&
          <Login
            login={true}
            signup={false}
            type={'ladingPague'}
            history={null}
            match={{ params: {} }}
            onClose={() => {
              setBulModal6(false); setActiveModal(false)
            }}
          />
        }
        {activeModal && <EventModalContainer
          event={objectEvent}
          visible={activeModal}
          allCouncilEvents={allCouncilEvents}
          setTypeRedirect={() => { setTypeRedirect('events') }}
          setObjectEvent={(data) => {
            setObjectEvent({
              ...objectEvent,
              status: data
            })
          }}
        />}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: authSelector(state).isAuthenticated,
  userProfile: homeSelector(state).userProfile,
  updatedEvent: eventSelector(state).updatedEvent,
  allEvents: eventSelector(state).allEvents,
  councilMembers: councilSelector(state).councilMembers,
  redirectHome: homeSelector(state).redirectHome,
});

const mapDispatchToProps = {
  getUser,
  getCouncilMembers,
  sendEmailsForPartOfCouncil,
  getAllEvent,
  addToMyEventList,
  ...councilEventActions
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
