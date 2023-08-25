import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import moment from "moment";
import converter from "number-to-words";
// import {
//   FacebookIcon,
//   FacebookShareButton,
//   LinkedinIcon,
//   LinkedinShareButton,
//   TwitterIcon,
//   TwitterShareButton,
// } from "react-share";

import { DownloadOutlined } from "@ant-design/icons";

import NoItemsMessageCard from "components/NoItemsMessageCard";

import { setLoading } from "redux/actions/home-actions";
import { getEvent, getMetadata } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { HelmetMetaData } from "components";
import { INTERNAL_LINKS } from "enum";

import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";
import IconBack from "images/icon-back.svg";

import "./style.scss";

const EventCertificatePage = ({
  user,
  myEvents,
  getEvent,
  setLoading,
  getMetadata,
  metadata,
}) => {
  const [img, setImg] = useState("");
  const [userCertificated,] = useState([]);
  const history = useHistory();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  // const shareUrl = `${window.location.origin}${
  //   INTERNAL_LINKS.EVENT_CERTIFICATE
  // }?id=${query.get("id")}`;

  // useEffect(() => {
  //   if (myEvents.usersAssistence) {
  //     const userAssistence = myEvents?.usersAssistence[0].map((el) =>
  //       JSON.parse(el)
  //     );
  //     console.log(userAssistence);
  //     setUserCertificated(
  //       userAssistence &&
  //         userAssistence.map((el) =>
  //           el.usersAssistence.filter((item) => item.usersAssistence === false)
  //         )
  //     );
  //   }
  // }, [myEvents]);

  useEffect(() => {
    getEvent(id);
  }, [getEvent, id]);

  const downloadPdf = async () => {
    setLoading(true);
    const domElement = document.getElementById("certificate-panel");
    const canvas = await html2canvas(domElement, { scale: 4 });

    const imgData = canvas.toDataURL("image/png");

    var link = document.createElement("a");
    link.download = "Certificate.png";
    link.href = imgData;
    link.click();

    setLoading(false);
  };

  const getPerodOfEvent = (startDate, endDate) => {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));

    return duration.asHours();
  };

  // const period = getPerodOfEvent(myEvents.startDate, myEvents.endDate);
  const period = myEvents.startAndEndTimes?.map((el) =>
    getPerodOfEvent(el.startTime, el.endTime)
  );
  const sumOfHours = period?.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );

  const domElement = document.getElementById("certificate-panel");

  useEffect(() => {
    const generateImage = async () => {
      const canvas = await html2canvas(domElement, { scale: 4 });
      const imgData = canvas.toDataURL("image/png");

      setImg(imgData);
    };
    if (domElement) {
      generateImage();
    }
    if (img) {
      getMetadata(img);
    }
  }, [domElement, img, getMetadata]);
  return (
    <>
      {userCertificated?.length === 0 ? (
        <>
          <HelmetMetaData
            title="Digital Certificate"
            metatitle="Digital Certificate"
            image={myEvents.image}
            description="Digital certificate"
            metadescription="Digital certificate"
            // data={metadata}
          ></HelmetMetaData>
          <div className="certificate-page">
            <div
              className="certificate-page-header-content-back-btn"
              onClick={() => history.push(`${INTERNAL_LINKS.MY_LEARNINGS}?tab=4`)}
            >
              <div className="certificate-page-header-content-back">
                <div className="certificate-page-header-content-back-img">
                  <img src={IconBack} alt="icon-back" />
                </div>
                <h4>Back to List</h4>
              </div>
            </div>
            <div className="certificate-page-wrapper" id="certificate-panel">
              <div className="certificate">
                <div className="certificate-top">
                  <div className="certificate-logo">
                    <img src={ImgHHRLogo} alt="sidebar-logo" />
                  </div>
                  <h3 className="certificate-title">
                    Hacking HR's Certificate of Participation
                  </h3>
                  <h1 className="certificate-username">{`${user.firstName} ${user.lastName}`}</h1>
                </div>
                <div className="certificate-center">
                  <h5 className="certificate-text1 organizer">
                    {`For Attending ${myEvents.organizer} Session:`}
                  </h5>
                  <h4 className="certificate-text2">{myEvents.title}</h4>
                  <h5 className="certificate-text1 duration">{`Duration: ${converter.toWords(
                    sumOfHours ? sumOfHours : 0
                  )} Hour${(sumOfHours ? sumOfHours : 0) > 1 ? "s" : ""}`}</h5>
                </div>
                <div className="certificate-bottom">
                  <div className="certificate-bottom-sign">
                    <h5 className="certificate-text1 date">{`${moment(
                      new Date()
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
            <div className="certificate-participation">
              <div className="certificate-participation-logo">
                <img
                  src={ImgHHRLogo}
                  alt="sidebar-logo"
                  className="certificate-participation-image"
                />
              </div>
              <div>
                <h2>Hacking HR's Certificate of Participation</h2>
                <span>Issued by Hacking HR's</span>
              </div>
            </div>
            <div className="share-certificate">
              <h3>download your badge</h3>
              <div className="certificate-page-actions">
                {/* <FacebookShareButton url={shareUrl} quote="comentario default">
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <LinkedinShareButton
                  url={shareUrl}
                  title="comentario vergas titulo diosl"
                  summary="description sirve?"
                >
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <TwitterShareButton url={shareUrl} title="title default">
                  <TwitterIcon size={40} round />
                </TwitterShareButton> */}
                <button
                  onClick={downloadPdf}
                  className="custom-download-button"
                >
                  <DownloadOutlined />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="certificate-page">
          <div
            className="certificate-page-header-content-back-btn"
            onClick={() => history.push(INTERNAL_LINKS.MY_LEARNINGS)}
          >
            <div className="certificate-page-header-content-back">
              <div className="certificate-page-header-content-back-img">
                <img src={IconBack} alt="icon-back" />
              </div>
              <h4>Back to List</h4>
            </div>
          </div>
          <div className="certificate-page__list-wrap">
            <NoItemsMessageCard
              message={`You don't have or not exist this certificate.`}
            />
          </div>
        </div>
      )}
    </>
  );
};

EventCertificatePage.propTypes = {
  title: PropTypes.string,
};

EventCertificatePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
  myEvents: eventSelector(state).myEvents,
  metadata: eventSelector(state).metadata,
});

const mapDispatchToProps = {
  setLoading,
  getEvent,
  getMetadata,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCertificatePage);
