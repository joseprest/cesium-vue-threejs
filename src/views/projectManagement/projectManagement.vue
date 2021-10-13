<template>
  <div style="margin: 20px">
    <div class="filterContainer">
      <div>
        <el-button @click="newProject">新增</el-button>
        <el-button @click="deleteProject">删除</el-button>
      </div>
      <div>
        工程名称：
        <el-input
          placeholder="请输入内容"
          v-model="inputName"
          style="width: 200px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column
        fixed
        type="index"
        label="序号"
        align="center"
        width="60"
      >
      </el-table-column>
      <el-table-column prop="projectName" label="工程名称" align="center">
        <template slot-scope="scope">
          <el-button @click="handleProjectClick(scope.row)" type="text">
            {{ scope.row.projectName }}
          </el-button>
          <!-- <router-link
            :to="'/projectManagement/projectDetail/' + scope.row.id"
            class="link-type"
          >
            <el-button type="text">
              {{ scope.row.projectName }}
            </el-button>
          </router-link> -->
        </template>
      </el-table-column>
      <el-table-column prop="imageData" label="影像数据" align="center">
        <template slot-scope="scope">
          <i
            v-show="scope.row.imageData"
            class="el-icon-circle-check i-style"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="elevationData" label="高程数据" align="center">
        <template slot-scope="scope">
          <i
            v-show="scope.row.elevationData"
            class="el-icon-circle-check i-style"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="obliquePhotographicData"
        label="倾斜摄影数据"
        align="center"
      >
        <template slot-scope="scope">
          <i
            v-show="scope.row.obliquePhotographicData"
            class="el-icon-circle-check i-style"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="thematicData" label="专题数据" align="center">
        <template slot-scope="scope">
          <i
            v-show="scope.row.thematicData"
            class="el-icon-circle-check i-style"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="documentation" label="文档资料" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.documentation"
            @click="handleClick(scope.row)"
            type="text"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text"
            >查看</el-button
          >
          <el-button type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputName: "",
      tableData: [
        {
          id: "1f3188e7-f2ba-4bee-80ff-cbfa4ef1ae12",
          projectName: "500kV南章Ⅰ线",
          imageData: true,
          elevationData: true,
          obliquePhotographicData: true,
          thematicData: true,
          documentation: "",
          createTime: "2021-7-26 15:10"
        }
      ]
    };
  },
  mounted() {
    // this.getLoginInfo();
  },
  methods: {
    async getLoginInfo() {
      this.$api.user
        .getLoginInfoAPI({
          username: "admin",
          password: "123456",
          verifyToken: "",
          code: ""
        })
        .then(function(response) {
          console.log(response, "-------response");
        })
        .catch(function(error) {
          console.log(error, "-------error");
        });
    },
    handleClick(row) {
      console.log(row);
    },
    handleProjectClick(row) {
      console.log(row);

      // 当前页面打开
      // this.$router.push({ path: "/projectDetail/" + row.id });

      // 新页面打开
      let routeUrl = this.$router.resolve({
        path: "/projectDetail",
        query: { sid: row.id }
      });
      window.open(routeUrl.href, "_blank");
    },
    newProject() {},
    deleteProject() {}
  }
};
</script>

<style lang="scss" scoped>
.filterContainer {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}
.i-style {
  font-size: 22px;
  color: #67c23a;
}
</style>
