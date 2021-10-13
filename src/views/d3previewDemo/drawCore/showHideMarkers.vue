<template>
  <div id="showHideMarker" class="demo-container">
    <div class="operation">
      <el-button type="primary" plain @click="showMarkers">显示标记</el-button>
      <el-button type="primary" plain @click="hideMarkers">隐藏标记</el-button>
    </div>
    <div class="parent-relative">
      <div id="cesiumContainer"></div>
    </div>
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";

var d3preview = window.d3preview;
var D3Preview = new d3preview.D3Preview();
const options = {
  // 可选参数，true为开启，false为关闭，不传默认全部关闭
  // modelPanel: true, // 模型面板
  // walkRoaming: true, // 行走漫游
  // flyRoaming: true, // 飞行漫游
  // annotate: true, // 批注面板
  // modelMove: true, // 模型平移
  // modelRotate: true, // 模型旋转
  // modelSlice: true, // 模型剖切
  // geography: true, //地理信息插件
  // toolsView: true // 右下方小工具
  showProgress: false // 开场进度条
};
var handlerArr = [];
var entityArr = [];
var drawCore = new d3preview.utils.DrawCore();
export default {
  data() {
    return {};
  },
  created() {
    var self = this;
    D3Preview.init(
      "./lib/config.json", // 配置文件
      options, // 配置小组件
      "1f3188e7-f2ba-4bee-80ff-cbfa4ef1ae12", // gim模型sid
      "", // imageOption影像配置项
      function() {
        if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
          //判断是否支持图像渲染像素化处理
          console.log("支持");
          window.viewer.resolutionScale = window.devicePixelRatio;
        }
        window.viewer.scene.fxaa = true;
        window.viewer.scene.postProcessStages.fxaa.enabled = true;
        self.addLeftClickHandler();
        self.addMarkers();
      } // json执行完的回调
    );
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 添加标记图片s
    addMarkers() {
      var cartesian3 = new Cesium.Cartesian3.fromDegrees(
        116.0951,
        28.6308,
        35.591
      );
      var position = new Cesium.Cartesian3.fromDegrees(
        116.0953,
        28.63085,
        62.89
      );
      var position1 = new Cesium.Cartesian3.fromDegrees(
        116.0947,
        28.63095,
        42.89
      );
      var position2 = new Cesium.Cartesian3.fromDegrees(
        116.0947,
        28.63072,
        23.8
      );
      var arr = [];
      arr.push(cartesian3);
      arr.push(position);
      arr.push(position1);
      arr.push(position2);
      arr.forEach(item => {
        this.addImg(item);
      });
    },
    // 添加标记图片
    addImg(cartesian3) {
      var config = {
        name: "marker",
        position: cartesian3,
        image: `${window.location.origin}/images/marker.png`,
        width: 21,
        height: 31
      };
      var entity = drawCore.drawMarkers(config);
      entityArr.push(entity);
    },
    // 显示标记图片
    showMarkers() {
      if (entityArr.length != 0) {
        for (let i in entityArr) {
          entityArr[i].show = true;
        }
      }
    },
    // 隐藏标记图片
    hideMarkers() {
      if (entityArr.length != 0) {
        for (let i in entityArr) {
          entityArr[i].show = false;
        }
      }
    },
    // 添加左键点击事件
    addLeftClickHandler() {
      var handler = d3preview.utils.common.onLeftClick(function(
        pick,
        position
      ) {
        console.log(pick, position, "标记位置");
        // 点击tileset模型
        if (pick && pick.tileset) {
          console.log("杆塔", pick.tileset.id);
          window.viewer.flyTo(pick.tileset, {
            offset: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-25)
              // range: alt
            }
          });
        }
        // 点击entity模型
        if (pick && pick.id) {
          var entity = pick.id;
          window.viewer.flyTo(entity, {
            offset: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-25)
              // range: alt
            }
          });
        }
      });
      handlerArr.push(handler);
    },
    // 移除左键点击事件
    removeLeftClickHandler() {
      if (handlerArr.length != 0) {
        handlerArr.forEach(item => {
          item.destroy();
        });
        handlerArr = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-container {
  height: 100%;

  .operation {
    height: 55px;
    padding: 7px;
  }

  .parent-relative {
    position: relative;
    height: calc(100% - 55px);

    #cesiumContainer {
      height: 100%;
    }
  }
}
</style>
