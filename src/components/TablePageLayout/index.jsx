import { Card } from "antd";
import { useState } from "react";
import QueryForm from "../QueryForm";
import CustomTable from "../CustomTable";
import styles from "./index.module.scss";
function TablePageLayout(props) {
  const {
    columns, // 列配置
    formProps, // 搜索面板form属性自定义
    search, // 是否显示上方搜索功能面板
    queryRender, // 搜索功能面板内容自定义
    toolbarRender, // 自定义表格上方操作栏
    tableProps, // 表格Table属性自定义
    tableRender, // 自定义表格渲染区域
    onQuery // 搜索
  } = props;
  const [collapse, setCollapse] = useState(true);

  const [queryParams, setQueryParams] = useState({});

  return (
    <div className="page-layout">
      {search &&
        (queryRender ? (
          queryRender
        ) : (
          <Card
            bordered={false}
            styles={{ body: { paddingBottom: 0 } }}
            style={{ margin: "15px 15px 0 7px" }}
          >
            <QueryForm
              setCollapse={setCollapse}
              collapse={collapse}
              formProps={formProps}
              columns={columns}
              onQuery={(values) => setQueryParams(values)}
            ></QueryForm>
          </Card>
        ))}
      <Card
        bordered={false}
        style={{
          margin: "15px 15px 15px 7px",
          flex: "1",
          overflow: "hidden"
        }}
        styles={{ body: { display: "flex", flexDirection: "column", height: "100%" } }}
      >
        <div className={styles.tableHeaderOperator}>{toolbarRender}</div>
        {tableRender ? (
          tableRender(collapse)
        ) : (
          <CustomTable
            collapse={collapse}
            columns={columns}
            {...tableProps}
            queryParams={queryParams}
          />
        )}
      </Card>
    </div>
  );
}
export default TablePageLayout;
