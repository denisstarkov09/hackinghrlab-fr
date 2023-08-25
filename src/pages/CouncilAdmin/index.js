import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { homeSelector } from "redux/selectors/homeSelector";
import { councilSelector } from "redux/selectors/councilSelector";
import { INTERNAL_LINKS } from "enum";

import NoItemsMessageCard from "components/NoItemsMessageCard";
import CouncilEvents from "./CouncilEvents";

import { actions as councilConversation } from "redux/actions/councilConversation-actions";
import { councilConversationSelector } from "redux/selectors/councilConversationSelector";

import IconBack from "images/icon-back.svg";

import "./style.scss";

const CouncilPageAdmin = ({
  userProfile,
}) => {
  
  return (
    <>
      {userProfile.role === "admin" ? (
        <div className="council-page-events">
          <div className="search-results-container"> 
            <div className="council-page__container">
              <div className="council-page__results">
                <div className="council-page__row">
                  <div className="council-page__info-column"></div>
                  <div className="council-page__content">
                    <div className="council-filter-panel">
                      <Link to={INTERNAL_LINKS.HOME}>
                        <div className="council-page__content-top">
                          <div className="council-page__content-top-back">
                            <img src={IconBack} alt="icon-back" />
                          </div>
                          <h4>Back</h4>
                        </div>
                      </Link>
                    </div>
                    <CouncilEvents />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="council-page__list-wrap">
          <NoItemsMessageCard
            message={`You must be a admin to see this view.`}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
  councilResources: councilSelector(state).councilResources,
  ...councilConversationSelector(state),
});

const mapDispatchToProps = {
  ...councilConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilPageAdmin);
