<template>
  <div id="drawMarker" class="demo-container">
    <div class="operation">
      <el-button type="primary" plain @click="addMarkers">添加标记</el-button>
    </div>
    <div class="parent-relative">
      <div id="cesiumContainer"></div>
      <div class="add-marker-info" v-show="showAddMarkerInfo">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>添加标记</span>
            <el-button
              icon="el-icon-close"
              style="float: right; padding: 3px 0"
              type="text"
              @click="closeAddMarker"
            ></el-button>
          </div>
          <div v-for="(url, index) in urls" :key="index">
            <el-image
              style="width: 21px; height: 31px"
              :src="url"
              fit="fill"
            ></el-image>
          </div>
          <div style="text-align: right">
            <el-button plain @click="closeAddMarker">取消</el-button>
            <el-button type="primary" plain @click="closeAddMarker"
              >确定</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";

var d3preview = window.d3preview;
var D3Preview = new d3preview.D3Preview();
const options = {
  // 可选参数，true为开启，false为关闭
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
    return {
      showAddMarkerInfo: false,
      urls: [`${window.location.origin}/images/marker.png`],
      message: ""
    };
  },
  created() {
    D3Preview.init(
      "./lib/config.json", // 配置文件
      options, // 配置小组件
      "1f3188e7-f2ba-4bee-80ff-cbfa4ef1ae12", // gim模型sid
      "", // imageOption影像配置项
      function() {} // json执行完的回调
    );
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 添加标记图片
    addImg(cartesian3) {
      var config = {
        name: "marker",
        position: cartesian3,
        image: `${window.location.origin}/images/marker.png`,
        width: 21,
        height: 31,
        onGround: true
      };
      var entity = drawCore.drawMarkers(config);
      entityArr.push(entity);
    },
    // 添加标记按钮
    addMarkers() {
      this.message = this.$message({
        showClose: true,
        message: "鼠标左键点击地面添加标记",
        duration: 0,
        offset: 140
      });
      this.showAddMarkerInfo = true;
      var self = this;
      var handler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );
      // 单击鼠标左键画点
      handler.setInputAction(function(movement) {
        var ray = window.viewer.camera.getPickRay(movement.position);
        var cartesian3 = window.viewer.scene.globe.pick(
          ray,
          window.viewer.scene
        );
        self.addImg(cartesian3);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handlerArr.push(handler);
    },
    // 移除左键点击事件
    removeLeftClickHandler() {
      this.$message({
        message: "已关闭鼠标点击添加标记",
        type: "success",
        offset: 140
      });
      if (handlerArr.length != 0) {
        handlerArr.forEach(item => {
          item.destroy();
        });
        handlerArr = [];
      }
    },
    closeAddMarker() {
      this.showAddMarkerInfo = false;
      this.removeLeftClickHandler();
      this.message.close();
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

    .add-marker-info {
      width: 300px;
      position: absolute;
      top: 10px;
      left: 8px;
    }
  }
}
</style>
