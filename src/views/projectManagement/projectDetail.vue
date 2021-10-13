<template>
  <div id="project-detail">
    <!-- <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-submenu index="1">
          <template slot="title">视图</template>
          <el-menu-item index="1-1">模型结构</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">地形管理</template>
          <el-menu-item index="2-1">倾斜摄影</el-menu-item>
          <el-menu-item index="2-2">本地影像</el-menu-item>
          <el-menu-item index="2-3">本地高程</el-menu-item>
          <el-menu-item index="2-4">专题</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">显示设置</template>
          <el-menu-item index="3-1">属性面板</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header> -->
    <div class="main">
      <!-- <cesium-and-three></cesium-and-three> -->
      <show-d3-preview></show-d3-preview>
    </div>
  </div>
</template>

<script>
// import CesiumAndThree from "./CesiumAndThree.vue";
import showD3Preview from "./showD3Preview.vue";

export default {
  components: {
    // CesiumAndThree,
    showD3Preview
  },
  data() {
    return {
      // activeIndex: this.$route.path
    };
  },
  // watch: {
  //   $route(to) {
  //     // 监听路由的变化  如果路由发生改变则当前tab栏默认值也相应改变
  //     this.activeIndex = to.path;
  //   }
  // },
  mounted() {
    console.log(this.$route.path);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
#project-detail > .el-header {
  // line-height: 60px;
  padding: 0;
}
#project-detail .el-menu-demo {
  width: 100%;
}
#project-detail .main {
  background-color: #f3f3f3;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
