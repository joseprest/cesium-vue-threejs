<template>
  <div id="d3previewIndex">
    <el-container style="height: 100%;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-video-camera-solid"></i>
              <span>加载GIM模型</span>
            </template>
            <el-menu-item index="/d3previewIndex/initGim/initXL">
              加载线路模型
            </el-menu-item>
            <el-menu-item index="/d3previewIndex/initGim/initBD">
              加载变电模型
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>POI</span>
            </template>
            <el-menu-item index="/d3previewIndex/drawCore/drawMarker">
              地面POI标记
            </el-menu-item>
            <el-menu-item index="/d3previewIndex/drawCore/drawModelMarker">
              模型POI标记
            </el-menu-item>
            <el-menu-item index="/d3previewIndex/drawCore/showHideMarkers">
              显示隐藏POI标记
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-promotion"></i>
              <span>漫游</span>
            </template>
            <el-menu-item index="/d3previewIndex/roaming/flyRoaming">
              飞行漫游
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log("open----", key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("close----", key, keyPath);
    }
  }
};
</script>

<style lang="scss">
#d3previewIndex {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-main {
  position: relative;
  padding: 0;
  background: #eef1f6;
  overflow: hidden;
}
</style>
