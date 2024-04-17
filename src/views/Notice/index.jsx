import { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  message,
  Card,
  Form,
  Input,
  Space,
  Button,
  Row,
  Col,
  Table,
  Select,
  DatePicker,
  Tooltip,
  theme
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { getList } from "@/api/notice";
import { getDict } from "@/api/system";
import styles from "./index.module.scss";
import "./index.scss";
const { RangePicker } = DatePicker;
const { useToken } = theme;
export default function Notice() {
  const { token } = useToken();
  const formStyle = {
    maxWidth: "none"
  };
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    current: 1,
    pageSize: 10,
    title: "",
    category: "",
    releaseTimeRange: ["", ""]
  });
  const [total, setTotal] = useState(0);
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "title",
      render: (text, record, index) => index + 1
    },
    {
      title: "通知标题",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "通知类型",
      dataIndex: "categoryName",
      key: "categoryName"
    },
    {
      title: "通知时间",
      dataIndex: "releaseTimeRange",
      key: "releaseTimeRange"
    },
    {
      title: "通知日期",
      dataIndex: "releaseTime",
      key: "releaseTime"
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: token.colorLink }}
            ></Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              style={{ color: token.colorLink }}
            ></Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" danger icon={<DeleteOutlined />} size="small"></Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const [tableData, setTableData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [scrollTableHeight, setScrollHeight] = useState("100%");
  const tableWrapperRef = useRef(null);

  useEffect(() => {
    async function getData() {
      const res = await getDict({
        code: "notice"
      });
      setCategoryOptions(
        res.data.data.map((item) => ({
          label: item.dictValue,
          value: item.dictKey
        }))
      );
    }
    getData();
  }, []);

  useEffect(() => {
    function getData() {
      const params = {
        title: queryParams.title,
        releaseTime_datege: queryParams.releaseTimeRange[0],
        releaseTime_datelt: queryParams.releaseTimeRange[1],
        current: queryParams.current,
        size: queryParams.pageSize
      };
      getList(params).then((res) => {
        setTableData(res.data.data.records);
        setTotal(res.data.data.total);
      });
    }
    getData();
  }, [queryParams]);

  // 查询
  function onFinish(values) {
    const rangeTimeValue = values["releaseTimeRange"];
    setQueryParams({
      ...queryParams,
      ...values,
      releaseTimeRange: rangeTimeValue
        ? [
            rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
            rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss")
          ]
        : ["", ""]
    });
  }

  // 重置
  function onReset() {
    form.resetFields();
    setQueryParams({
      current: 1,
      pageSize: 10,
      title: "",
      category: "",
      releaseTimeRange: ["", ""]
    });
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    }
  };

  useLayoutEffect(() => {
    const element = tableWrapperRef.current.nativeElement;
    const tHeader = element.querySelector(".ant-table-thead");
    const { bottom } = tHeader.getBoundingClientRect();
    // 88 =  32+16的分页高度 16+24底部间距
    const height = `calc(100vh - ${bottom + 88}px)`;
    setScrollHeight(height);
    let placeholder = element.querySelector("ant-table-placeholder");
    if (placeholder) {
      placeholder.style.height = height;
      placeholder.style.display = "flex";
      placeholder.style.alignItems = "center";
      placeholder.style.justifyContent = "center";
    }
  }, []);

  return (
    <div className={classNames(styles.noticeContainer, "page-layout")}>
      <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
        <Form
          name="horizontal_login"
          form={form}
          style={formStyle}
          colon={false}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="title" label="通知标题">
                <Input placeholder="请输入通知标题" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="category" label="通知类型">
                <Select allowClear options={categoryOptions} placeholder="请选择通知类型" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="releaseTimeRange" label="通知时间">
                <RangePicker
                  showTime={true}
                  separator={"-"}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={["开始时间", "结束时间"]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
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
            </Col>
          </Row>
        </Form>
      </Card>
      <Card
        bordered={false}
        style={{
          marginTop: "15px",
          flex: "1",
          overflow: "hidden"
        }}
        styles={{ body: { display: "flex", flexDirection: "column", height: "100%" } }}
      >
        <div className={styles.tableHeaderOperator}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              新增
            </Button>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Space>
        </div>
        <Table
          rootClassName="fill-height-table"
          ref={tableWrapperRef}
          scroll={{
            y: scrollTableHeight
          }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection
          }}
          pagination={{
            total: total,
            position: ["bottomRight"],
            showTotal: (total) => `共${total}条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setQueryParams({
                ...queryParams,
                current: page,
                pageSize: pageSize
              });
            }
          }}
          rowKey={"id"}
          bordered={true}
          columns={columns}
          dataSource={tableData}
        />
      </Card>
    </div>
  );
}
