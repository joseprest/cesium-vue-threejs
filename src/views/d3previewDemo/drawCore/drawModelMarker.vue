<template>
  <div id="drawMarker" class="demo-container">
    <div class="operation">
      <el-button type="primary" plain @click="clickModel">添加标记</el-button>
    </div>
    <div class="parent-relative">
      <div id="cesiumContainer"></div>
    </div>
  </div>
</template>

<script>
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
var drawUtil = new d3preview.utils.DrawUtil();
export default {
  data() {
    return {};
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
    // 给模型添加标记
    clickModel() {
      drawUtil.clickModelDrawTextLabel(function(position) {
        console.log(position, "clickModelDrawTextLabel---position");
      });
      this.message = this.$message({
        showClose: true,
        message: "单击鼠标右键结束",
        duration: 0,
        offset: 140
      });
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
