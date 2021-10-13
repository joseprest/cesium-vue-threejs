<template>
  <div id="flyRoming" class="demo-container">
    <div class="operation">
      <el-button type="primary" plain @click="drawLine">绘制航线</el-button>
      <el-button type="primary" plain @click="startRomingFLy"
        >启动漫游</el-button
      >
      <el-button type="primary" plain @click="phaseFly">暂停</el-button>
      <el-button type="primary" plain @click="restartFly">恢复</el-button>
      <el-button type="primary" plain @click="stopRomingFLy"
        >停止漫游</el-button
      >
      <el-button type="primary" plain @click="clearDrawLine"
        >清除航线</el-button
      >
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
var flyRomingUtil = new d3preview.utils.FlyRomingUtil();
const options = {};
var lineDatas = [];
lineDatas = [
  {
    text: "2",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631026730000000,116.094724610000000,37.14"
  },
  {
    text: "3",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631225410000000,116.094811980000000,50.64"
  },
  {
    text: "4",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631163190000000,116.094816140000000,44.29"
  },
  {
    text: "5",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631159520000000,116.094849580000000,45.06"
  },
  {
    text: "6",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631151340000000,116.094886870000000,46.25"
  },
  {
    text: "7",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631103610000000,116.094810610000000,44.22"
  },
  {
    text: "8",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631103050000000,116.094847460000000,44.59"
  },
  {
    text: "9",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631099100000000,116.094881460000000,45.32"
  },
  {
    text: "10",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631046080000000,116.094796670000000,43.81"
  },
  {
    text: "11",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631044610000000,116.094832290000000,43.97"
  },
  {
    text: "12",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631043990000000,116.094870190000000,44.07"
  },
  {
    text: "13",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630922930000000,116.094781670000000,44.29"
  },
  {
    text: "14",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630918800000000,116.094821260000000,45.58"
  },
  {
    text: "15",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630916020000000,116.094850470000000,46.26"
  },
  {
    text: "16",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630862860000000,116.094772580000000,44.2"
  },
  {
    text: "17",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630860670000000,116.094807440000000,44.84"
  },
  {
    text: "18",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630857250000000,116.094842440000000,45.29"
  },
  {
    text: "19",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630801770000000,116.094764890000000,44.24"
  },
  {
    text: "20",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630804230000000,116.094808200000000,44.3"
  },
  {
    text: "21",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630803550000000,116.094841280000000,44.79"
  },
  {
    text: "22",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630741340000000,116.094755390000000,51.38"
  },
  {
    text: "23",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630741340000000,116.094755390000000,57.5"
  },
  {
    text: "1",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631080840000000,116.096075020000000,84.2"
  },
  {
    text: "2",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631081650000000,116.096082980000000,79.26"
  },
  {
    text: "3",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631062080000000,116.096134610000000,33.25"
  },
  {
    text: "4",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631010640000000,116.096187850000000,29.02"
  },
  {
    text: "5",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631025290000000,116.096040960000000,41.88"
  },
  {
    text: "6",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631019850000000,116.096077530000000,41.77"
  },
  {
    text: "7",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631015170000000,116.096112700000000,41.95"
  },
  {
    text: "8",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631022320000000,116.096159540000000,38.24"
  },
  {
    text: "9",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631021390000000,116.096158920000000,40.13"
  },
  {
    text: "10",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631019930000000,116.096159950000000,42.06"
  },
  {
    text: "11",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630994850000000,116.096189930000000,42.01"
  },
  {
    text: "12",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630980780000000,116.096222370000000,41.93"
  },
  {
    text: "13",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630965830000000,116.096253960000000,41.95"
  },
  {
    text: "14",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631040130000000,116.096061230000000,52.55"
  },
  {
    text: "15",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631036240000000,116.096093040000000,52.87"
  },
  {
    text: "16",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631029080000000,116.096134260000000,53.48"
  },
  {
    text: "17",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631024110000000,116.096160360000000,49.52"
  },
  {
    text: "18",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631022640000000,116.096160460000000,51.81"
  },
  {
    text: "19",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631022140000000,116.096159780000000,53.53"
  },
  {
    text: "20",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631013580000000,116.096188700000000,53.51"
  },
  {
    text: "21",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630998620000000,116.096223500000000,53.41"
  },
  {
    text: "22",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630986280000000,116.096254430000000,53.63"
  },
  {
    text: "23",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630993870000000,116.096059690000000,63.79"
  },
  {
    text: "24",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630992410000000,116.096088690000000,64.46"
  },
  {
    text: "25",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631002620000000,116.096136490000000,65.5"
  },
  {
    text: "26",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631000530000000,116.096152280000000,61.52"
  },
  {
    text: "27",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630999770000000,116.096151650000000,63.49"
  },
  {
    text: "28",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630999130000000,116.096151410000000,65.43"
  },
  {
    text: "29",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630990690000000,116.096164550000000,65.7"
  },
  {
    text: "30",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630964950000000,116.096196030000000,65.41"
  },
  {
    text: "31",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.630947750000000,116.096232810000000,65.38"
  },
  {
    text: "32",
    color: "red",
    outlineColor: "#e8aeb1",
    blha: "28.631024460000000,116.096159600000000,72.61"
  }
];
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
    drawLine() {
      flyRomingUtil.drawLine(lineDatas);
    },
    startRomingFLy() {
      flyRomingUtil.startRomingFLy(lineDatas, 1);
    },
    phaseFly() {
      flyRomingUtil.phaseFly();
    },
    restartFly() {
      flyRomingUtil.restartFly(2);
    },
    stopRomingFLy() {
      flyRomingUtil.stopRomingFLy();
    },
    clearDrawLine() {
      flyRomingUtil.clearDrawLine();
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
