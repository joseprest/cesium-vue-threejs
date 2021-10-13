<template>
  <div>
    <canvas id="myCanvas"></canvas>
    <canvas id="myNavCubeCanvas"></canvas>
    <div id="treeViewContainer"></div>
  </div>
</template>

<script>
import {
  Viewer,
  XKTLoaderPlugin,
  NavCubePlugin,
  TreeViewPlugin
} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

export default {
  name: "loadingObjCar",
  data() {
    return {
      model: "",
      navCube: "",
      treeView: ""
    };
  },
  mounted() {
    this.load();
  },
  destroyed() {
    this.model.destroy();
    this.navCube.destroy();
  },
  methods: {
    load() {
      //------------------------------------------------------------------------------------------------------------------
      // Create a Viewer, arrange the camera, tweak x-ray and highlight materials
      //------------------------------------------------------------------------------------------------------------------

      const viewer = new Viewer({
        canvasId: "myCanvas",
        transparent: true
      });

      viewer.cameraControl.followPointer = true;

      viewer.camera.eye = [-3.933, 2.855, 27.018];
      viewer.camera.look = [4.4, 3.724, 8.899];
      viewer.camera.up = [-0.018, 0.999, 0.039];

      viewer.scene.highlightMaterial.fillAlpha = 0.3;
      viewer.scene.highlightMaterial.edgeColor = [1, 1, 0];

      //------------------------------------------------------------------------------------------------------------------
      // Create a NavCube
      //------------------------------------------------------------------------------------------------------------------

      this.navCube = new NavCubePlugin(viewer, {
        canvasId: "myNavCubeCanvas",
        visible: true,
        size: 250,
        alignment: "bottomRight",
        bottomMargin: 100,
        rightMargin: 10
      });

      //------------------------------------------------------------------------------------------------------------------
      // Create an IFC structure tree view
      //------------------------------------------------------------------------------------------------------------------

      this.treeView = new TreeViewPlugin(viewer, {
        containerElement: document.getElementById("treeViewContainer"),
        autoExpandDepth: 1 // Initially expand the root tree node
      });

      //------------------------------------------------------------------------------------------------------------------
      // Load model and metadata
      //------------------------------------------------------------------------------------------------------------------

      const xktLoader = new XKTLoaderPlugin(viewer);

      this.model = xktLoader.load({
        id: "myModel",
        src: "/models/xkt/v8/ifc/Duplex.ifc.xkt",
        excludeTypes: ["IfcSpace"],
        edges: true
      });

      // const t0 = performance.now();
      // document.getElementById("time").innerHTML = "Loading model...";
      // this.model.on("loaded", function() {
      //   const t1 = performance.now();
      //   document.getElementById("time").innerHTML =
      //     "Model loaded in " +
      //     Math.floor(t1 - t0) / 1000.0 +
      //     " seconds<br>Objects: " +
      //     this.model.numEntities;
      // });

      //------------------------------------------------------------------------------------------------------------------
      // Mouse over Entities to highlight them
      //------------------------------------------------------------------------------------------------------------------

      var lastEntity = null;

      viewer.scene.input.on("mousemove", function(coords) {
        var hit = viewer.scene.pick({
          canvasPos: coords
        });

        if (hit) {
          if (!lastEntity || hit.entity.id !== lastEntity.id) {
            if (lastEntity) {
              lastEntity.highlighted = false;
            }

            lastEntity = hit.entity;
            hit.entity.highlighted = true;
          }
        } else {
          if (lastEntity) {
            lastEntity.highlighted = false;
            lastEntity = null;
          }
        }
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

/* ----------------------------------------------------------------------------------------------------------*/
/* NavCubePlugin */
/* ----------------------------------------------------------------------------------------------------------*/

#myNavCubeCanvas {
  position: absolute;
  width: 250px;
  height: 250px;
  bottom: 50px;
  right: 10px;
  z-index: 200000;
}

/* ----------------------------------------------------------------------------------------------------------*/
/* TreeViewPlugin */
/* ----------------------------------------------------------------------------------------------------------*/

#treeViewContainer {
  pointer-events: all;
  height: 75%;
  overflow-y: scroll;
  overflow-x: auto;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.2);
  color: black;
  top: 80px;
  z-index: 200000;
  float: left;
  left: 0;
  padding-left: 10px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  width: 350px;
}

#treeViewContainer ul {
  list-style: none;
  padding-left: 1.75em;
  pointer-events: none;
}

#treeViewContainer ul li {
  position: relative;
  width: 500px;
  pointer-events: none;
  padding-top: 3px;
  padding-bottom: 3px;
  vertical-align: middle;
}

#treeViewContainer ul li a {
  background-color: #eee;
  border-radius: 50%;
  color: #000;
  display: inline-block;
  height: 1.5em;
  left: -1.5em;
  position: absolute;
  text-align: center;
  text-decoration: none;
  width: 1.5em;
  pointer-events: all;
}

#treeViewContainer ul li a.plus {
  background-color: #ded;
  pointer-events: all;
}

#treeViewContainer ul li a.minus {
  background-color: #eee;
  pointer-events: all;
}

#treeViewContainer ul li a:active {
  top: 1px;
  pointer-events: all;
}

#treeViewContainer ul li span:hover {
  color: white;
  cursor: pointer;
  background: black;
  padding-left: 2px;
  pointer-events: all;
}

#treeViewContainer ul li span {
  display: inline-block;
  width: calc(100% - 50px);
  padding-left: 2px;
  pointer-events: all;
  height: 23px;
}

#treeViewContainer .highlighted-node {
  /* Appearance of node highlighted with TreeViewPlugin#showNode() */
  border: black solid 1px;
  background: yellow;
  color: black;
  padding-left: 1px;
  padding-right: 5px;
  pointer-events: all;
}
</style>
