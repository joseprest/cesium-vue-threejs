import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "projectManagement"
    },
    component: () => import("../views/mainMenu.vue"),
    children: [
      // 项目管理列表
      {
        path: "/projectManagement",
        name: "projectManagement",
        component: () =>
          import("../views/projectManagement/projectManagement.vue")
      },
      // 模型管理列表
      {
        path: "/modelsManagement",
        name: "modelsManagement",
        component: () =>
          import("../views/modelsManagement/modelsManagement.vue")
      },
      // xeokit-sdk 示例
      {
        path: "/xeokitIndex",
        name: "xeokitIndex",
        redirect: {
          name: "loadingObjCar"
        },
        component: () => import("../views/xeokitDemo/xeokitIndex.vue"),
        children: [
          // obj模型
          {
            path: "/xeokitIndex/loadingObjCar",
            name: "loadingObjCar",
            component: () => import("../views/xeokitDemo/loadingObjCar.vue"),
            meta: { activeMenu: "/xeokitIndex" }
          },
          // xkt房子模型，带模型树
          {
            path: "/xeokitIndex/BIMOffline_XKT_Duplex",
            name: "BIMOffline_XKT_Duplex",
            component: () =>
              import("../views/xeokitDemo/BIMOffline_XKT_Duplex.vue"),
            meta: { activeMenu: "/xeokitIndex" }
          },
          // 点云模型
          {
            path: "/xeokitIndex/loading_XKT_MAP_pointCloud",
            name: "loading_XKT_MAP_pointCloud",
            component: () =>
              import("../views/xeokitDemo/loading_XKT_MAP_pointCloud.vue"),
            meta: { activeMenu: "/xeokitIndex" }
          },
          // 右键有操作面板
          {
            path: "/xeokitIndex/ContextMenu_Canvas_TreeViewPlugin_Custom",
            name: "ContextMenu_Canvas_TreeViewPlugin_Custom",
            component: () =>
              import(
                "../views/xeokitDemo/ContextMenu_Canvas_TreeViewPlugin_Custom.vue"
              ),
            meta: { activeMenu: "/xeokitIndex" }
          },
          // 自动漫游
          {
            path: "/xeokitIndex/performance_ViewCullPlugin_CameraPathAnimation",
            name: "performance_ViewCullPlugin_CameraPathAnimation",
            component: () =>
              import(
                "../views/xeokitDemo/performance_ViewCullPlugin_CameraPathAnimation.vue"
              ),
            meta: { activeMenu: "/xeokitIndex" }
          }
        ]
      },
      // d3preview示例
      {
        path: "/d3previewIndex",
        name: "d3previewIndex",
        redirect: {
          name: "initXL"
        },
        component: () => import("../views/d3previewDemo/d3previewIndex.vue"),
        children: [
          // 加载线路模型
          {
            path: "/d3previewIndex/initGim/initXL",
            name: "initXL",
            component: () =>
              import("../views/d3previewDemo/initGim/initXL.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          },
          // 加载变电模型
          {
            path: "/d3previewIndex/initGim/initBD",
            name: "initBD",
            component: () =>
              import("../views/d3previewDemo/initGim/initBD.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          },
          // 地面POI标记
          {
            path: "/d3previewIndex/drawCore/drawMarker",
            name: "drawMarker",
            component: () =>
              import("../views/d3previewDemo/drawCore/drawMarker.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          },
          // 模型POI标记
          {
            path: "/d3previewIndex/drawCore/drawModelMarker",
            name: "drawModelMarker",
            component: () =>
              import("../views/d3previewDemo/drawCore/drawModelMarker.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          },
          // 显示隐藏POI标记
          {
            path: "/d3previewIndex/drawCore/showHideMarkers",
            name: "showHideMarkers",
            component: () =>
              import("../views/d3previewDemo/drawCore/showHideMarkers.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          },
          // 飞行漫游
          {
            path: "/d3previewIndex/roaming/flyRoaming",
            name: "flyRoaming",
            component: () =>
              import("../views/d3previewDemo/roaming/flyRoaming.vue"),
            meta: { activeMenu: "/d3previewIndex" }
          }
        ]
      },
      // UE4 像素流送
      {
        path: "/ue4Player",
        name: "ue4Player",
        component: () => import("../views/UE4Player/ue4Player.vue")
      }
    ]
  },
  // 项目详情
  {
    path: "/projectDetail",
    name: "projectDetail",
    component: () => import("../views/projectManagement/projectDetail.vue")
    // meta: { activeMenu: "/projectManagement" }
  },
  // cesiumJS与threeJS结合demo
  {
    path: "/CesiumAndThree",
    name: "CesiumAndThree",
    component: () => import("../views/projectManagement/CesiumAndThree.vue")
  },
  // threeJS demo
  {
    path: "/three",
    name: "three",
    component: () => import("../views/Three.vue")
  },
  // cesiumJS 地球 demo
  {
    path: "/map",
    name: "map",
    component: () => import("../views/Map.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  routes
});

export default router;
