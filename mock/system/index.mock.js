import Mock from "mockjs";
export default [
  {
    url: "/mock/sumile-system/dict/dictionary",
    method: "get",
    response: ({ query }) => {
      let data = [];
      const { code } = query;
      if (code === "notice") {
        data = [
          {
            dictKey: 1,
            dictValue: "发布通知"
          },
          {
            dictKey: 2,
            dictValue: "批转通知"
          },
          {
            dictKey: 3,
            dictValue: "转发通知"
          }
        ];
      } else {
        const length = Mock.mock("@integer(1, 10)");
        data = Array.from({ length }).map(() => ({
          dictKey: Mock.mock("@id"),
          dictValue: Mock.mock("@ctitle")
        }));
      }

      return {
        code: 200,
        success: true,
        data: data,
        msg: "操作成功"
      };
    }
  }
];
