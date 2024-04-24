import { Table } from "antd";
import { useRef, useEffect, useState, useMemo } from "react";
import { useTable } from "./useTable.jsx";
import "./index.scss";

function CustomTable(props) {
  const {
    queryParams, //查询参数
    showIndex, // 是否显示序号列
    collapse, // 上方搜索面板是否展开
    columns, // 表格列配置
    showPagination, //是否显示分页
    pagination, // 分页配置
    requestApi // 获取表格数据的请求
  } = props;

  const fetchData = useMemo(() => {
    if (!requestApi) {
      return;
    }
    return async (pageParams) => {
      const actionParams = {
        ...(pageParams || {}),
        ...queryParams
      };
      return requestApi(actionParams);
    };
  }, [requestApi, queryParams]);

  const [pageData, setPageData] = useState(
    pagination
      ? { size: pagination.pageSize, current: pagination.current }
      : { size: 10, current: 1 }
  );
  const pageInfo = useMemo(() => {
    return {
      size: pageData.size || 10,
      current: pageData.current || 1
    };
  }, [pageData]);

  const { tableData, loading, total } = useTable({
    request: fetchData,
    pageInfo: pageInfo
  });

  const tableWrapperRef = useRef(null);
  const [scrollTableHeight, setScrollHeight] = useState("100%");

  const tableColumns = useMemo(() => {
    const filterColumns = columns.map((item) => ({
      ...item,
      title: item.label,
      dataIndex: item.name
    }));
    if (showIndex) {
      // 增加序号列
      filterColumns.unshift({
        title: "#",
        dataIndex: "index",
        render: (text, record, index) => index + 1 + pageInfo.size * (pageInfo.current - 1),
        width: 50
      });
    }
    return filterColumns;
  }, [columns, showIndex, pageInfo]);

  useEffect(() => {
    const element = tableWrapperRef.current.nativeElement;
    const tHeader = element.querySelector(".ant-table-thead");
    const { bottom } = tHeader.getBoundingClientRect();
    // 88 =  32+16的分页高度 16+24底部间距
    let extraHeight = 40;
    if (showPagination && tableData.length) {
      extraHeight = 88;
    }
    const height = `calc(100vh - ${bottom + extraHeight}px)`;
    setScrollHeight(height);
    let placeholder = element.querySelector(".ant-table-placeholder");
    if (placeholder) {
      placeholder.style.height = height;
    }
  }, [tableData, showPagination, collapse]);
  return (
    <Table
      loading={loading}
      rootClassName="fill-height-table"
      ref={tableWrapperRef}
      scroll={{
        x: "500px",
        y: scrollTableHeight
      }}
      pagination={
        showPagination
          ? {
              position: ["bottomRight"],
              showTotal: (total) => `共${total}条`,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setPageData({
                  current: page,
                  size: pageSize
                });
              },
              ...pagination,
              total
            }
          : false
      }
      rowKey={"id"}
      bordered={true}
      columns={tableColumns}
      dataSource={tableData}
    />
  );
}
export default CustomTable;
