# React WebGL OBJ Renderer
A simple `WebGL1.0` + `React` 3D object renderer with various effects, created from scratch with minimal dependency usage. 
The project was designed to fully embrace `WebGL1.0` limits and to work on any device, with mouse and touch-screen support.

![preview](https://github.com/user-attachments/assets/9ee3575f-2cf4-4bc5-92f0-7fb7b9dfeca6)

Preview is available on GitHub Pages: https://moskopio.github.io/react-obj

Three main reasons why this project was created:
* Limits. While professionally working with `WebGL`, one of the projects I worked on started reaching `ThreeJS` limitations in terms of lights, shaders code extensions and caching. My motivation was to explore some of the low-level (light, shadows, shading, `WebGL` program management) and high-level (`React` integration, hook controls, rendering loop) problems in my own personal space as a learning exercise.
* Learning. I wanted to revisit all mathematics and algorithms necessary to build a simple rendering engine, since I haven't had a chance to build one in a while.
* Tools. I wanted to create a tool that would allow me to study how various classical sculptures present themselves in a specific light configuration. This was mostly done for the sake of my other hobby (painting).

Project was implemented purely in `React` and `WebGL`. It is self-contained and includes its own implementations of:
* All necessary mathematics (vectors, matrices, quaternions etc.).
* Rendering implementation with necessary `WebGL GLSL` shaders for various effects (shadings, outlines, soft shadows, point clouds etc).
* Own implementation of `Wavefront Obj` parser (with own normals smoothing and approximation).
* React lifecycle-based `WebGL` rendering loop with non-interruptive state updates.
* `React` UI including all necessary components (panels, sliders, color pickers, `WebGL`-based light preview etc.).
* `React Hooks`-based camera controls (both for mouse and touch-screen with its own implementation for handling touch gestures).
* `React Hooks`-based `WebGL` context handling.


Notes:
- Project was implemented without any AI help or usage at any stage of development.
- Project was created purely in `WebGL 1.0`, with strict minimal extensions usage. I imposed this limitation in order to make sure that it would work properly on various mobile devices without any compatibility issues. As a side effect of this limitation, it doesn't use vertices indexing (e.g. ~32k limit). Some large objects (>200MB) might take some time to load, due to requiring extra parsing around this limitation and generating approximated normals.
- Own `Wavefront Obj` implementation doesn't work properly for `.obj` files that contain negative indices.
- Color Picker component is ugly and requires some redesign. I will reimplement it when I have some spare time.

### Installation:
```
yarn
```

### Running Locally:
```
yarn dev
```

### Acknowledgements
The Stanford Bunny model is courtesy of the Stanford University Computer Graphics Laboratory. The original file can be found at http://graphics.stanford.edu/data/3Dscanrep/ with additional information on the model's venerable history at http://www.cc.gatech.edu/~turk/bunny/bunny.html.
