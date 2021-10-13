<template>
  <div>
    <canvas id="myCanvas"></canvas>
  </div>
</template>

<script>
import {
  Viewer,
  XKTLoaderPlugin
} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

export default {
  name: "loadingObjCar",
  data() {
    return {
      model: ""
    };
  },
  mounted() {
    this.load();
  },
  destroyed() {
    this.model.destroy();
  },
  methods: {
    load() {
      //------------------------------------------------------------------------------------------------------------------
      // Create a Viewer, arrange the camera
      //------------------------------------------------------------------------------------------------------------------

      const viewer = new Viewer({
        canvasId: "myCanvas",
        transparent: true
      });

      viewer.scene.camera.eye = [-33.39, 19.86, 16.48];
      viewer.scene.camera.look = [8.29, 8.28, 0.31];
      viewer.scene.camera.up = [0.23, 0.96, -0.09];

      viewer.cameraControl.navMode = "orbit";
      viewer.cameraControl.followPointer = true;

      const pivotElement = document
        .createRange()
        .createContextualFragment(
          "<div class='xeokit-camera-pivot-marker'></div>"
        ).firstChild;
      document.body.appendChild(pivotElement);
      viewer.cameraControl.pivotElement = pivotElement;

      //------------------------------------------------------------------------------------------------------------------
      // Configure points material
      //------------------------------------------------------------------------------------------------------------------

      viewer.scene.pointsMaterial.pointSize = 2;
      viewer.scene.pointsMaterial.roundPoints = true;
      viewer.scene.pointsMaterial.perspectivePoints = true;
      viewer.scene.pointsMaterial.minPerspectivePointSize = 2;
      viewer.scene.pointsMaterial.maxPerspectivePointSize = 4;

      //----------------------------------------------------------------------------------------------------------------------
      // Create a xeokit loader plugin, load a model, fit to view
      //----------------------------------------------------------------------------------------------------------------------

      const xktLoader = new XKTLoaderPlugin(viewer);

      this.model = xktLoader.load({
        id: "myModel",
        src: "/models/xkt/v7/MAP-PointCloud/MAP-PointCloud.xkt",
        edges: true
      });

      this.model.on("loaded", () => {
        console.log(this.model.numEntities);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#myCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  background: lightblue;
}
</style>
