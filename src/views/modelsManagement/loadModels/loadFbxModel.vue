<template>
  <div
    id="fbxContainer"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
var clock = new THREE.Clock();
var mixer = null;
export default {
  props: {
    modelPath: {
      type: String,
      require: true
    }
  },
  watch: {
    modelPath: {
      // deep: true,  // 深度监听
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.path = newVal;
        document.getElementById("fbxContainer").innerHTML = "";
        this.loading = true;
        this.init();
      }
    }
  },
  data() {
    return {
      loading: true,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      path: this.modelPath,
      loadingText: "拼命加载中"
    };
  },
  mounted() {
    console.log(this.modelPath, "this.modelPath");
    this.init();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  methods: {
    onWindowResize() {
      let container = document.getElementById("fbxContainer");
      console.log(container.offsetWidth, "container", container.offsetHeight);
      // 改变相机的 aspect 为窗口的宽和长度之比
      this.camera.aspect = container.offsetWidth / container.offsetHeight;
      // 更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
      // 重新设置渲染器的大小
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    },
    init() {
      let self = this;

      let container = document.getElementById("fbxContainer");
      self.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.01,
        100000
      );
      self.camera.position.set(600, 1000, 1500);
      self.scene = new THREE.Scene();
      // ground
      var mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      self.scene.add(mesh);

      var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      self.scene.add(grid);

      self.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: "highp"
      });
      self.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(self.renderer.domElement);

      self.controls = new OrbitControls(self.camera, self.renderer.domElement);
      self.controls.target.set(0, 100, 0);
      self.controls.update();
      var light = new THREE.HemisphereLight(0xffffff, 0x444444);
      light.position.set(0, 200, 0);
      self.scene.add(light);

      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 200, 100);
      light.castShadow = true;
      light.shadow.camera.top = 180;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.left = -120;
      light.shadow.camera.right = 120;
      self.scene.add(light);
      let fbxLoader = new FBXLoader();
      fbxLoader.load(
        self.path,
        function(object) {
          if (object.animations[0]) {
            mixer = new THREE.AnimationMixer(object);
            console.log(mixer, "mixer");
            const action = mixer.clipAction(object.animations[0]);
            action.play();
            console.log(action, "action");
            object.traverse(function(child) {
              // console.log(child, "child");
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
          }

          self.scene.add(object);
        },
        this.onProgress,
        this.onError
      );
    },
    //加载进度回调，可以显示进度值
    onProgress(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        if (Math.round(percentComplete, 2) == 100) {
          this.loading = false;
        }
        var text = "加载中..." + Math.round(percentComplete, 2) + "%";
        this.loadingText = text;
        console.log(text);
      }
    },
    //错误回调
    onError(xhr) {
      console.error(xhr, "onError");
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
    }
  },
  beforeDestroy() {
    this.renderer.dispose();
    if (this.controls) {
      this.controls.dispose();
    }
    window.removeEventListener("resize", this.onResize, false);
  }
};
</script>
<style>
#fbxContainer {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
