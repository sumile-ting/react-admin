import { forwardRef } from "react";
import { Form, Row, Col, Input, Select, DatePicker, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";

const Add = forwardRef(function Add({ categoryOptions, disabled }, ref) {
  return (
    <Form ref={ref} disabled={disabled}>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name="title"
            label="通知标题"
            rules={[
              {
                required: true,
                message: "请输入通知标题"
              }
            ]}
          >
            <Input placeholder="请输入通知标题" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="category"
            label="通知类型"
            rules={[
              {
                required: true,
                message: "请选择通知类型"
              }
            ]}
          >
            <Select allowClear options={categoryOptions} placeholder="请选择通知类型" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="releaseTime"
            label="通知日期"
            rules={[
              {
                required: true,
                message: "请选择通知日期"
              }
            ]}
          >
            <DatePicker
              allowClear
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="content"
            label="通知内容"
            rules={[
              {
                required: true,
                message: "请输入通知内容"
              }
            ]}
          >
            <ReactQuill theme="snow" className="react-quill" readOnly={disabled} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});
export default Add;
