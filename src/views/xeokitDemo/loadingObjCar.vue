<template>
  <div>
    <canvas id="myCanvas"></canvas>
  </div>
</template>

<script>
import {
  Viewer,
  OBJLoaderPlugin
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
      // Create a Viewer and arrange camera
      //------------------------------------------------------------------------------------------------------------------

      let viewer = new Viewer({
        canvasId: "myCanvas",
        transparent: true
      });
      viewer.camera.orbitPitch(20);

      console.log(viewer, "viewer");

      //------------------------------------------------------------------------------------------------------------------
      // Load OBJ model and fit it to view, then start orbiting the camera
      //------------------------------------------------------------------------------------------------------------------

      let objLoader = new OBJLoaderPlugin(viewer);

      this.model = objLoader.load({
        id: "myModel",
        // src: "/models/sportsCar/sportsCar.obj",
        src: "/models/obj/sportsCar/sportsCar.obj",
        edges: true
      });
      console.log(this.model, "=================model");
      this.model.on("loaded", () => {
        viewer.cameraFlight.jumpTo(this.model);
        viewer.scene.on("tick", () => {
          viewer.camera.orbitYaw(0.4);
        });
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
