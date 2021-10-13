<template>
  <div id="modelsManagement">
    <!-- <load-box-model></load-box-model> -->
    <load-fbx-model :modelPath="path"></load-fbx-model>
    <div
      class="w-2/12 h-4/5 fixed top-40 bg-gray-700 bg-opacity-50 overflow-auto"
    >
      <el-tree
        :data="data"
        :props="defaultProps"
        default-expand-all
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
  </div>
</template>

<script>
// import loadBoxModel from "./loadModels/loadBoxModel.vue";
import loadFbxModel from "./loadModels/loadFbxModel.vue";
export default {
  components: {
    // loadBoxModel,
    loadFbxModel
  },
  data() {
    return {
      data: [
        {
          label: "静态模型",
          children: [
            {
              label: "货运支架",
              path: "huoyunzhijia.FBX"
            },
            {
              label: "liaodou",
              path: "liaodou.FBX"
            },
            {
              label: "起重吊装带",
              path: "qizhongdiaozhaungdai.FBX"
            }
          ]
        },
        {
          label: "动态模型",
          children: [
            {
              label: "履带式运输车",
              path: "lvdaishiyunshuche-WLD-10.FBX"
            },
            {
              label: "轮胎式运输车",
              path: "luntaishiyunshuche-WLT-15.FBX"
            },
            {
              label: "水陆两用运输设备",
              path: "shuiluliangyongchuan-WSL-CA-7.FBX"
            },
            {
              label: "沼泽钢轮车",
              path: "zhaozeganglunche-WGL-5.FBX"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      path: ""
    };
  },
  created() {
    this.path = "models/fbx/huoyunzhijia.FBX";
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      if (data.path) {
        this.path = `models/fbx/${data.path}`;
      }
    }
  }
};
</script>

<style lang="scss">
#modelsManagement {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
