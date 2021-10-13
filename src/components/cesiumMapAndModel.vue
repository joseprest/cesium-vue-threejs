<template>
  <div class="mainView">
    <div id="cesiumContainer"></div>
    <div id="ThreeContainer" class="pointEvents"></div>
    <!-- <div class="editBtn">编辑</div> -->
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
export default {
  data() {
    return {};
  },
  mounted() {
    const clock = new THREE.Clock();
    let mixer;

    // 最小坐标
    let minWGS84 = [115.23, 39.55];
    // 最大坐标
    let maxWGS84 = [116.23, 41.55];
    // let cesiumContainer = document.getElementById("cesiumContainer");
    let ThreeContainer = document.getElementById("ThreeContainer");

    let three = {
      renderer: null,
      camera: null,
      scene: null
    };
    let cesium = {
      viewer: null
    };
    // 存储three图形
    let objects = [];
    let _3Dobjects = [];

    function _3DObject() {
      this.threeMesh = null;
      this.minWGS84 = null;
      this.maxWGS84 = null;
    }

    // cesium初始化
    function initCesium() {
      cesium.viewer = new Cesium.Viewer("cesiumContainer", {
        useDefaultRenderLoop: false,
        selectionIndicator: false, // 选择
        geocoder: false, //右上角 搜索
        homeButton: false, //右上角 Home
        sceneModePicker: false, //右上角 2D/3D切换
        baseLayerPicker: false, //右上角 地形
        navigationHelpButton: false, //右上角 帮助信息
        animation: false, // 左下角 圆盘动画控件
        fullscreenButton: false, // 右下角 全屏控件
        vrButton: false, // 如果设置为true，将创建VRButton小部件。
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        infoBox: false, //隐藏点击要素后的提示信息
        timeline: false, //时间轴
        navigationInstructionsInitiallyVisible: false, //导航指令
        allowTextureFilterAnisotropic: false,
        contextOptions: {
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
            anialias: false
          }
        },
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=bd96aab09344f58b621b33a173233e8b",
          layer: "tiandituImgMarker",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "tiandituImgMarker",
          show: true,
          maximumLevel: 18
        }),
        // eslint-disable-next-line no-dupe-keys
        geocoder: false, //地址编码
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: Cesium.ShadowMode.DISABLED
      });
      // 隐藏cesium ion
      cesium.viewer._cesiumWidget._creditContainer.style.display = "none";
      // 开启或关闭地下模式
      cesium.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
      // 设置透明度
      // cesium.viewer.scene.globe.translucency.frontFaceAlpha = 0.8

      let center = Cesium.Cartesian3.fromDegrees(
        (minWGS84[0] + maxWGS84[0]) / 2,
        (minWGS84[1] + maxWGS84[1]) / 2 - 0.04,
        3000
      );
      cesium.viewer.camera.flyTo({
        destination: center, //经度、纬度、高度
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-40),
          roll: Cesium.Math.toRadians(0)
        },
        duration: 8
      });

      // cesium上的红色矩形区域
      //   let entity = {
      //     name: "Polygon",
      //     polygon: {
      //       hierarchy: Cesium.Cartesian3.fromDegreesArray([
      //         minWGS84[0],
      //         minWGS84[1],
      //         maxWGS84[0],
      //         minWGS84[1],
      //         maxWGS84[0],
      //         maxWGS84[1],
      //         minWGS84[0],
      //         maxWGS84[1]
      //       ]),
      //       material: Cesium.Color.RED.withAlpha(0.2)
      //     }
      //   };
      //   cesium.viewer.entities.add(entity);
    }
    // three初始化
    function initThree() {
      let fov = 45;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let aspect = width / height;
      let near = 1;
      let far = 10 * 1000 * 1000; // needs to be far to support Cesium's world-scale rendering
      three.scene = new THREE.Scene();
      three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      three.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      three.renderer.setPixelRatio(window.devicePixelRatio);
      three.renderer.shadowMap.enabled = true;

      let Amlight = new THREE.AmbientLight(0xffffff, 2);
      three.scene.add(Amlight);

      // let axesHelper = new THREE.AxesHelper(3000000000000)
      // three.scene.add(axesHelper)

      ThreeContainer.appendChild(three.renderer.domElement);

      init3DObject(); // Initialize Three.js object mesh with Cesium Cartesian coordinate system
    }
    // 添加three图形
    function init3DObject() {
      // 加载一个obj文件及mtl，展示杆塔
      const towerLoader = new MTLLoader().setPath("models/tower/");
      towerLoader.load("tower.mtl", function(materials) {
        console.log(materials, "-----tower");
        materials.preload();
        const loaderOBJ = new OBJLoader().setPath("models/tower/");
        loaderOBJ.setMaterials(materials);
        loaderOBJ.load(
          "tower.obj",
          function(obj) {
            const scaleSize = 10;
            obj.scale.set(scaleSize, scaleSize, scaleSize);
            obj.rotation.x = Math.PI / 2;
            obj.rotation.y = Math.PI;

            const meshYup = new THREE.Group();
            meshYup.add(obj);
            objects.push(obj);

            three.scene.add(meshYup); // don’t forget to add it to the Three.js scene manually
            // Assign Three.js object mesh to our object array
            const _3DOB = new _3DObject();
            _3DOB.threeMesh = meshYup;
            _3DOB.minWGS84 = minWGS84;
            _3DOB.maxWGS84 = maxWGS84;
            _3Dobjects.push(_3DOB);
          },
          onProgress,
          onError
        );
      });
      // 加载一个FBX动态文件，展示
      const fbxLoader = new FBXLoader();
      fbxLoader.load("models/fbx/lvdaishiyunshuche-WLD-10.FBX", function(
        object
      ) {
        const scaleSize = 1;
        object.scale.set(scaleSize, scaleSize, scaleSize);
        object.position.x -= 1000.0;
        object.rotation.x = Math.PI / 2;

        mixer = new THREE.AnimationMixer(object);

        const action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const meshYup = new THREE.Group();

        let axesHelper = new THREE.AxesHelper(3000000000000);
        meshYup.add(axesHelper);

        meshYup.add(object);
        objects.push(object);

        three.scene.add(meshYup); // don’t forget to add it to the Three.js scene manually
        // Assign Three.js object mesh to our object array
        const _3DOB = new _3DObject();
        _3DOB.threeMesh = meshYup;
        _3DOB.minWGS84 = minWGS84;
        _3DOB.maxWGS84 = maxWGS84;
        _3Dobjects.push(_3DOB);
      });

      //加载进度回调，可以显示进度值
      function onProgress(xhr) {
        if (xhr.lengthComputable) {
          var percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(Math.round(percentComplete, 2) + "% 4---downloaded");
        }
      }
      //错误回调
      function onError(xhr) {
        console.error(xhr, "onError");
      }
    }
    // 渲染cesium
    function renderCesium() {
      cesium.viewer.render();
    }
    // 渲染three
    function renderThreeObj() {
      // console.log(_3Dobjects, "renderThreeObj_3Dobjects")
      var cartToVec = function(cart) {
        return new THREE.Vector3(cart.x, cart.y, cart.z);
      };
      // Configure Three.js meshes to stand against globe center position up direction
      for (const id in _3Dobjects) {
        minWGS84 = _3Dobjects[id].minWGS84;
        maxWGS84 = _3Dobjects[id].maxWGS84;
        // convert lat/long center position to Cartesian3
        var center = Cesium.Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2
        );

        // get forward direction for orienting model
        var centerHigh = Cesium.Cartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2,
          1
        );

        // use direction from bottom left to top left as up-vector
        var bottomLeft = cartToVec(
          Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1])
        );
        var topLeft = cartToVec(
          Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
        );
        var latDir = new THREE.Vector3()
          .subVectors(bottomLeft, topLeft)
          .normalize();

        // configure entity position and orientation
        _3Dobjects[id].threeMesh.position.copy(center);
        _3Dobjects[id].threeMesh.lookAt(
          centerHigh.x,
          centerHigh.y,
          centerHigh.z
        );
        _3Dobjects[id].threeMesh.up.copy(latDir);
      }

      // 调整three相机
      three.camera.fov = Cesium.Math.toDegrees(
        cesium.viewer.camera.frustum.fovy
      ); // ThreeJS FOV is vertical
      // 相机对象与投影矩阵相关的属性发生了变化，相机对象与投影矩阵相关的属性发生了变化，执行camera.updateProjectionMatrix();
      three.camera.updateProjectionMatrix();

      // Clone Cesium Camera projection position so the
      // Three.js Object will appear to be at the same place as above the Cesium Globe
      three.camera.matrixAutoUpdate = false;
      var cvm = cesium.viewer.camera.viewMatrix;
      var civm = cesium.viewer.camera.inverseViewMatrix;

      three.camera.lookAt(0, 0, 0);

      three.camera.matrixWorld.set(
        civm[0],
        civm[4],
        civm[8],
        civm[12],
        civm[1],
        civm[5],
        civm[9],
        civm[13],
        civm[2],
        civm[6],
        civm[10],
        civm[14],
        civm[3],
        civm[7],
        civm[11],
        civm[15]
      );
      three.camera.matrixWorldInverse.set(
        cvm[0],
        cvm[4],
        cvm[8],
        cvm[12],
        cvm[1],
        cvm[5],
        cvm[9],
        cvm[13],
        cvm[2],
        cvm[6],
        cvm[10],
        cvm[14],
        cvm[3],
        cvm[7],
        cvm[11],
        cvm[15]
      );

      var width = ThreeContainer.clientWidth;
      var height = ThreeContainer.clientHeight;
      const aspect = width / height;
      three.camera.aspect = aspect;
      three.camera.updateProjectionMatrix();

      three.renderer.setSize(width, height);
      three.renderer.clear();
      three.renderer.render(three.scene, three.camera);
    }

    function loop() {
      requestAnimationFrame(loop);
      renderCesium(); //渲染cesium
      renderThreeObj(); //渲染three
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
    }

    function main() {
      initCesium();
      initThree();
      loop();
    }

    main();
  },
  methods: {}
};
</script>

<style lang="scss">
.mainView {
  width: 100%;
  height: 100%;
}
body {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
}

#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}

#ThreeContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}

.pointEvents {
  pointer-events: none;
}

.editBtn {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #fff;
  color: #000;
  cursor: pointer;
}
.editBtn:hover {
  background-color: lightslategrey;
}
</style>
