<template>
  <div id="initBD" class="demo-container">
    <div class="operation">
      <el-button type="primary" plain @click="clearAll">清除所有模型</el-button>
      <el-button type="primary" plain @click="loadAll">重新加载模型</el-button>
    </div>
    <div class="parent-relative">
      <div id="cesiumContainer"></div>
    </div>
  </div>
</template>

<script>
// 引入d3preview
var d3preview = window.d3preview;
var D3Preview = new d3preview.D3Preview();
const options = {
  // 可选参数，true为开启，false为关闭，不传默认全部关闭
  modelPanel: true, // 模型面板
  walkRoaming: true, // 行走漫游
  flyRoaming: true, // 飞行漫游
  annotate: true, // 批注面板
  modelMove: true, // 模型平移
  modelRotate: true, // 模型旋转
  modelSlice: true, // 模型剖切
  geography: true, //地理信息插件
  toolsView: true // 右下方小工具
};
export default {
  data() {
    return {};
  },
  created() {
    D3Preview.init(
      "./lib/config.json", // 配置文件
      options, // 配置小组件
      "577ae89c-6e46-4ac1-9b62-def416d7ace5", // gim模型sid
      "", // imageOption影像配置项
      function() {} // json执行完的回调
    );
  },
  mounted() {},
  destroyed() {},
  methods: {
    clearAll() {
      D3Preview.removeAll();
    },
    loadAll() {
      D3Preview.showServiceLoad();
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
