<template>
  <div id="project-menu">
    <el-header>
      <div class="title">三维展现演示平台</div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/projectManagement">项目管理</el-menu-item>
        <el-menu-item index="/modelsManagement">模型管理</el-menu-item>
        <el-menu-item index="/xeokitIndex">xeokit-sdk示例</el-menu-item>
        <!-- <el-menu-item>
          <a
            href="http://earthsdk.com/v/last/Apps/Examples/?menu=true&url=./earthui-fromJSON.html"
            target="_blank"
            >CesiumLab
          </a>
        </el-menu-item> -->
        <el-menu-item index="/d3previewIndex">d3preview示例</el-menu-item>
        <el-menu-item index="/ue4Player">ue4像素流送</el-menu-item>
      </el-menu>
    </el-header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  background-color: #545c64;
  color: #fff;
  font-size: 16px;
  line-height: 60px;
  padding: 0 40px 0 20px;
  word-break: keep-all;
}
#project-menu .el-menu.el-menu--horizontal {
  border-bottom: none;
}
#project-menu > .el-header {
  // line-height: 60px;
  padding: 0;
  display: flex;
}
#project-menu .el-menu-demo {
  width: 100%;
}
#project-menu .main {
  background-color: #f3f3f3;
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
}
</style>
