import React from 'react';
import { Skeleton } from 'antd';
import './style.scss';

function MicroClassSkeleton() {

  return (
    <div className="micro-class-skeleton__row">
      <div className="micro-class-skeleton__col-1">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>

      <div className="micro-class-skeleton__col-2">
        <Skeleton.Input
          active
          shape="round"
          style={{
            width: '100%',
            paddingTop: '56.25%'
          }}
        />
      </div>
    </div>
  )
}

export default MicroClassSkeleton;
