import React from "react";
import { Statistic, Col } from "antd";

export default function UserAmount({ userCount }) {
  return (
    <Col className="absolute bottom-0 left-0 p-3" span={12}>
      <Statistic title="Active Users" value={userCount} />
    </Col>
  );
}
