import { Table } from "antd";
import { useRef, useEffect, useState, useMemo } from "react";
import "./index.scss";

function CustomTable(props) {
  const {
    collapse, // 上方搜索面板是否展开
    columns, // 表格列配置
    tableData, // 表格数据
    pagination // 分页配置
  } = props;
  const tableWrapperRef = useRef(null);
  const [scrollTableHeight, setScrollHeight] = useState("100%");

  const tableColumns = useMemo(
    () => columns.map((item) => ({ ...item, title: item.label, dataIndex: item.name })),
    [columns]
  );

  useEffect(() => {
    const element = tableWrapperRef.current.nativeElement;
    const tHeader = element.querySelector(".ant-table-thead");
    const { bottom } = tHeader.getBoundingClientRect();
    // 88 =  32+16的分页高度 16+24底部间距
    let extraHeight = 40;
    if (pagination && tableData.length) {
      extraHeight = 88;
    }
    const height = `calc(100vh - ${bottom + extraHeight}px)`;
    setScrollHeight(height);
    let placeholder = element.querySelector(".ant-table-placeholder");
    if (placeholder) {
      placeholder.style.height = height;
    }
  }, [tableData, pagination, collapse]);
  return (
    <Table
      rootClassName="fill-height-table"
      ref={tableWrapperRef}
      scroll={{
        x: "500px",
        y: scrollTableHeight
      }}
      pagination={pagination || false}
      rowKey={"id"}
      bordered={true}
      columns={tableColumns}
      dataSource={tableData}
    />
  );
}
export default CustomTable;
