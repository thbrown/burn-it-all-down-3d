"use strict";

// Margin to prevent texture bleeding on the edges

/*
const M = .01;

// Adjust the UV coordinates for the water texture
const TEX_WATER = [
  0 + M, 0 + M,       // (0, 0) -> (M, M)
  0 + M, 1 - M,       // (0, 1) -> (M, 1 - M)
  0.25 - M, 0 + M,    // (0.25, 0) -> (0.25 - M, M)
  0 + M, 1 - M,       // (0, 1) -> (M, 1 - M)
  0.25 - M, 1 - M,    // (0.25, 1) -> (0.25 - M, 1 - M)
  0.25 - M, 0 + M     // (0.25, 0) -> (0.25 - M, M)
];

// Adjust the UV coordinates for the tree texture
const TEX_TREE = [
  0.25 + M, 0 + M,    // (0.25, 0) -> (0.25 + M, M)
  0.5 - M, 0 + M,     // (0.5, 0) -> (0.5 - M, M)
  0.25 + M, 1 - M,    // (0.25, 1) -> (0.25 + M, 1 - M)
  0.25 + M, 1 - M,    // (0.25, 1) -> (0.25 + M, 1 - M)
  0.5 - M, 0 + M,     // (0.5, 0) -> (0.5 - M, M)
  0.5 - M, 1 - M      // (0.5, 1) -> (0.5 - M, 1 - M)
];

// Adjust the UV coordinates for the fire texture
const TEX_FIRE = [
  0.5 + M, 0 + M,     // (0.5, 0) -> (0.5 + M, M)
  0.5 + M, 1 - M,     // (0.5, 1) -> (0.5 + M, 1 - M)
  0.75 - M, 0 + M,    // (0.75, 0) -> (0.75 - M, M)
  0.5 + M, 1 - M,     // (0.5, 1) -> (0.5 + M, 1 - M)
  0.75 - M, 1 - M,    // (0.75, 1) -> (0.75 - M, 1 - M)
  0.75 - M, 0 + M     // (0.75, 0) -> (0.75 - M, M)
];

// Adjust the UV coordinates for the star texture
const TEX_STAR = [
  0.75 + M, 0 + M,    // (0.75, 0) -> (0.75 + M, M)
  1 - M, 0 + M,       // (1, 0) -> (1 - M, M)
  0.75 + M, 1 - M,    // (0.75, 1) -> (0.75 + M, 1 - M)
  0.75 + M, 1 - M,    // (0.75, 1) -> (0.75 + M, 1 - M)
  1 - M, 0 + M,       // (1, 0) -> (1 - M, M)
  1 - M, 1 - M        // (1, 1) -> (1 - M, 1 - M)
];
*/



// TODO: if we are short on space, we can use these coords with some black outlines on the images
//const M = .01;
/*
const TEX_WATER = [0, 0, 0, 1, 0.25, 0, 0, 1, 0.25, 1, 0.25, 0];
const TEX_TREE = [0.25, 0, 0.5, 0, 0.25, 1, 0.25, 1, 0.5, 0, 0.5, 1];
const TEX_FIRE = [0.5, 0, 0.5, 1, 0.75, 0, 0.5, 1, 0.75, 1, 0.75, 0];
const TEX_STAR = [0.75, 0, 1, 0, 0.75, 1, 0.75, 1, 1, 0, 1, 1];
*/

const TEX_WATER = [0, 0, 0.25, 0, 0, 1, 0, 1, 0.25, 0, 0.25, 1];
const TEX_TREE = [0.25, 0, 0.5, 0, 0.25, 1, 0.25, 1, 0.5, 0, 0.5, 1];
const TEX_FIRE =  [0.5, 0, 0.75, 0, 0.5, 1, 0.5, 1, 0.75, 0, 0.75, 1];
const TEX_STAR =  [0.75, 0, 1, 0, 0.75, 1, 0.75, 1, 1, 0, 1, 1];

