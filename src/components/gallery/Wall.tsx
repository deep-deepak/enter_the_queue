import { useLoader } from '@react-three/fiber';
import React, { FC } from 'react'
import * as THREE from 'three';

const Wall = ({
    url = "",
    position,
    rotation,
    meshBasicMaterialProps = {},
    boxBufferGeometryProps = {},
    ...props
}: any) => {
    const textureUrl: string = url && url.trim() ? url.trim() : "/Texture_Wall.jpg";
    const texture = useLoader(THREE.TextureLoader, textureUrl);

    meshBasicMaterialProps = {
        ...meshBasicMaterialProps,
        map: texture,
        side: THREE.DoubleSide
    }
    
    return (
        <mesh
            position={position}
            rotation={rotation}
            {...props}
        >
            <boxBufferGeometry {...boxBufferGeometryProps} />
            <meshBasicMaterial {...meshBasicMaterialProps} />
        </mesh>
    );
}

export default Wall