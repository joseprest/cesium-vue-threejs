<template>
  <div>
    <div id="parentRelative" style="position: relative;">
      <div id="cesiumContainer">
        <div v-show="picShow" :style="infoStyle" id="popup">
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            fit="cover"
          ></el-image>
        </div>
      </div>
    </div>
    <canvas
      id="canvas"
      style="position: absolute;z-index:1;top: 200;margin: 0 auto; display: block;"
    ></canvas>
    <el-button style="position: absolute;top: 0;" @click="clearAll"
      >清除所有</el-button
    >
    <el-button style="position: absolute;top: 0;left: 110px;" @click="loadAll"
      >加载所有</el-button
    >
    <el-button style="position: absolute;top: 0;left: 210px;" @click="clear"
      >清除缺陷</el-button
    >
    <el-button style="position: absolute;top: 0;left: 310px;" @click="load"
      >加载缺陷</el-button
    >
    <el-button
      style="position: absolute;top: 0;left: 410px;"
      @click="addLeftClickHandler"
      >添加监听</el-button
    >
    <el-button
      style="position: absolute;top: 0;left: 510px;"
      @click="removeLeftClickHandler"
      >移除监听</el-button
    >
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";

var d3preview = window.d3preview;
// console.log(window.d3preview, "------d3preview");
console.log(d3preview, "------d3preview");
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
var handlerArr = [];
var entityArr = [];
var drawCore = new d3preview.utils.DrawCore();
var drawUtil = new d3preview.utils.DrawUtil();
export default {
  data() {
    return {
      picShow: false,
      infoStyle: { position: "absolute", "z-index": "1" },

      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    };
  },
  created() {
    // "baseUrl": "http://192.168.0.140:8180/D3Preview/d3viz",
    D3Preview.init("./lib/config.json", options, "", function() {
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        //判断是否支持图像渲染像素化处理
        console.log("支持");
        window.viewer.resolutionScale = window.devicePixelRatio;
      }
      window.viewer.scene.fxaa = true;
      window.viewer.scene.postProcessStages.fxaa.enabled = true;
    });
  },
  mounted() {
    console.log(window.location.href, "window.location.href");
    this.clickModel();
  },
  destroyed() {},
  methods: {
    /**
     * 把图片处理成圆形,如果不是正方形就按最小边一半为半径处理
     * @param {object} imgObj 图片(img)对象
     * @param {number} imgType 设置生成图片的大小：0设置生成的图片大小是以图片设置的css大小为准，1设置生成的图片大小是以图片分辨率为准，默认值为0
     * @return {string} return base64 png图片字符串
     */
    circle_image_v2(imgSrc, imgType) {
      var img = new Image();
      img.src = imgSrc;
      var type = imgType || 0;
      var radius, diameter, canvas, contex, natural;
      if (type) {
        if (img.width > img.height) {
          radius = img.height / 2;
        } else {
          radius = img.width / 2;
        }
      } else {
        if (img.width > img.height) {
          radius = img.height / 2;
        } else {
          radius = img.width / 2;
        }
        if (img.width > img.height) {
          natural = img.height;
        } else {
          natural = img.width;
        }
      }
      diameter = radius * 2;
      canvas = document.createElement("canvas");
      if (!canvas.getContext) {
        // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
        console.log("您的浏览器版本过低，暂不支持。");
        return false;
      }
      canvas.width = diameter;
      canvas.height = diameter;
      contex = canvas.getContext("2d");
      contex.clearRect(0, 0, diameter, diameter);
      contex.save();
      contex.beginPath();
      contex.arc(radius, radius, radius, 0, Math.PI * 2, false);
      contex.clip();
      if (type) {
        contex.drawImage(
          img,
          0,
          0,
          diameter,
          diameter,
          0,
          0,
          diameter,
          diameter
        );
      } else {
        contex.drawImage(img, 0, 0, natural, natural, 0, 0, diameter, diameter);
      }
      contex.restore();

      var circleImage = new Image();
      circleImage.src = canvas.toDataURL("image/png");
      return canvas;
    },
    addImgs() {
      var cartesian3 = new Cesium.Cartesian3.fromDegrees(
        116.0951,
        28.6308,
        65.591
      );
      var position = new Cesium.Cartesian3.fromDegrees(
        116.0951,
        28.63085,
        62.89
      );
      var position1 = new Cesium.Cartesian3.fromDegrees(
        116.1058861111111,
        28.626580555555556,
        65
      );
      var position2 = new Cesium.Cartesian3.fromDegrees(
        116.39135,
        39.90737,
        80
      );
      var arr = [];
      arr.push(cartesian3);
      arr.push(position);
      arr.push(position1);
      arr.push(position2);
      arr.forEach(item => {
        // this.addImg(item);
        this.addText(item);
      });
      console.log(entityArr);
    },
    addImg(cartesian3) {
      var canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      var ctx = canvas.getContext("2d");
      var pintest = "";
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "http://localhost:8080/images/111.jpg";
      img.onload = function() {
        // 通过arc来绘制一个圆形区域
        ctx.arc(150, 150, 60, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 90, 90, 120, 120);
        pintest = canvas.toDataURL();
        console.log(pintest, "image--------pintest");
        var config = {
          // id: "testImg",
          position: cartesian3,
          image: pintest,
          name: "location",
          width: 200,
          height: 200,
          pixelOffset: new Cesium.Cartesian2(-9, -25),
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 2000, 0.5)
          // onGround: true
        };
        var entity = drawCore.drawMarkers(config);
        entityArr.push(entity);
      };
    },
    addText(cartesian3) {
      // var cartesian3 = new Cesium.Cartesian3.fromDegrees(113.16, 27.635, 120);
      var options = {
        // id: "text",
        position: cartesian3,
        point: {
          color: "#409EFF",
          // outlineColor: "#fff",
          pixelSize: 40
        },
        label: {
          text: "24"
          // fillColor: "#fff"
        }
      };
      var entity = drawCore.drawPointTextLabel(options);
      entityArr.push(entity);
    },
    clearAll() {
      D3Preview.removeAll();
    },
    loadAll() {
      D3Preview.showServiceLoad();
      // this.addImg();
      // this.addText();
    },
    clear() {
      // window.viewer.entities.removeById("testImg");
      // window.viewer.entities.removeById("text");
      if (entityArr.length != 0) {
        for (let i in entityArr) {
          window.viewer.entities.remove(entityArr[i]);
        }
        entityArr = [];
      }
    },
    load() {
      // this.addImg();
      // this.addText();
      this.addLeftClickHandler();
      this.addImgs();
    },
    addLeftClickHandler() {
      // var self = this;
      var handler = d3preview.utils.common.onLeftClick(function(
        pick,
        position
      ) {
        console.log(pick, position, "标记位置");

        // // 测试更改点云模型顶部图片及文字
        // if (pick.tileset) {
        //   console.log("杆塔", pick.tileset.id);
        //   var markerEntity = window.viewer.entities.getById(pick.tileset.id);
        //   markerEntity._billboard._image._value =
        //     "http://localhost:8080/images/tower-top-on.png";
        //   markerEntity._label._fillColor._value = Cesium.Color.fromCssColorString(
        //     "#35d9a1"
        //   );
        // }

        if (pick && pick.id) {
          var entity = pick.id;
          window.viewer.flyTo(entity, {
            offset: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-25)
              // range: alt
            }
          });
        }

        // var labelEntity = pick.id;
        // drawCore.changeTextColor(labelEntity, "#0000FF");
        // if (pick && pick.id && pick.id._name == "location" && position) {
        //   self.picShow = true;
        // } else {
        //   self.picShow = false;
        // }
        // d3preview.utils.common.htmlFixed("popup", position, -50, -120);
      });
      handlerArr.push(handler);
    },
    removeLeftClickHandler() {
      if (handlerArr.length != 0) {
        handlerArr.forEach(item => {
          item.destroy();
        });
        handlerArr = [];
      }
    },
    clickModel() {
      // 给模型添加标记
      drawUtil.clickModelDrawTextLabel(function(position) {
        console.log(position, "clickModelDrawTextLabel---position");
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
