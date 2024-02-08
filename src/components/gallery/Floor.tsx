import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

function Floor({
    length = 1,
    image = "/texturefloor-1.jpg",
    args,
    position,
    rotation
}: any) {
    const texture: any = useLoader(THREE.TextureLoader, image);
    length = typeof length === "number" && length > 0 ? length : 1;

    return (
        <>
            {
                Array(length).fill(0).map((value, key) => {
                    const rowPosition = position?.[key] || [0, 0, 0];
                    const rowRotation = rotation?.[key] || [0, 0, 0];
                    const rowArgs = args?.[key] || [300, .2, 300];
                    return <mesh
                        position={rowPosition}
                        rotation={rowRotation}
                        key={value + key}
                    >
                        <boxBufferGeometry args={rowArgs} />
                        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
                    </mesh>
                })
            }
        </>
    );
}

export default Floor