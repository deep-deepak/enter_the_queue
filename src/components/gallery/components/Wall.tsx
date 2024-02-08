import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Wall({
    mapUrl = "/Texture_Wall.jpg",
    modalUrl,
    args = [300, .2, 300],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    meshBasicMaterialProps,
    boxBufferGeometryProps,
    ...props
}: any) {
    let texture: any;
    // if (modalUrl) {
    //     texture = useGLTF(modalUrl);
    // } else {
        texture = useLoader(THREE.TextureLoader, mapUrl);
    // }

    // Mesh basic material props
    meshBasicMaterialProps = {
        ...meshBasicMaterialProps || {},
        map: texture,
        side: THREE.DoubleSide,
    }

    // Box buffer geometry props
    boxBufferGeometryProps = {
        ...meshBasicMaterialProps || {},
        args: args || [[300, 2, 300]]
    }

    return (
        <>
            {
                mapUrl ? (
                    <mesh
                        position={position}
                        rotation={rotation}
                        {...props}
                    >
                        <boxBufferGeometry args={args} />
                        <meshBasicMaterial {...meshBasicMaterialProps} />
                    </mesh>
                ) : (
                    <primitive object={texture} {...props} />
                )
            }
        </>
    );
}

export default Wall