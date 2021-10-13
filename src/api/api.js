import http from "./request";

export const areaOrgFind = data => {
  return http({
    url: "/areaOrg/find", //接口
    method: "post",
    data: data
  });
};
export const areaOrgFindId = id => {
  return http({
    url: "/areaOrg/find", //接口
    method: "get",
    params: {
      compId: id
    }
  });
};
