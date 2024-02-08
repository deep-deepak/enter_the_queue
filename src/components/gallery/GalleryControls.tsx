import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useWindowSize } from 'components/miscellaneous/hooks';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { angleToRadians } from 'utils/gallery';

function GalleryControls(props: any) {
    const { camera, gl, scene } = useThree();
    const window = useWindowSize();
    const ref: any = useRef();
    props = {
        target: [0, 0, 0],
        enableDamping: true,
        args: [camera, gl.domElement],
        enablePan: false,
        enableZoom: false,
        minPolarAngle: Math.PI / 2.2,
        maxPolarAngle: Math.PI / 2.2,
        ...props
    }


    // Code to move the camera around
    // useFrame((state) => {
    //     if (!!ref.current) {
    //         const { x, y } = state.mouse;
    //         ref.current.setAzimuthalAngle(-x * angleToRadians(45));
    //         ref.current.setPolarAngle((y + 1) * angleToRadians(90 - 30));
    //         ref.current.update();
    //     }
    // })

    useEffect(() => {
        function onDocumentKeyDown(event: any) {
            var keyCode = event.which;
            // 87 = W, 83 = S, 65 = A,68 = D,32 = spacebar
            const x = scene.position.x;
            const z = scene.position.z;
            if (keyCode === 87 || keyCode === 38) {
                // if (z < 510) {
                    scene.position.z += 10;
                // }
            } else if (keyCode === 83 || keyCode === 40) {
                // if (z > -20) {
                    scene.position.z -= 10;
                // }
            } else if (keyCode === 68 || keyCode === 39) {
                // if (x > -105) {
                    scene.position.x -= 10;
                // }
            } else if (keyCode === 65 || keyCode === 37) {
                // if (x < 105) {
                    scene.position.x += 10;
                // }
            } else if (keyCode == 32) {
                scene.position.set(0, 0, 0);
            }
        };

        document.addEventListener("keydown", onDocumentKeyDown, false);

        return () => {
            document.removeEventListener("keydown", onDocumentKeyDown, false);
        }
    }, [scene]);


    useFrame(() => {
        // const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // const group = new THREE.Group();
        // scene.add(group);
        // newCamera.position.set(0, 0, 195);
        // newCamera.lookAt(scene.position);
        // scene.add(newCamera);
    });

    return (
        <>
            <OrbitControls ref={ref} {...props} />
        </>
    )
}

export default GalleryControls