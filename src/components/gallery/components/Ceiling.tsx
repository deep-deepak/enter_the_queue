import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

function Ceiling({
    mapUrl = "/Texture_Ceil.jpg",
    // modalUrl = '',
    position = [0, 70, 0],
    rotation = [0, 0, 0],
    args = [300, 2, 300],
    meshBasicMaterialProps,
    boxBufferGeometryProps,
    ...props
}: any) {
    // const modalTexture = useGLTF(modalUrl);
    const texture = useLoader(THREE.TextureLoader, mapUrl);
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

export default Ceiling