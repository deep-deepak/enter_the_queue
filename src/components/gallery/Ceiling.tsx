import * as THREE from 'three';
import { useLoader, Vector3Props } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

interface CeilingProps {
    image: string;
    fileType: "image" | "gltf" | "glb";
    position: any;
    rotation: any,
    meshBasicMaterialProps?: undefined | any;
    boxBufferGeometryProps?: undefined | any;
    color: string;
}

function Ceiling({
    image = "/Texture_Ceil.jpg",
    fileType = "image",
    meshBasicMaterialProps = undefined,
    boxBufferGeometryProps = undefined,
    position = [0, 70, 0],
    rotation = [0, 0, 0],
    args = [300, 2, 300],
    color,
    ...props
}: CeilingProps | any) {
    let texture: any;
    let scene: any;
    // if (fileType === "image") {
    //     texture = useLoader(THREE.TextureLoader, image);
    // } else if (fileType === "gltf") {
    scene = useGLTF(image);
    // }

    // Mesh basic material props
    meshBasicMaterialProps = meshBasicMaterialProps ? meshBasicMaterialProps : {
        map: texture,
        side: THREE.DoubleSide,
        color: color
    }

    // Box buffer geometry props
    boxBufferGeometryProps = boxBufferGeometryProps ? meshBasicMaterialProps : {
        args: args || [[300, 2, 300]]
    }

    return (
        <>
            {
                Array(length).fill(0).map((value, key) => {
                    const rowPosition = position?.[key] || [0, 0, 0];
                    const rowRotation = rotation?.[key] || [0, 0, 0];
                    const rowArgs = boxBufferGeometryProps?.args?.[key] || [300, 2, 300];
                    const meshProps = {
                        position: rowPosition,
                        rotation: rowRotation,
                        ...props
                    }

                    return fileType === "image" ? (
                        <mesh {...meshProps} key={value + key}>
                            <boxBufferGeometry {...boxBufferGeometryProps} args={rowArgs} />
                            <meshBasicMaterial {...meshBasicMaterialProps} />
                        </mesh>
                    ) : (
                        <primitive object={scene} {...meshProps} />
                    )
                })
            }
            {

            }
        </>
    );
}

export default Ceiling