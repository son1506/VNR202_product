import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
};

export default Loading;
