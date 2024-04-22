import { Form, Row, Col, Input, Space, Button, Tooltip } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
function QueryForm({ columns, onFinish, onReset }) {
  const [form] = Form.useForm();

  const [collapse, setCollapse] = useState(true);

  const queryColumns = useMemo(() => columns.filter((item) => item.search), [columns]);
  const searchColumnLength = queryColumns.length;

  const formItemRender = (item) => {
    if (item.queryRender && typeof item.queryRender === "function") {
      return item.queryRender(item.value, form.setFieldValue);
    } else {
      return <Input placeholder={"请输入" + item.label} />;
    }
  };

  const searchBtnLg = searchColumnLength >= 4 && collapse ? 6 : (4 - (searchColumnLength % 4)) * 6;
  const searchBtnMd =
    searchColumnLength >= 2 && collapse ? 12 : (2 - (searchColumnLength % 2)) * 12;

  const [minVisibleLength, setMinVisibleLength] = useState(3);
  useEffect(() => {
    function onResize() {
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth >= 1200) {
        setMinVisibleLength(3);
      } else {
        setMinVisibleLength(1);
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Form
      className={classNames(styles.queryForm, !collapse && styles.queryFormExpand)}
      form={form}
      colon={false}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        {queryColumns.map(
          (item, index) =>
            (!collapse || index < minVisibleLength) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6} key={item.name}>
                <Form.Item name={item.name} label={item.label}>
                  {formItemRender(item)}
                </Form.Item>
              </Col>
            )
        )}
        <Col xs={24} sm={24} xl={searchBtnLg} xxl={searchBtnLg} md={searchBtnMd} lg={searchBtnMd}>
          <Form.Item>
            <div
              style={{
                textAlign: "right"
              }}
            >
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={onReset}>重置</Button>
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
