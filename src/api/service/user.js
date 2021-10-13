import axios from "./request"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

export default {
  getLoginInfoAPI(params) {
    return axios.post("/api/login", params);
  },
  getUserListAPI(params) {
    return axios.get("/users/list", qs.stringify(params));
  }
};
