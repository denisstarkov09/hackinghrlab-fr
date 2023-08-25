import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import { CustomButton } from "components";
import moment from "moment-timezone";
import html2canvas from "html2canvas";

import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";
import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const SkillCohortCard = (props) => {
  const {
    id,
    title,
    description,
    image,
    startDate,
    endDate,
    hasAccess: participantHasAccess,
  } = props.skillCohort;
  const { hasAccess: hasAccessProps, userProfile } = props;
  const {createControlCertificate} = props
  const hasAccess = participantHasAccess || hasAccessProps;
  const [hasCohortStarted, setHasCohortStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const certificateRef = useRef(null);

  useEffect(() => {
    const dateToday = moment().tz("America/Los_Angeles");

    if (dateToday.isAfter(moment(startDate).tz("America/Los_Angeles"))) {
      setHasCohortStarted(true);
    } else {
      setHasCohortStarted(false);
    }
    // eslint-disable-next-line
  }, []);

  const randomId = `skill-cohort-description-${Math.floor(
    Math.random() * 1000
  )}`;

  const handleClickMore = () => {
    if (hasAccess && hasCohortStarted) {
      history.push(`${INTERNAL_LINKS.PROJECTX}/${id}/resources?key=resources`);
    } else {
      history.push(`${INTERNAL_LINKS.PROJECTX}/${id}`);
    }
  };

  const downloadPdf = async () => {
    setLoading(true);
    const domElement = certificateRef.current;
    const canvas = await html2canvas(domElement, {
      scale: 4,
    });

    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${title} - ${userProfile.firstName} ${userProfile.lastName} Certificate.png`;
    a.click();
    createControlCertificate({
      type: 'skillCohort', 
      idTypeCertificate: id,
      title: title
    })
    setLoading(false);
  };

  let displayBtn;
  if (hasCohortStarted && hasAccess && moment().isBefore(moment(endDate))) {
    displayBtn = "Enter Dashboard";
  } else if (hasCohortStarted && !hasAccess) {
    displayBtn = "You missed 2 activities";
  } else if (hasAccess && moment().isAfter(moment(endDate))) {
    displayBtn = "Completed";
  } else {
    displayBtn = "More";
  }

  const nextMonday = moment(endDate)
    .tz("America/Los_Angeles")
    .startOf("isoWeek")
    .add(1, "week");
  const hasFinished = moment().tz("America/Los_Angeles").isAfter(nextMonday);
  const canDownloadCertificate = hasFinished && hasAccess;

  return (
    <div className="skill-cohort-card">
      <div className="skill-cohort-card-header">
        {image ? (
          <img src={image} alt="header" />
        ) : (
          <img src={HARDCODED_COVER_PLACEHOLDER} alt="header" />
        )}
      </div>
      <div className="skill-cohort-card-content">
        <h3 className="skill-cohort-card-title">{title}</h3>
        <div id={randomId} className="d-flex">
          <div
            className="skill-cohort-card-desc"
            dangerouslySetInnerHTML={{
              __html: (description || {}).html || "",
            }}
          />
        </div>
        <h5 className="skill-cohort-card-hr">
          Starting on {moment(startDate).format("LL")}
        </h5>
        <h5 className="skill-cohort-card-hr">
          Finishing on {moment(endDate).format("LL")}
        </h5>
        <div className="skill-cohort-card-join-btn">
          <CustomButton
            text={displayBtn}
            onClick={handleClickMore}
            type={
              hasAccess && moment().isAfter(moment(endDate))
                ? "secondary"
                : "primary"
            }
            size="md"
            block={true}
            disabled={hasCohortStarted && !hasAccess}
          />
          {canDownloadCertificate && (
            <CustomButton
              text="Download Digital Certificate"
              onClick={downloadPdf}
              type="primary"
              size="md"
              block={true}
              style={{ marginTop: "0.5rem" }}
              loading={loading}
            />
          )}
        </div>
      </div>
      {canDownloadCertificate && (
        <div
          className="skill-cohort-certificate-page-wrapper"
          id="certificate-panel"
          ref={certificateRef}
        >
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR's Certificate of Completion To
              </h3>
              <h1 className="certificate-username">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">
                For Successfully Completing Hacking HR's ProjectX Cohort:
              </h5>
              <h4 className="certificate-text2">{title}</h4>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">{`${moment(
                  startDate
                ).format("ll")} - ${moment(endDate).format("ll")}`}</h5>
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
    </div>
  );
};

export default SkillCohortCard;
