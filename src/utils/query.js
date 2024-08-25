import queryString from "query-string";

let data;

if (process.env.NODE_ENV === "development") {
  // 下面是开发时用来测试的数据
  data = {
    gender: null,
    username: "xiang",
    gender:'nan',
    date: "1999年8月8日",
    requirement: "单身寻找姻缘",
  };
} else {
  data = queryString.parse(window.location.search);
}

export default data;
