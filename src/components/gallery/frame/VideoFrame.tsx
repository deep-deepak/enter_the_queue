import { useRef, useState } from "react"

import * as THREE from "three";
import { easing } from 'maath'
import { useFrame } from "@react-three/fiber"
import { Html, useCursor } from "@react-three/drei"
import Details from "../assets/Details";

const VideoFrame = ({
    goldenRatio = 90,
    currentObject = false,
    useOpen,
    logo = false,
    ...props
}: any) => {
    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.src = props.image;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.muted = true;
        vid.play();
        return vid;
    });

    const videoRef: any = useRef()
    const frame: any = useRef()
    const [hovered, hover] = useState(false)

    useCursor(hovered)
    useFrame((state, dt) => {
        easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt, 5)
    })

    return (

        <group
            position={props.position}
            rotation={props.rotation}
        >
            <mesh
                name={props.id}
                userData={props.id ? props : {}}
                onPointerOver={(e) => (e.stopPropagation(), hover(true))}
                onPointerOut={() => hover(false)}
                scale={props?.meshScale || [logo ? 50 : 120, goldenRatio, 1]}
               //  position={[0, goldenRatio / 2, 0]}
		
                rotation={[0, 0, 0]} position={[0, 0, 1.1]}
            >
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <meshStandardMaterial ref={videoRef} emissive={"white"} side={THREE.DoubleSide}>
                    <videoTexture attach="map" args={[video]} />
                    <videoTexture attach="emissiveMap" args={[video]} />
                </meshStandardMaterial>
            </mesh>
            {
                props?.id && currentObject?.id === props?.id && (
                    <Html>
                        <Details useOpen={useOpen} {...props} />
                    </Html>
                )
            }
        </group>
    )
}

export default VideoFrame;
