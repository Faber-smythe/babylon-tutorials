

        //
        // https://dvic.devinci.fr/first-steps-with-babylon-js
        // ============================ COMPLETE TUTORIAL AT THE ABOVE ADDRESS ============================
        //
        // https://faber-smythe.github.io/babylon-tutorials/
        // ============================ LIVE DEMO AT THE ABOVE ADDRESS ============================

        /* ---------------------------------------------
        *  Step 1 - Canvas, Engine and Scene
        * --------------------------------------------- */

        // > CANVAS

        const canvas = document.getElementById("renderCanvas"); // Get the canvas element

        // > ENGINE

        const engine = new BABYLON.Engine(canvas, true); // Initialize the Babylon 3D engine

        // > SCENE

        const scene = new BABYLON.Scene(engine); // Create a Babylon scene

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            scene.render();
        });

        // Enable Inspector
        scene.debugLayer.show()

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });

        /* ---------------------------------------------
        *  Step 2 - Camera, Light and Mesh
        * --------------------------------------------- */

        // > CAMERA

        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);

        // > LIGHT

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // > MESHES

        // Create a "sun" and "moon" sphere
        const sun = BABYLON.MeshBuilder.CreateSphere("sun", { diameter: 4, segments: 32 }, scene);
        const moon = BABYLON.MeshBuilder.CreateSphere("moon", { diameter: 1, segments: 32 }, scene);

        // Set positions on the x axis
        sun.position.x = -3
        moon.position.x = 3

        /* ---------------------------------------------
        *  Step 3 - Material, Reflection and Texture
        * --------------------------------------------- */

        // > MATERIALS

        // Initialize the new materials
        const sunMaterial = new BABYLON.StandardMaterial('sunMat', scene)
        const moonMaterial = new BABYLON.StandardMaterial('moonMat', scene)

        // Apply the new materials to the spheres
        sun.material = sunMaterial
        moon.material = moonMaterial

        sunMaterial.diffuseColor = new BABYLON.Color3(1, 0.8, 0.4) // Apply a yellowish diffuse color to the sun
        sunMaterial.emissiveColor = new BABYLON.Color3(.8, 0.4, 0.0) // Apply a redish emissive color to the sun

        // > REFLECTION

        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0) // Set the color of the reflection as black
        moonMaterial.specularPower = 0 // Set the sharpness of the reflection to the minimum

        light.direction = new BABYLON.Vector3(-1, 0, 0)

        // > TEXTURES

        sunMaterial.diffuseTexture = new BABYLON.Texture('https://raw.githubusercontent.com/Faber-smythe/storage/main/sun_texture.jpg', scene)
        moonMaterial.diffuseTexture = new BABYLON.Texture('https://raw.githubusercontent.com/Faber-smythe/storage/main/moon_texture.jpg', scene)


        /* ---------------------------------------------
        *  Step 4 - Controls, Inputs and Picking
        * --------------------------------------------- */

        // > CONTROLS

        camera.attachControl(canvas)

        // > INPUTS

        scene.onKeyboardObservable.add((keyboardInfo) => { // Listen to keyboard event
            if (keyboardInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) { // Is the event a pressed key ?
                switch (keyboardInfo.event.key) { // What key is it ?
                    case 's':
                        camera.target = sun.position // set camera orientation towards the sun
                        break;
                    case 'm':
                        camera.target = moon.position // set camera orientation towards the moon
                        break;
                    case 'o':
                        camera.target = new BABYLON.Vector3(0, 0, 0) // set camera orientation towards the origin
                        break;
                    default: break;
                }
            }
        })

        // > PICKING

        // Switch off the light when picking the moon
        moon.actionManager = new BABYLON.ActionManager(scene) // initialize the moon's action manager
        moon.actionManager.registerAction(new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickTrigger, // Tells to interpolate when the mesh is picked
            light, // The target object of the interpolation
            'intensity', // The path of the property we want to change
            0, // The target value this property should interpolate toward
            500 // The duration of the interpolation
        ))

        // Switch the light back on when picking the sun
        sun.actionManager = new BABYLON.ActionManager(scene)
        sun.actionManager.registerAction(new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickDownTrigger,
            light,
            'intensity',
            1,
            500
        ))