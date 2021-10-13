<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null
    };
  },
  mounted() {
    this.init();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  beforeDestroy() {
    this.renderer.dispose();

    if (this.controls) {
      this.controls.dispose();
    }

    this.$el.removeEventListener("mousedown", this.onMouseDown, false);
    this.$el.removeEventListener("mousemove", this.onMouseMove, false);
    this.$el.removeEventListener("mouseup", this.onMouseUp, false);
    this.$el.removeEventListener("click", this.onClick, false);

    window.removeEventListener("resize", this.onResize, false);
  },
  methods: {
    onWindowResize() {
      let container = document.getElementById("container");
      console.log(container.offsetWidth, "container", container.offsetHeight);
      // 改变相机的 aspect 为窗口的宽和长度之比
      this.camera.aspect = container.offsetWidth / container.offsetHeight;
      // 更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
      // 重新设置渲染器的大小
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    },
    //初始化
    init: function() {
      //  创建场景对象Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);

      //网格模型添加到场景中
      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      let material = new THREE.MeshNormalMaterial({
        color: "white"
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      /**
       * 相机设置
       */
      let container = document.getElementById("container");
      this.camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10
      );
      this.camera.position.z = 1;

      /**
       * 创建渲染器对象
       */
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      //创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },

    // 动画
    animate: function() {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<style lang="scss">
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
