import { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  message,
  Modal,
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
import Add from "./Add";
import classNames from "classnames";
import { getList, add, getNotice, remove } from "@/api/notice";
import { getDict } from "@/api/system";
import styles from "./index.module.scss";
import "./index.scss";
import dayjs from "dayjs";
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
      render: (text, record, index) => index + 1,
      width: 50
    },
    {
      title: "通知标题",
      dataIndex: "title",
      key: "title",
      width: 200
    },
    {
      title: "通知类型",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150
    },
    {
      title: "通知时间",
      dataIndex: "releaseTimeRange",
      key: "releaseTimeRange",
      ellipsis: true,
      width: 150
    },
    {
      title: "通知日期",
      dataIndex: "releaseTime",
      key: "releaseTime",
      ellipsis: true,
      width: 150
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: token.colorLink }}
              onClick={() => viewRow(record)}
            ></Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              style={{ color: token.colorLink }}
              onClick={() => editRow(record)}
            ></Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={!selectedRowKeys.length}
              onClick={() => removeSelection([record.id])}
            ></Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const [tableData, setTableData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [scrollTableHeight, setScrollHeight] = useState("100%");
  const tableWrapperRef = useRef(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
        category: queryParams.category,
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
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  useLayoutEffect(() => {
    const element = tableWrapperRef.current.nativeElement;
    const tHeader = element.querySelector(".ant-table-thead");
    const { bottom } = tHeader.getBoundingClientRect();
    // 88 =  32+16的分页高度 16+24底部间距
    let extraHeight = 40;
    if (tableData.length) {
      extraHeight = 88;
    }
    const height = `calc(100vh - ${bottom + extraHeight}px)`;
    setScrollHeight(height);
    let placeholder = element.querySelector(".ant-table-placeholder");
    if (placeholder) {
      placeholder.style.height = height;
    }
  }, [tableData]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [rowId, setRowId] = useState("");

  const [disabled, setDisabled] = useState(false);

  const footer = disabled ? null : (
    <>
      <Button onClick={() => setAddModalOpen(false)}>取消</Button>
      <Button type="primary" onClick={handleAdd}>
        确定
      </Button>
    </>
  );

  const addFormRef = useRef();

  // 打开新增弹框
  const handleAddClick = () => {
    addFormRef.current.resetFields();
    setAddModalOpen(true);
    setRowId("");
    setDisabled(false);
  };

  // 增加数据
  async function handleAdd() {
    try {
      const values = await addFormRef.current.validateFields();
      console.log("value-->", values);
      add({
        ...values,
        id: rowId,
        releaseTime: values.releaseTime.format("YYYY-MM-DD HH:mm:ss")
      }).then(
        () => {
          message.success("添加成功!");
          setAddModalOpen(false);
          setQueryParams({ ...queryParams });
          setRowId("");
        },
        () => {
          setRowId("");
        }
      );
    } catch (errorInfo) {
      console.log("error-->", errorInfo);
    }
  }

  // 编辑
  async function editRow(row) {
    setRowId(row.id);
    await loadNoticeData(row);
    setAddModalOpen(true);
    setDisabled(false);
  }

  async function loadNoticeData(row) {
    const { data } = await getNotice(row.id);
    addFormRef.current.setFieldsValue({
      ...data.data,
      releaseTime: dayjs(row.releaseTime, "YYYY-MM-DD HH:mm:ss")
    });
  }

  // 查看
  async function viewRow(row) {
    await loadNoticeData(row);
    setAddModalOpen(true);
    setDisabled(true);
  }

  function handleDelete() {
    removeSelection(selectedRowKeys);
  }

  function removeSelection(ids) {
    const { confirm } = Modal;
    confirm({
      title: "删除提示?",
      content: "确定要删除选中的数据吗",
      onOk() {
        remove(ids.join(",")).then(() => {
          message.info("删除成功！");
          setQueryParams({ ...queryParams });
          setSelectedRowKeys([]);
        });
      }
    });
  }

  return (
    <div className={classNames(styles.noticeContainer, "page-layout")}>
      <Card
        bordered={false}
        styles={{ body: { paddingBottom: 0 } }}
        style={{ margin: "15px 15px 0 7px" }}
      >
        <Form
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
          margin: "15px 15px 15px 7px",
          flex: "1",
          overflow: "hidden"
        }}
        styles={{ body: { display: "flex", flexDirection: "column", height: "100%" } }}
      >
        <div className={styles.tableHeaderOperator}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              新增
            </Button>
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        </div>
        <Table
          rootClassName="fill-height-table"
          ref={tableWrapperRef}
          scroll={{
            x: "500px",
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
      <Modal
        title="新增"
        width={860}
        forceRender
        destroyOnClose
        open={isAddModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={handleAdd}
        footer={footer}
      >
        <Add categoryOptions={categoryOptions} ref={addFormRef} disabled={disabled}></Add>
      </Modal>
    </div>
  );
}
