import React from "react";
import PropTypes from "prop-types";

import { CustomButton, SpecialtyItem } from "components";

import DefaultMarketplaceLogo from "images/img-default-marketplace-logo.png";
import IconMailOutline from "images/icon-mail-outline.svg";
import IconBriefCaseOutLine from "images/icon-briefcase-outline.svg";
import IconCallOutLine from "images/icon-call-outline.svg";
import IconUser from "images/icon-person-outline.svg";

import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

import "./style.scss";

const MarketplaceCard = ({
  name,
  description,
  url,
  logoUrl,
  contact_name,
  contact_position,
  contact_email,
  contact_phone,
  demoUrl,
  twitter,
  facebook,
  linkedin,
  instagram,
  categories,
  allCategories,
}) => {
  const onVisitWebSite = (url) => {
    window.open(url, "_blank");
  };

  const onDemo = () => {
    window.open(demoUrl, "_blank");
  };

  return (
    <div className="marketplace-card">
      <div className="marketplace-card__container">
        <div className="marketplace-card__container__logo">
          <img
            src={
              logoUrl != null && logoUrl !== ""
                ? logoUrl
                : DefaultMarketplaceLogo
            }
            alt="logo-img"
          />
          <div className="d-flex flex-column">
            <CustomButton
              text="Visit website"
              size="sm"
              onClick={() => onVisitWebSite(url)}
            />
            {demoUrl && <CustomButton text="Demo" size="sm" onClick={onDemo} />}
          </div>
        </div>
        <div className="marketplace-card__container__content">
          <div className="marketplace-card__content__header">
            <h3>{name}</h3>
          </div>
          <div className="marketplace-card__content__subtitle">
            {(categories || []).map((item, index) => {
              const category = allCategories.find((cat) => cat.value === item);
              return (
                <SpecialtyItem
                  key={index}
                  title={category ? category.title : item}
                />
              );
            })}
          </div>
          <div className="marketplace-card__content__paragraph">
            <p>{description}</p>
          </div>
          <p className="marketplace-card__content__label">
            Contact information
          </p>
          <div className="marketplace-card__content__information">
            <div className="marketplace-card__content__information--item">
              <span
                className="marketplace-card__content__information--icon"
                style={{
                  backgroundImage: `url(${IconUser})`,
                }}
              ></span>
              {contact_name}
            </div>
            <div className="marketplace-card__content__information--item">
              <span
                className="marketplace-card__content__information--icon"
                style={{
                  backgroundImage: `url(${IconMailOutline})`,
                }}
              ></span>
              {contact_email}
            </div>
          </div>
          <div className="marketplace-card__content__information">
            <div className="marketplace-card__content__information--item">
              <span
                className="marketplace-card__content__information--icon"
                style={{
                  backgroundImage: `url(${IconBriefCaseOutLine})`,
                }}
              ></span>
              {contact_position}
            </div>
            <div className="marketplace-card__content__information--item">
              <span
                className="marketplace-card__content__information--icon"
                style={{
                  backgroundImage: `url(${IconCallOutLine})`,
                }}
              ></span>
              {contact_phone}
            </div>
          </div>
          <div className="marketplace-card__content__socialmedia_links">
            {facebook && (
              <div>
                <a href={facebook} target="_blank" rel="noopener noreferrer"><FacebookOutlined /></a>
              </div>
            )}
            {linkedin && (
              <div>
                <a href={linkedin} target="_blank" rel="noopener noreferrer"><LinkedinOutlined /></a>
              </div>
            )}
            {twitter && (
              <div>
                <a href={twitter} target="_blank" rel="noopener noreferrer"><TwitterOutlined /></a>
              </div>
            )}
            {instagram && (
              <div>
                <a href={instagram} target="_blank" rel="noopener noreferrer"><InstagramOutlined /></a>
              </div>
            )}
          </div>

          <div className="marketplace-card__content__mobile--button">
            <CustomButton
              text="Visit website"
              size="sm"
              onClick={() => onVisitWebSite(url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
MarketplaceCard.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  logoUrl: PropTypes.string,
  contact_name: PropTypes.string,
  contact_position: PropTypes.string,
  contact_email: PropTypes.string,
  contact_phone: PropTypes.string,
  demoUrl: PropTypes.string,
  categories: PropTypes.array,
  allCategories: PropTypes.array,
};

MarketplaceCard.defaultProps = {
  name: "",
  description: "",
  url: "",
  logoUrl: "",
  contact_name: "",
  contact_position: "",
  contact_email: "",
  contact_phone: "",
  demoUrl: "",
  categories: [],
  allCategories: [],
};

export default MarketplaceCard;
