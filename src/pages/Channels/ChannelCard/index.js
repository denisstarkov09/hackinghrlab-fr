import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";
// import { SpecialtyItem } from "components";
import { Link } from "react-router-dom";
import { CARD_MENUS } from "enum";
import { categorySelector } from "redux/selectors/categorySelector";
import CardMenu from "components/CardMenu";

import { ReactComponent as IconPlus } from "images/icon-plus.svg";
import IconMenu from "images/icon-menu.svg";

import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const ChannelCard = ({
  id,
  title,
  description,
  image,
  add,
  allCategories,
  categories,
  isOwner,
  isEditor,
  onClick,
  onMenuClick,
}) => {
  
  let spaces = title?.split(" ").length - 1
  let spaces2 = title?.split("'").length - 1

  const fixName = (title) => {
    let newTitle = title
    for(let i = 0; i < Number(spaces) ; i++){
      newTitle = newTitle.replace(" ","-")
    }

    for(let i = 0; i < Number(spaces2) ; i++){
      newTitle = newTitle.replace("'","_")
    }

    return newTitle
  }

  return (
    <div style={{position: "relative"}}>
      {(isOwner || isEditor) && 
        <div className="pencil-container" onClick={() => {onMenuClick('edit','frontImage')}}>
          <div className="pencil"></div>
        </div>
      }
      <Link
        className={clsx("channel-card", { add })}
        to={add ? "#" : `/${fixName(title)}`}
        onClick={onClick}
      >
        {add ? (
          <div className="channel-card-container">
            <IconPlus />
          </div>
        ) : (
          <>
            <div className="channel-card-header">
              {image ? (
                <img src={image} alt={title || "cover image"} />
              ) : (
                <div className="channel-card-header-default" />
              )}
            </div>
            <div className="channel-card-content">
              <h3 className="channel-card-title">{title}</h3>
              <div className="d-flex items-center">
                <p className="channel-card-desc">{description || ""}</p>
              </div>
              {/* <div className="channel-card-content-categories">
                {(categories || []).map((item, index) => {
                  const category = allCategories.find(
                    (cat) => cat.value === item
                  );
                  return (
                    <SpecialtyItem
                      key={index}
                      title={category ? category.title : item}
                      active={false}
                    />
                  );
                })}
              </div> */}
              {/* <div className="channel-card-content-footer">
                <div className="d-flex items-center"></div>
                <div className="d-flex items-center">
                  <SvgIcon name="star" className="channel-card-icon" />
                  <SvgIcon name="bookmark" className="channel-card-icon" />
                </div>
              </div> */}
              {(isOwner || isEditor) && (
                <CardMenu menus={CARD_MENUS.slice(0, 1)} onClick={onMenuClick}>
                  <div className="library-card-menu">
                    <img src={IconMenu} alt="icon-menu" />
                  </div>
                </CardMenu>
              )}
            </div>
          </>
        )}
      </Link>
    </div>
  );
};

ChannelCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  add: PropTypes.bool,
  description: PropTypes.string,
  image: PropTypes.string,
  categories: PropTypes.array,
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  onClick: PropTypes.func,
  onMenuClick: PropTypes.func,
};

ChannelCard.defaultProps = {
  title: "",
  description: "",
  add: false,
  image: HARDCODED_COVER_PLACEHOLDER,
  categories: [],
  isOwner: false,
  isEditor: false,
  onClick: () => {},
  onMenuClick: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(ChannelCard);
