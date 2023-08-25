import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import clsx from "clsx";
import { connect } from "react-redux";
// import { SpecialtyItem } from "components";
import { Link } from "react-router-dom";
import { INTERNAL_LINKS, CARD_MENUS, CARD_TYPE } from "enum";
import { categorySelector } from "redux/selectors/categorySelector";
import CardMenu from "components/CardMenu";

import { ReactComponent as IconPlus } from "images/icon-plus.svg";
import IconMenu from "images/icon-menu.svg";

import "./style.scss";
import moment from "moment";

const BlogCard = ({
  id,
  title,
  type,
  onAdd,
  summary,
  image,
  data,
  // allCategories,
  // categories,
  date,
  isOwner,
  isEditor,
  isDraft,
  onMenuClick,
}) => {
  const location = useLocation();

  let thirdCondition = (isDraft) ? '#' : `${location.pathname}${INTERNAL_LINKS.BLOGS}/${id}`
  let fiveCondition = (isDraft) ? '#' : `${INTERNAL_LINKS.BLOGS}/${id}`

  return (
    <Link
      className={clsx("blog-card", { add: type === CARD_TYPE.ADD })}
      to={
        type === CARD_TYPE.ADD
          ? "#"
          : location.pathname.includes("channels")
            ? (window.location.pathname.substring(0, 15) === INTERNAL_LINKS.BLOGS_PAGUE) ? "#" : thirdCondition
            : (window.location.pathname.substring(0, 15) === INTERNAL_LINKS.BLOGS_PAGUE) ? "#" : fiveCondition
      }
      onClick={() => {
        if (onAdd) {
          if (isDraft) {
            onMenuClick('edit', id)
          } else {
            onAdd(id)
          }
        }
      }}
    >
      {type === CARD_TYPE.ADD ? (
        <div className="blog-card-container">
          <IconPlus />
        </div>
      ) : (
        <>
          <div className="blog-card-header">
            {image ? (
              <img src={image} alt={title || "cover image"} />
            ) : (
              <div className="blog-card-header-default" />
            )}
          </div>
          <div className="blog-card-content">
            <h3 className="blog-card-title">{title}</h3>
            {isDraft && ((!data?.datePublic) ? <span>Saved as a draft</span> : <span>Scheduled for {moment(data?.datePublic, "YYYY-MM-DD HH:mm").startOf('hour').format("MM/DD/YYYY")} at {moment(data?.datePublic, "YYYY-MM-DD HH:mm").startOf('hour').format("HH:mm")} (Pacific Time)</span>)}
            <div className="d-flex items-center">
              <p style={{ color: "#000" }}>{summary}</p>
            </div>
            {/* <div className="blog-card-content-categories">
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
            <div className="blog-card-content-date">
              <span>{!data?.datePublic ? moment(date).format("MM/DD/YYYY") : ``}</span>
            </div>
            {(isOwner || isEditor) && (
              <CardMenu
                menus={CARD_MENUS.slice(0, 2)}
                onClick={(option) => onMenuClick(option, id)}
              >
                <div className="library-card-menu">
                  <img src={IconMenu} alt="icon-menu" />
                </div>
              </CardMenu>
            )}
          </div>
        </>
      )}
    </Link>
  );
};

BlogCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  summary: PropTypes.string,
  image: PropTypes.string,
  categories: PropTypes.array,
  type: PropTypes.string,
  onAdd: PropTypes.func,
  date: PropTypes.string,
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  isDraft: PropTypes.bool,
  onMenuClick: PropTypes.func,
};

BlogCard.defaultProps = {
  title: "",
  summary: "",
  type: CARD_TYPE.VIEW,
  onAdd: () => { },
  categories: [],
  isOwner: false,
  isEditor: false,
  isDraft: false,
  date: `${moment().format("MM/DD/YYYY")}`,
  onMenuClick: () => { },
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(BlogCard);
