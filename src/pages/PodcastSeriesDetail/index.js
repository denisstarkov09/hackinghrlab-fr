import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { notification } from "antd";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import Emitter from "services/emitter";

import { EpisodeCard, CustomButton } from "components";
import { INTERNAL_LINKS, EVENT_TYPES } from "enum";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  getPodcastSeries,
  claimPodcastSeries,
} from "redux/actions/podcast-actions";
import { setLoading } from "redux/actions/home-actions";
import getPodcastLinks from "utils/getPodcastLinks";
import PodcastClaimModal from "./PodcastClaimModal";
import PodcastSeriesPanel from "./PodcastSeriesPanel";

import { convertBlobToBase64 } from "utils/format";

import IconBack from "images/icon-back.svg";
import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import "./style.scss";

const PodcastSeriesDetail = ({
  userProfile,
  match,
  podcastSeries,
  getPodcastSeries,
  claimPodcastSeries,
  setLoading,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  const onClaimCredits = () => {
    if (userProfile && userProfile.memberShip === "premium") {
      setModalVisible(true);
    } else {
      setShowFirewall(true);
    }
  };

  const onHRClaimOffered = async () => {
    const pdf = await generatePDF();

    claimPodcastSeries(podcastSeries.id, pdf, (err) => {
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

  const generatePDF = async () => {
    setLoading(true);
    const domElement = document.getElementById("certificate-panel");
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

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  useEffect(() => {
    if (match.params.id) {
      getPodcastSeries(match.params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  return (
    <div className="podcast-series-detail">
      <PodcastSeriesPanel />
      <div className="podcast-series-detail-container">
        {showFirewall && (
          <div
            className="podcast-series-detail-firewall"
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
        <Link to={INTERNAL_LINKS.PODCAST_SERIES}>
          <div className="podcast-series-detail-back">
            <div className="podcast-series-detail-back-img">
              <img src={IconBack} alt="icon-back" />
            </div>
            <h4>Back to Podcast Series</h4>
          </div>
        </Link>
        <h5 className="podcast-series-detail-label">Title</h5>
        <h3 className="podcast-series-detail-value">
          {podcastSeries.title || ""}
        </h3>
        <h5 className="podcast-series-detail-label">Description</h5>
        <h3 className="podcast-series-detail-value">
          {podcastSeries.description || ""}
        </h3>
        <h5 className="podcast-series-detail-label">Learning Objectives</h5>
        <h3 className="podcast-series-detail-value">
          {podcastSeries.objectives || ""}
        </h3>
        <h5 className="podcast-series-detail-label">Duration</h5>
        <h3 className="podcast-series-detail-value">
          {podcastSeries.duration || ""}
        </h3>
        <h5 className="podcast-series-detail-label">HR Credit offered</h5>
        <h3 className="podcast-series-detail-value">
          {podcastSeries.hrCreditOffered || ""}
        </h3>
        <div className="podcast-series-detail-list">
          {(podcastSeries.podcasts || []).map((podcast) => (
            <EpisodeCard
              key={podcast.id}
              links={getPodcastLinks(podcast)}
              episode={podcast}
            />
          ))}
        </div>
        <div className="d-flex justify-center">
          <CustomButton
            type="primary"
            text="Claim HR Credits"
            onClick={onClaimCredits}
          />
        </div>
        <PodcastClaimModal
          visible={modalVisible}
          title="HR Credit Offered"
          destroyOnClose={true}
          data={podcastSeries}
          subTitle={podcastSeries.title}
          onClaim={onHRClaimOffered}
          onCancel={() => setModalVisible(false)}
        />
        <div
          className="podcastseries-certificate certificate-page-wrapper"
          id="certificate-panel"
        >
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR's Certificate of Participation To
              </h3>
              <h1 className="certificate-username">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">
                For Joining The Podcast Series:
              </h5>
              <h4 className="certificate-text2">{podcastSeries.title}</h4>
              <h5 className="certificate-text1 duration">{`Duration: ${podcastSeries.duration}`}</h5>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">{`${moment().format(
                  "MMMM DD, YYYY"
                )}`}</h5>
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

const mapStateToProps = (state, props) => ({
  podcastSeries: podcastSelector(state).podcastSeries,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getPodcastSeries,
  claimPodcastSeries,
  setLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastSeriesDetail);
