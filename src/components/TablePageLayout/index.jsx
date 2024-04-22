import { Card } from "antd";
import QueryForm from "../QueryForm";
import styles from "./index.module.scss";
function TablePageLayout(props) {
  const { columns, search, queryRender, toolbarRender, tableRender, onQuery, onResetQuery } = props;
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
            <QueryForm columns={columns} onFinish={onQuery} onReset={onResetQuery}></QueryForm>
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
        {tableRender}
      </Card>
    </div>
  );
}
export default TablePageLayout;
