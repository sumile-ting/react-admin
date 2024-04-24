import { Form, Row, Col, Input, Space, Button, Tooltip } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";

import styles from "./index.module.scss";
function QueryForm({ collapse, setCollapse, columns, onQuery, formProps }) {
  const [form] = Form.useForm();

  const queryColumns = useMemo(() => columns.filter((item) => item.search), [columns]);
  const searchColumnLength = queryColumns.length;

  const formItemRender = (item) => {
    if (item.queryRender && typeof item.queryRender === "function") {
      return item.queryRender(item.value, form.setFieldValue);
    } else {
      return <Input placeholder={"请输入" + item.label} />;
    }
  };

  const [minVisibleLength, setMinVisibleLength] = useState(3);
  function onResize() {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth >= 1600) {
      setMinVisibleLength(3);
    } else if (clientWidth >= 1200) {
      setMinVisibleLength(2);
    } else {
      setMinVisibleLength(1);
    }
  }
  const colLen = minVisibleLength + 1; // 每行可容纳的form-item数量
  const colSpan = 24 / colLen; // 每个form-item占的span
  const searchBtnSpan =
    searchColumnLength >= colLen && collapse
      ? colSpan
      : (colLen - (searchColumnLength % colLen)) * colSpan;

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Form layout="horizontal" {...formProps} form={form} colon={false} onFinish={onQuery}>
      <Row gutter={24}>
        {queryColumns.map(
          (item, index) =>
            (!collapse || index < minVisibleLength) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={item.name}>
                <Form.Item name={item.name} label={item.label}>
                  {formItemRender(item)}
                </Form.Item>
              </Col>
            )
        )}
        <Col
          xs={24}
          sm={24}
          xl={searchBtnSpan}
          xxl={searchBtnSpan}
          md={searchBtnSpan}
          lg={searchBtnSpan}
        >
          <Form.Item wrapperCol={{ span: 24 }}>
            <div
              style={{
                textAlign: "right"
              }}
            >
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    onQuery({});
                  }}
                >
                  重置
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Col>
      </Row>
      {searchColumnLength > minVisibleLength && (
        <div className={styles.formCollapseBtn} onClick={() => setCollapse(!collapse)}>
          <Tooltip title={collapse ? "展开" : "收缩"}>
            {collapse ? <DownOutlined /> : <UpOutlined />}
          </Tooltip>
        </div>
      )}
    </Form>
  );
}
export default QueryForm;
