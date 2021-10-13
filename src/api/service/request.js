import axios from "axios";
import qs from "qs";
import { Message, Loading } from "element-ui";
const service = axios.create({
  // baseURL: "/api",
  timeout: 500, // 响应时间 5000
  withCredentials: true, // 配置cookie
  // 配置请求头
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});
// 配置接口地址
axios.defaults.baseURL = "";

var loadingInstance;
service.interceptors.request.use(
  config => {
    console.log(config, "-----------config");
    // 是否需要设置 token
    // config.headers.token='wwwwwsdsdf'
    loadingInstance = Loading.service({
      lock: true,
      text: "数据加载中，请稍后...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    loadingInstance.close();
    Message.error("请求错误");
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  response => {
    //接收到响应数据并成功后的一些共有的处理，关闭loading等
    if (response.status === 200) {
      loadingInstance.close();
      return response;
    } else {
      loadingInstance.close();
      // Message.error(response.data.message);
      Promise.reject();
    }
  },
  error => {
    loadingInstance.close();
    /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          // window.location.href = "/NotFound";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      // 超时处理
      if (qs.stringify(error).includes("timeout")) {
        Message.error("服务器响应超时，请刷新当前页");
      }
      error.message("连接服务器失败");
    }

    Message.error(error.message);
    /***** 处理结束 *****/
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response);
  }
);

export default service;