const TEX_WATER_I = [0, 0, 0.25, 0, 0, 1, 0.25, 0, 0.25, 1, 0, 1];
const TEX_TREE_I = [0.25, 0, 0.5, 0, 0.25, 1, 0.5, 0, 0.5, 1, 0.25, 1];
const TEX_FIRE_I = [0.5, 0, 0.75, 0, 0.5, 1, 0.75, 0, 0.75, 1, 0.5, 1];
const TEX_STAR_I = [0.75, 0, 1, 0, 0.75, 1, 1, 0, 1, 1, 0.75, 1];

const MAX = 3;

const INITIAL_FACE_COLORS = randStart(6);// [0, 0, 1, 0, 0, 0];

function randStart(num) {
  const data = [];
  for(let i = 0; i < num; i++) {
    data.push(Math.floor(Math.random() * MAX));
  }
  return data;
}

function main() {
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Mouse Stuff
  let mouseX = -1;
  let mouseY = -1;
  let colorAtMouse = -1;
  let drag = false;
  let cumulativeMovement = 0;

  // State
  let faceState = INITIAL_FACE_COLORS;

  // Model
  var fieldOfViewRadians = degToRad(60);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  gl.canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if(drag) {
      cumulativeMovement += Math.abs(e.movementX) + Math.abs(e.movementY);
      modelYRotationRadians += (e.movementX / 100);
      modelXRotationRadians += (e.movementY / 100);
    }
  });

  gl.canvas.addEventListener("mousedown", (e) => {
    drag = true;
    cumulativeMovement = 0;
  });

  gl.canvas.addEventListener("mouseup", (e) => {
    drag = false;
  });

  /*
  const MAX = 4;
  gl.canvas.addEventListener("click", (e) => {
    if(cumulativeMovement > 10) {
      return;
    }
    cumulativeMovement = 0;
    switch(colorAtMouse) {
      case 1:
        faceState[0] = (faceState[0] + 1) % MAX;
        break;
      case 2:
        faceState[1] = (faceState[1] + 1) % MAX;
        break;
      case 3:
        faceState[2] = (faceState[2] + 1) % MAX;
        break;
      case 4:
        faceState[3] = (faceState[3] + 1) % MAX;
        break;
      case 5:
        faceState[4] = (faceState[4] + 1) % MAX;
        break;
      case 6:
        faceState[5] = (faceState[5] + 1) % MAX;
        break;
      case 0:
      case -1:
        break;
      default:
        console.log("Unknown color", colorAtMouse);
    }
    updateTexture();
    setTimeout(checkWin, 100);
  });
  */

  gl.canvas.addEventListener("click", (e) => {
    if (cumulativeMovement > 10) {
      return;
    }
    cumulativeMovement = 0;
  
    const updateFaces = (indices) => {
      indices.forEach(index => {
        faceState[index] = (faceState[index] + 1) % MAX;
      });
    };

    /*

    // +1 sometimes
      // 0 - back [0, 4, 2, 5, 3]
      ...getTextureTile(faceTextures[0], true),
      // 1 - front [1, 4, 2, 5, 3]
      ...getTextureTile(faceTextures[1]),
      // 2 - top [2, 4, 5, 0 , 1]
      ...getTextureTile(faceTextures[2], true),
      // 3 - bottom [3, 4, 5, 0, 1]
      ...getTextureTile(faceTextures[3]),
      // 4 - left [4, 2, 3, 0, 1]
      ...getTextureTile(faceTextures[4], true),
      // 5 - right [5, 2, 3, 0, 1]
    */
      console.log("colorAtMouse", colorAtMouse);

    switch (colorAtMouse) {
      case 1:
        updateFaces([0, 4, 2, 5, 3]);
        break;
      case 2:
        updateFaces([1, 4, 2, 5, 3]);
        break;
      case 3:
        updateFaces([2, 4, 5, 0, 1]);
        break;
      case 4:
        updateFaces([3, 4, 5, 0, 1]);
        break;
      case 5:
        updateFaces([4, 2, 3, 0, 1]);
        break;
      case 6:
        updateFaces([5, 2, 3, 0, 1]);
        break;
      case -1:
        // Do nothing
        break;
        default:
          console.log("Unknown color", colorAtMouse);
      }
      updateTexture();
      setTimeout(checkWin, 100);
    });

  // Get the canvas and context
  const canvas2D = document.getElementById("canvas-2d");
  const context = canvas2D.getContext("2d");

  // Define background colors
  const backgroundColors = ["blue", "green", "red", "yellow"];

  // Need to set canvas size too if this is modified
  const squareDim = 2048;

  // Pre-fill the canvas with background colors
  backgroundColors.forEach((color, index) => {
    context.fillStyle = color;
    context.fillRect(index * squareDim, 0, squareDim, squareDim);
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.strokeRect(index * squareDim, 0, squareDim, squareDim);
  });

  // Get the SVG elements
  const svgs = document.querySelectorAll("svg");

  // Async function to draw an SVG to canvas
  async function drawSVGToCanvas(svg, x, y) {
    return new Promise((resolve, reject) => {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = function () {
        try {
          const scaledWidth = (squareDim / 48) * 16;
          const scaledHeight = (squareDim / 48) * 20;
          const offsetX = Math.round(x + squareDim / 2 - scaledWidth / 2);
          const offsetY = Math.round(y + squareDim / 2 - scaledHeight / 2);
          context.drawImage(
            img,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = function (error) {
        reject(error);
      };
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    });
  }

  const WIN_VALUE = 2;
  function checkWin() {
    let win = true;
    for (let i = 0; i < faceState.length; i++) {
      if (faceState[i] !== WIN_VALUE) {
        win = false;
        break;
      }
    }
    if (win) {
      alert("toy story");
    }
  }

  async function updateTexture() {
    console.log("Changing texture...", faceState);
    try {
      setTexcoords(gl, faceState);
      console.log("Texture changed successfully!");
    } catch (error) {
      console.error("Error updating texture:", error);
    }
  }

  async function loadImages() {
    console.log(svgs);
    const promises = Array.from(svgs).map((svg, index) =>
      drawSVGToCanvas(svg, index * squareDim, 0)
    );

    try {
      await Promise.all(promises);
      console.log("All SVGs drawn to canvas successfully!");
    } catch (error) {
      console.error("Error drawing SVGs to canvas:", error);
    }

    const image = await convertCanvasToImage();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Check if the image is a power of 2 in both dimensions.
    if (true && isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }
  loadImages();

  // Picker init ===============================================================================
  const pickingProgram = webglUtils.createProgramFromScripts(gl, [
    "pick-vertex-shader",
    "pick-fragment-shader",
  ]);

  var positionLocation_p = gl.getAttribLocation(pickingProgram, "a_position");
  var pickingColorLocation_p = gl.getAttribLocation(pickingProgram, "a_picking_color");

  var matrixLocation_p = gl.getUniformLocation(pickingProgram, "u_matrix");

  var pickingColorBuffer_p = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pickingColorBuffer_p);
  setPickingColor(gl);

  var positionBuffer_p = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_p);
  setGeometry(gl);

  // Display init ===============================================================================
  var displayProgram = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  var positionLocation = gl.getAttribLocation(displayProgram, "a_position");
  var texcoordLocation = gl.getAttribLocation(displayProgram, "a_texcoord");

  var matrixLocation = gl.getUniformLocation(displayProgram, "u_matrix");
  var textureLocation = gl.getUniformLocation(displayProgram, "u_texture");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl, INITIAL_FACE_COLORS);

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0]));

  function convertCanvasToImage() {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function () {
        try {
          resolve(image);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = function (error) {
        reject(error);
      };
      image.src = canvas2D.toDataURL("image/png");
    });
  }

  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }


  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera setup ========================================================

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    let cameraMatrix = m4.lookAt([0, 0, 2], [0, 0, 0], [0, 1, 0]);
    let viewMatrix = m4.inverse(cameraMatrix);
    let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    let matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    // Picking program ========================================================

    gl.useProgram(pickingProgram);

    gl.enableVertexAttribArray(positionLocation_p);
    gl.enableVertexAttribArray(pickingColorLocation_p);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_p);
    gl.vertexAttribPointer(positionLocation_p, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pickingColorBuffer_p);
    gl.vertexAttribPointer(pickingColorLocation_p, 1, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(matrixLocation_p, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    // Get color at mouse position ============================================

    const pixelX = (mouseX * gl.canvas.width) / gl.canvas.clientWidth;
    const pixelY =
      gl.canvas.height -
      (mouseY * gl.canvas.height) / gl.canvas.clientHeight -
      1;
    const data = new Uint8Array(4);
    gl.readPixels(
      pixelX, // x
      pixelY, // y
      1, // width
      1, // height
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      data
    ); // typed array to hold result
    const id = data[0]; // From the red channel only
    colorAtMouse = id;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Display program ========================================================
    
    gl.useProgram(displayProgram);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniform1i(textureLocation, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
    
    requestAnimationFrame(drawScene);
  }
}

// Fill the buffer with the values that define a cube.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,

    -0.5, -0.5,   0.5,
     0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
    -0.5,  0.5,   0.5,
     0.5, -0.5,   0.5,
     0.5,  0.5,   0.5,

    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,

    -0.5,  -0.5, -0.5,
     0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
     0.5,  -0.5, -0.5,
     0.5,  -0.5,  0.5,

    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,

     0.5,  -0.5, -0.5,
     0.5,   0.5, -0.5,
     0.5,  -0.5,  0.5,
     0.5,  -0.5,  0.5,
     0.5,   0.5, -0.5,
     0.5,   0.5,  0.5,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates the cube.
function setTexcoords(gl, faceTextures) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 0 - back [0, 4, 2, 5, 3]
      ...getTextureTile(faceTextures[0], true),
      // 1 - front [1, 4, 2, 5, 3]
      ...getTextureTile(faceTextures[1]),
      // 2 - top [2, 4, 5, 0 , 1]
      ...getTextureTile(faceTextures[2], true),
      // 3 - bottom [3, 4, 5, 0, 1]
      ...getTextureTile(faceTextures[3]),
      // 4 - left [4, 2, 3, 0, 1]
      ...getTextureTile(faceTextures[4], true),
      // 5 - right [5, 2, 3, 0, 1]
      ...getTextureTile(faceTextures[5]),
    ]),
    gl.STATIC_DRAW
  );
}

function getTextureTile(index, invert = false) {
  console.log("getTex", index, invert)
  if (index === 0) {
    return invert ? TEX_WATER_I : TEX_WATER;
  } else if (index === 1) {
    return invert ? TEX_TREE_I : TEX_TREE;
  } else if (index === 2) {
    return invert ? TEX_FIRE_I : TEX_FIRE;
  } else if (index === 3) {
    return invert ? TEX_STAR_I : TEX_STAR;
  } else {
    console.warn("Invalid texture index:", index);
    return null;
  }
}

function setPickingColor(gl) {
  // Replace with actual integer IDs you want to use
  var ids = [1, 2, 3, 4, 5, 6];

  // Map the integer IDs to the range [0, 1]
  var mappedIds = ids.map(id => id / 255);

  // Create a new array where each ID is repeated 6 times
  var repeatedMappedIds = [];
  mappedIds.forEach(id => {
    for (var i = 0; i < 6; i++) {
      repeatedMappedIds.push(id);
    }
  });

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(repeatedMappedIds),
    gl.STATIC_DRAW
  );
}

main();
