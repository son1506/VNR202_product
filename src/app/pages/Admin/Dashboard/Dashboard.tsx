import React from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        Dashboard
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Mốc sự kiện" value={7} suffix="mốc" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tác nhân" value={4} suffix="bên" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Giai đoạn" value="1954–1964" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Bản đồ" value="1" suffix="trang" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;