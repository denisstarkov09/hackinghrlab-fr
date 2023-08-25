import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import {
    CustomCheckbox
  } from "components";

const ObjectCheckbox = ({
    message,
    functionState,
    id,
    bulReset,
    functionReset
}) => {

    const [checkbox, setCheckbox] = useState(false)

    useEffect(() => {
      if(bulReset){
        setCheckbox(false)
        functionReset()
      }
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bulReset])

    return (
        <CustomCheckbox
            style={{marginTop: '10px'}}
            size="sm"
            checked={checkbox}
            onChange={(e) => {
                functionState(id, checkbox)
                setCheckbox(e.target.checked)
            }}
        >
          {message}
        </CustomCheckbox>
    );
  };
  
  const mapStateToProps = (state, props) => ({

  });
  
  const mapDispatchToProps = {

  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ObjectCheckbox);