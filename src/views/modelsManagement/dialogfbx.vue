<template>
  <div>
    <el-dialog
      title="模型预览"
      :visible.sync="modelopen"
      width="60%"
      @open="opendialog"
      class="yzqmodeldialog"
    >
      <div id="fullcontent">
        <div style="display:flex;text-align:right">
          <div style="text-align:right;margin:10px 0" @click="fillwindow">
            <i class="iconfont icon-quanping"></i>
          </div>
        </div>

        <div
          id="container3d"
          v-loading="vloading"
          style="height: 500px;
        width: 100%;position:relative"
          @mousedown="onMouseDown"
          @mouseup="onMouseUp"
        ></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as Three from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      vloading: true,
      modelopen: false,
      modelsrc: "",
      // 三维three.js
      camera: null,
      scene: null,
      renderer: null,
      labelRenderer: null,
      mesh: null,
      light: null,
      mixer: null,
      controls: null,
      length: 200,
      fullscreen: false,

      pointsArray: [],
      window_mouse: true,

      mouseclick: false,
      measurebool: false,
      measuretype: 0,
      objects: [],
      points: [],
      modelmesh: null,
      particleMaterial: null,

      leftmousecdownlocation: null,

      // 缓存所有测量信息
      allpointarr: [],
      alllinearr: [],
      alltextarr: []
    };
  },
  watch: {
    open: {
      handler: function(e) {
        this.modelopen = e;
      }
    },
    modelopen: {
      handler: function(e) {
        console.log(e);
        if (e == false) {
          this.$emit("modelopen", false);
          this.vloading = true;
          document.getElementById("container3d").innerHTML = "";
          this.measurebool = false;
          this.allpointarr = [];
          this.alllinearr = [];
          this.alltextarr = [];
          this.points = [];
          this.pointsArray = [];
          document.getElementById("chiziicon").style.color = "";
          document.getElementById("zhixian").style.opacity = "0";
          document.getElementById("quxian").style.opacity = "0";
          for (let index = 0; index < this.allpointarr.length; index++) {
            this.scene.remove(this.allpointarr[index]);
          }
          for (let index = 0; index < this.alllinearr.length; index++) {
            this.scene.remove(this.alllinearr[index]);
          }
          for (let index = 0; index < this.alltextarr.length; index++) {
            this.scene.remove(this.alltextarr[index]);
          }
        }
      }
    },
    src: {
      handler: function(e) {
        console.log(e);
        this.modelsrc = e;
      }
    }
  },
  mounted() {
    var that = this;
    window.onresize = function() {
      if (that.modelopen == true) {
        console.log("eeeeessssccc");
        document.getElementById("container3d").innerHTML = "";
        setTimeout(function() {
          that.init3d();
        }, 1000);

        setTimeout(function() {
          that.animate3d();
        }, 1000);
        that.fullscreen = !that.fullscreen;
        if (that.fullscreen == true) {
          document.getElementById("container3d").style.height = "94vh";
        } else {
          document.getElementById("container3d").style.height = "500px";
        }
      }
    };
  },

  methods: {
    opendialog() {
      console.log(11111112);
      var _this = this;

      setTimeout(function() {
        _this.init3d();
      }, 1000);
    },
    // 三维three.js
    init3d: function() {
      let container = document.getElementById("container3d");
      console.log(container);

      this.vloading = true;

      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(0xa0a0a0);

      this.light = new Three.HemisphereLight(0xffffff, 0x444444);
      this.light.position.set(0, 200, 0);
      this.scene.add(this.light);

      this.light = new Three.DirectionalLight(0xffffff);
      this.light.position.set(0, 200, 100);
      this.light.castShadow = true;
      this.light.shadow.camera.top = 180;
      this.light.shadow.camera.bottom = -100;
      this.light.shadow.camera.left = -120;
      this.light.shadow.camera.right = 120;
      this.scene.add(this.light);

      var PI2 = Math.PI * 2;
      this.particleMaterial = new Three.SpriteMaterial({
        color: 0xff0000,
        program: function(context) {
          context.beginPath();
          context.arc(0, 0, 0.5, 0, PI2, true);
          context.fill();
        }
      });
      var loader = new FBXLoader();
      // modelsrc为模型路径
      loader.load(this.modelsrc, geometry => {
        console.log(geometry);
        this.scene.add(geometry);
        this.modelmesh = geometry;

        // 相机随着模型的大小初始化位置
        var boxHelper = new Three.BoxHelper();
        this.camera = new Three.PerspectiveCamera(
          70,
          container.clientWidth / container.clientHeight,
          1,
          10000
        );
        boxHelper.setFromObject(geometry);
        var center = boxHelper.geometry.boundingSphere.center;
        var radius = boxHelper.geometry.boundingSphere.radius;
        var cameraPos = new Three.Vector3(
          center.x + geometry.position.x,
          radius * 0.8 + center.y + geometry.position.y,
          radius * 1.5 + center.z + geometry.position.z
        );
        var lookPos = new Three.Vector3(
          center.x + geometry.position.x,
          center.y + geometry.position.y,
          center.z + geometry.position.z
        );
        this.camera.position.copy(cameraPos);

        this.renderer = new Three.WebGLRenderer({ antialias: true });

        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        // 全屏切换的时候如果开着测量模式先初始化
        if (this.measurebool == true) {
          for (let index = 0; index < this.allpointarr.length; index++) {
            this.scene.add(this.allpointarr[index]);
          }
          for (let index = 0; index < this.alllinearr.length; index++) {
            this.scene.add(this.alllinearr[index]);
          }
          for (let index = 0; index < this.alltextarr.length; index++) {
            this.scene.add(this.alltextarr[index]);
          }
        }
        var _this = this;
        setTimeout(function() {
          _this.animate3d();
          _this.vloading = false;
        }, 1000);
      });
    },
    animate3d: function() {
      requestAnimationFrame(this.animate3d);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    },
    onWindowResize() {
      let container = document.getElementById("container3d");
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },
    fillwindow() {
      let element = document.getElementById("fullcontent");
      let content = document.getElementById("container3d");

      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        console.log(element.style.width);
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
    }
  }
};
</script>
<style scoped>
#container3d {
  /* height: 500px;
        width: 100%; */
  /* background: red; */
}
</style>
<style>
.yzqmodeldialog .el-dialog__body {
  padding-top: 0;
}
</style>
