import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import moment from "moment";
import MicroClassSkeleton from "./MicroClassSkeleton";
import MicroClassVideosList from "./MicroClassVideosList";
import MicroClassVideoWrapper from "./MicroClassVideoWrapper";
import CustomButton from "components/Button";
import { Tabs, notification } from "antd";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

import {
  getCourse,
  getCourseClasses,
  getCourseInstructors,
  getCourseSponsors,
  claimCourse,
} from "redux/actions/course-actions";
import { setLoading } from "redux/actions/home-actions";

import { courseSelector } from "redux/selectors/courseSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { courseClassUserSelector } from "redux/selectors/courseClassUserSelector";

import { INTERNAL_LINKS, EVENT_TYPES } from "enum";
import { convertBlobToBase64 } from "utils/format";
import MicroclassClaimModal from "./MicroclassClaimModal";
import Emitter from "services/emitter";

import { ReactComponent as IconArrowBackCircleOutline } from "images/icon-arrow-back-circle-outline.svg";
import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import "./style.scss";

const { TabPane } = Tabs;

const useMicroClassQuery = (id) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");

    let timeout = setTimeout(() => {
      setStatus("success");
    }, 1500);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line
  }, []);

  return {
    microClassData: data,
    setMicroClassData: setData,
    status,
  };
};

const MicroClass = ({
  history,
  match,
  getCourse,
  course,
  getCourseClasses,
  getCourseInstructors,
  getCourseSponsors,
  classes,
  instructors,
  sponsors,
  claimCourse,
  user,
  setLoading,
}) => {
  const { status } = useMicroClassQuery(match.params.id);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  useEffect(() => {
    getCourse(match.params.id);
    getCourseClasses(match.params.id);
    getCourseInstructors(match.params.id);
    getCourseSponsors(match.params.id);
    // eslint-disable-next-line
  }, []);

  const activeVideoUrl = useMemo(() => {
    if (classes && classes.length) {
      let videoObject = classes.find((item) => item.id === activeVideoId);
      if (videoObject && videoObject.videoUrl) {
        return videoObject.videoUrl;
      }
      return null;
    }
    return null;
  }, [activeVideoId, classes]);

  const generatePDF = async () => {
    setLoading(true);
    const domElement = document.getElementById("microclass-certificate-panel");
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

  const handleClaimCertificate = async () => {
    // history.push(`${INTERNAL_LINKS.MICRO_CLASS_CERTIFICATE}/${course.id}`);
    const pdf = await generatePDF();

    claimCourse(course.id, pdf, (err) => {
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

  const onClaimCertificate = () => {
    if (user && user.memberShip === "premium") {
      setModalVisible(true);
    } else {
      setShowFirewall(true);
    }
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  return (
    <div className="micro-class__page">
      <div className="micro-class__container">
        {status === "loading" && <MicroClassSkeleton />}

        {status === "success" && (
          <>
            <div className="micro-class__row">
              <div className="micro-class__row-1">
                <div className="micro-class__row-1--video-list">
                  <div className="micro-class__row-1--video-list--title">
                    <IconArrowBackCircleOutline
                      title="Back to Classes"
                      onClick={() => {
                        history.push(INTERNAL_LINKS.CLASSES);
                      }}
                    />{" "}
                    <h2>{course.title}</h2>
                  </div>

                  <MicroClassVideosList
                    list={classes}
                    setActiveVideoId={(id) => setActiveVideoId(id)}
                    activeVideoId={activeVideoId}
                    courseId={match.params.id}
                  />

                  <div className="micro-class__claim-certificate-button-wrap">
                    <CustomButton
                      disabled={!course.finished}
                      htmlType="button"
                      type="primary"
                      size="xs"
                      onClick={onClaimCertificate}
                      text="Claim Digital Certificate and HR Credits"
                    />
                    {!course.finished && (
                      <span className="micro-class__claim-certificate-button-span">
                        (only available when all sub-videos have been watched)
                      </span>
                    )}
                  </div>
                </div>
                <div className="micro-class__row-1--video-player">
                  <MicroClassVideoWrapper
                    url={activeVideoUrl ? activeVideoUrl : null}
                    id={activeVideoId}
                    courseId={match.params.id}
                  />

                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Class Information" key="1">
                      {course.description && (
                        <div>
                          <div className="micro-class__description-card">
                            <h3>Course Description</h3>
                            <p className="micro-class__description-p">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </TabPane>
                    {instructors.length > 0 && (
                      <TabPane tab="Instructors" key="2">
                        <div>
                          <div className="micro-class__additional-info-card">
                            <div className="micro-class__additional-info-row">
                              {instructors.map((instructor, i) => (
                                <div
                                  className="micro-class__additional-info-col"
                                  key={i}
                                >
                                  <a
                                    href={instructor.link}
                                    className="micro-class__additional-info-item"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span
                                      className="micro-class__additional-info-ico"
                                      style={{
                                        backgroundImage: `url(${instructor.image})`,
                                      }}
                                    ></span>
                                    <span className="micro-class__additional-info-item-text">
                                      {instructor.name}
                                    </span>
                                    <span className="micro-class__additional-info-item-text-sub">
                                      {instructor.description}
                                    </span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabPane>
                    )}
                    {sponsors.length > 0 && (
                      <TabPane tab="Sponsors" key="3">
                        <div>
                          <div className="micro-class__additional-info-card">
                            <div className="micro-class__additional-info-row">
                              {sponsors.map((sponsor, i) => (
                                <div
                                  className="micro-class__additional-info-col"
                                  key={i}
                                >
                                  <a
                                    href={sponsor.link}
                                    className="micro-class__additional-info-item"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span
                                      className="micro-class__additional-info-ico"
                                      style={{
                                        backgroundImage: `url(${sponsor.image})`,
                                      }}
                                    ></span>
                                    <span className="micro-class__additional-info-item-text">
                                      {sponsor.name}
                                    </span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabPane>
                    )}
                  </Tabs>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="microclass-certificate certificate-page-wrapper"
        id="microclass-certificate-panel"
      >
        <div className="certificate">
          <div className="certificate-top">
            <div className="certificate-logo">
              <img src={ImgHHRLogo} alt="sidebar-logo" />
            </div>
            <h3 className="certificate-title">
              Hacking HR Presents This Certificate of Participation To
            </h3>
            <h1 className="certificate-username">{`${user.firstName} ${user.lastName}`}</h1>
          </div>
          <div className="certificate-center">
            <h5 className="certificate-text1 organizer">
              For participating in Hacking HR’s Micro-Class
            </h5>
            <h4 className="certificate-text2">{course.title}</h4>
          </div>
          <div className="certificate-bottom">
            <div className="certificate-bottom-sign">
              <h5 className="certificate-text1 date">{`${moment(
                course.finishDate
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
                HHR director signature
              </h5>
            </div>
          </div>
        </div>
      </div>
      {showFirewall && (
        <div
          className="microclasse-firewall"
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
      <MicroclassClaimModal
        visible={modalVisible}
        title="Claim Digital Certificate and HR Credits"
        destroyOnClose={true}
        data={course}
        onClaim={handleClaimCertificate}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  course: courseSelector(state).course,
  classes: courseSelector(state).classes,
  instructors: courseSelector(state).instructors,
  sponsors: courseSelector(state).sponsors,
  courseUserProgress: courseClassUserSelector(state).courseUserProgress,
  user: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getCourse,
  getCourseClasses,
  getCourseInstructors,
  getCourseSponsors,
  claimCourse,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(MicroClass);
