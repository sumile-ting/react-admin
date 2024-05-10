import Mock from "mockjs";
const listLength = Mock.mock("@integer(1, 100)");
const LIST = Array.from({ length: listLength }).map(() => {
  const category = Mock.mock("@integer(1, 3)");
  return {
    id: Mock.mock("@guid"),
    createUser: Mock.mock("@guid"),
    createDept: Mock.mock("@guid"),
    createTime: Mock.mock("@datetime"),
    updateUser: Mock.mock("@guid"),
    updateTime: Mock.mock("@datetime"),
    status: 1,
    title: Mock.mock("@ctitle"),
    category: category,
    releaseTime: Mock.mock("@datetime"),
    content: `<p>${Mock.mock("@cparagraph")}</p>`,
    categoryName: ["", "发布通知", "批转通知", "转发通知"][category]
  };
});
export default [
  {
    url: "/mock/sumile-system/notice/list",
    method: "get",
    response: ({ query }) => {
      const { title, category, current, size } = query;
      const mockList = LIST.filter((item) => {
        if (title && item.title.indexOf(title) < 0) return false;
        return true;
      }).filter((item) => {
        return category ? item.category == category : true;
      });

      const pageList = mockList.filter(
        (_, index) => index < size * current && index >= size * (current - 1)
      );

      return {
        code: 200,
        success: true,
        data: {
          records: pageList,
          total: mockList.length,
          size: size,
          current: current
        },
        msg: "操作成功"
      };
    }
  }
];
