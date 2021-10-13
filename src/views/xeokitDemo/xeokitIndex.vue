<template>
  <div id="xeokitIndex">
    <el-container style="height: 100%;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/xeokitIndex/loadingObjCar">
            obj模型
          </el-menu-item>
          <el-menu-item index="/xeokitIndex/loading_XKT_MAP_pointCloud">
            点云模型
          </el-menu-item>
          <el-menu-item index="/xeokitIndex/BIMOffline_XKT_Duplex">
            模型树
          </el-menu-item>
          <el-menu-item
            index="/xeokitIndex/ContextMenu_Canvas_TreeViewPlugin_Custom"
          >
            鼠标右键菜单栏
          </el-menu-item>
          <el-menu-item
            index="/xeokitIndex/performance_ViewCullPlugin_CameraPathAnimation"
          >
            自动漫游
          </el-menu-item>
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
#xeokitIndex {
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
