import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NoItemsMessageCard from "components/NoItemsMessageCard";
import Arrow from "../../images/arrow-conference.svg"

import "./style.scss";

const CollapseComponent = ({
    informationCollapse,
    dataIterated,
    dataStatic,
    className,
    buttons,
    index,
    bulMessage,
    bulShowMore = true
}) => {
    
    const [visibleConfirmApply, setVisibleConfirmApply] = useState(false);
    const memberRef = useRef();


    const collapseFunction = () => {
        if(visibleConfirmApply !== true){
            memberRef.current.scroll(0,0)
            setVisibleConfirmApply(true)
        }else{
            setVisibleConfirmApply(false)
        }
    }

    return (
      <>
        <div className={className} key={index}>
            <img className="arrow" src={Arrow} alt="arrow"/>
            <div className="detail-border"></div>
            {informationCollapse}
            <div className="container-button">
                {buttons} 
            </div>
            {bulShowMore && <p className="button-more-information" onClick={() => {collapseFunction()}}>
                {`${visibleConfirmApply ? "Less" : "More" } information`}
            </p>}
            <div 
                className={`${visibleConfirmApply ? "collapseContaintTrue" : "collapseContaintFalse"}`} 
                ref={memberRef}
                style={{opacity: `${visibleConfirmApply ? "100%" : "0%"}`}}
            >
                {
                    (dataIterated?.props?.children?.length > 0 && dataIterated?.props?.children?.length !== undefined) ? (
                        <>
                            {dataStatic}
                            {dataIterated}
                        </>
                    ) : (
                        <>
                            {dataStatic}
                            {bulMessage 
                            ? (
                                <NoItemsMessageCard
                                    message={`There aren't members in this panel.`}
                                />
                            ) : <div></div>}
                            
                        </>
                    )
                }
            </div>
        </div>
      </>
    );
  };
  
  const mapStateToProps = (state, props) => ({

  });
  
  const mapDispatchToProps = {

  };

  CollapseComponent.propTypes = {
    informationCollapse: PropTypes.element,
    dataIterated: PropTypes.element,
    dataStatic: PropTypes.element,
    buttons: PropTypes.element,
    className: PropTypes.string,
    index: PropTypes.number,
    bulMessage: PropTypes.bool,
  };
  
  CollapseComponent.defaultProps = {
    informationCollapse: <></>,
    dataIterated: <></>,
    dataStatic: <></>,
    buttons: <></>,
    className: "",
    index: -1,
    bulMessage: true
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(CollapseComponent);