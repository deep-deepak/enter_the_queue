import { useRef } from 'react'
import { Image } from '@react-three/drei'
import moment from 'moment'


function ImageFrame({
    data = {},
    name = moment().valueOf().toString(),
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    meshProps = {},
    meshStandardMaterialProps = {},
    innerMeshStandardMaterialProps = {},
    imageProps = {},
    innerMesh = {},
    children,
    ...props
}: any) {
    const image: any = useRef();
    const frame: any = useRef();

    meshStandardMaterialProps = {
        color: "#151515",
        metalness: 0.5,
        roughness: 0.5,
        envMapIntensity: 2,
        ...meshStandardMaterialProps
    }

    innerMesh = {
        position: [0, 0, 0.2],
        scale: [0.9, 0.85, 0.9],
        ...innerMesh,
        ref: frame
    }

    innerMeshStandardMaterialProps = {
        color: "#151515",
        toneMapped: false,
        fog: false,
        ...meshStandardMaterialProps
    }

    imageProps = {
        transparent: true,
        url: "/plus.png",
        position: [0, 0, 0.7],
        scale: [.8, .8],
        ...imageProps,
        ref: image
    }

    return (
        <group
            position={position}
            rotation={rotation}
            {...props}
        >
            <mesh
                name={name}
                userData={data}
                {...meshProps}
            >
                <boxGeometry />
                <meshStandardMaterial {...meshStandardMaterialProps} />
                <mesh userData={data} {...innerMesh}>
                    <boxGeometry />
                    <meshBasicMaterial {...innerMeshStandardMaterialProps} />
                </mesh>
                <Image {...imageProps} />
            </mesh>
            {children}
        </group>
    )
}

export default ImageFrame;