/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import RenderPropsTruncatedString from 'components/RenderPropsTruncatedString.js';
import HEART_COMMENT_CATEGORIES from 'enum/HEARTCommentCategories.js';
import MAP_HEART_CATEGORY_TO_COLOR from 'enum/MapHeartCategoryToColor.js';
import { Rate, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CustomButton, } from "components";

import "./style.scss";

function HEARTComment({
  category,
  rate = null,
  content = '',
  allowResponses = false,
  allowActions = false,
  children = null,
  icon,
  id,
  rateChange = () => {},
  onClick = () => {},
  onEditClick = () => {},
  onRemoveClick = () => {},
}) {
  const actionsMenu = (
    <Menu>
      <Menu.Item onClick={onEditClick}>
        Edit
      </Menu.Item>
      <Menu.Item onClick={onRemoveClick}>
        Remove
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={`
      heart-comment__container
      ${(!allowResponses && rate === null && !allowActions) ? 'heart-comment__container-secondary' : '' }
    `}>
      <div className={`
        heart-comment__card
        border-color--${MAP_HEART_CATEGORY_TO_COLOR[category]}
      `}>
        <div className="heart-comment__card-icon-col">
          <span className="heart-comment__card-icon"
            style={{
              backgroundImage: `url(${icon})`,
            }}
          ></span>
        </div>

        <div className="heart-comment__card-content-col">
          <p className="heart-comment__card-content-p">
            <RenderPropsTruncatedString text={content}>
              {({ truncatedText, isTruncated, isTruncatable, toggleTruncate,  }) => (
                <>
                  {truncatedText}
                  {isTruncatable &&
                    <button
                    className="heart-comment__card-content-show-more"
                      onClick={e => {
                        e.preventDefault()
                        toggleTruncate();
                      }}
                    >
                      {isTruncated ? 'more' : 'less'}
                    </button>
                  }
                </>
              )}
            </RenderPropsTruncatedString>
          </p>
        </div>

        <div className="heart-comment__card-actions-col">
          {rate !== null &&
            <div className="heart-comment__card-action">
              <Rate
                allowHalf
                defaultValue={rate}
                className="heart-comment__rate"
                onChange={newRate => rateChange({ id, newRate })}
              />
            </div>
          }
          
          {allowResponses &&
            <div className="heart-comment__card-action">
              <CustomButton
                text="Add response"
                type="primary"
                size="small"
                onClick={onClick}
              />
            </div>
          }
          {allowActions &&
            <div className="heart-comment__card-action">
              <Dropdown overlay={actionsMenu} placement="bottomCenter" arrow>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Actions <DownOutlined />
                </a>
              </Dropdown>
            </div>
          }
        </div>
      </div>

      {(children && children.length > 0) &&
        <div className="heart-comment__responses-wrap">
          {children}
        </div>
      }
    </div>
  )
}

HEARTComment.propTypes = {
  category: PropTypes.oneOf(Object.keys(HEART_COMMENT_CATEGORIES)).isRequired,
  rate: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  content: PropTypes.string.isRequired,
  allowResponses: PropTypes.bool,
  allowActions: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  rateChange: PropTypes.func,
  onClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
};

export default memo(HEARTComment);
