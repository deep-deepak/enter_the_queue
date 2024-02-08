import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three';

import { getAllItems } from '../../services'
import { useWindowSize } from 'components/miscellaneous/hooks'
import Loader from './Loader'
import Container from './Container'
import { Frames } from './frame'
import { useGLTF, useScroll } from '@react-three/drei';
import Sofa from './Sofa';
import { Ceiling } from './components';

const PRIMARY_COLOR = "#345995";

let frames: any = [
    // Center
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [0, 25, -490],
        scale: [130, 100, 10],
        rotation: [0, 0, 0],
    },
    // Left
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-240, 75, -25],
        scale: [200, 125, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-240, 75, -300],
        scale: [250, 150, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-240, 75, -600],
        scale: [250, 150, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-240, 75, -875],
        scale: [200, 125, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    // Right
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [240, 75, 25],
        scale: [200, 125, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [240, 75, -300],
        scale: [250, 150, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [240, 75, -600],
        scale: [250, 150, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [240, 75, -875],
        scale: [200, 125, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    // Front
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-160, 100, -1040],
        scale: [130, 100, 10],
        rotation: [0, 0, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [160, 100, -1040],
        scale: [130, 100, 10],
        rotation: [0, 0, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-2, 50, -1040],
        scale: [175, 125, 10],
        rotation: [0, 0, 0],
    },
    // Back side
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [-110, 75, 145],
        scale: [175, 125, 10],
        rotation: [Math.PI, 0, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: "#388ad3"
        },
        imageProps: {},
        innerMesh: {},
        position: [110, 75, 145],
        scale: [175, 125, 10],
        rotation: [Math.PI, 0, 0],
    },

];

const walls = [
    // Front
    {
        position: [0, 53, -1050],
        rotation: [20.42, 0, 0],
        args: [500, .2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        }
    },
    // Left
    {
        position: [-250, 53, -450],
        rotation: [20.42, 0, 20.42],
        args: [1200, 2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    },
    // Center
    {
        mapUrl: "/Texture_Ceil.jpg",
        position: [0, 25, -500],
        rotation: [20.42, 0, 0],
        args: [200, 10, 150],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        }
    },
    // Right
    {
        position: [250, 53, -450],
        rotation: [20.42, 0, 20.42],
        args: [1200, 2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    },
    // Back
    {
        mapUrl: "/Texture_Wall.jpg",
        args: [500, .2, 300],
        position: [0, 53, 150],
        rotation: [20.42, 0, 0],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    }
]

function SecondGallery() {
    const [nfts, setNfts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const window = useWindowSize();

    useEffect(() => {
        async function downloadFile(urlToSend: string) {
            return new Promise(resolve => {
                var req = new XMLHttpRequest();
                req.open("GET", urlToSend, true);
                req.responseType = "blob";
                req.onload = function (event) {
                    resolve(req.response)
                };
                req.send();
            })
        };
        (async () => {
            setIsLoading(true);
            let result = await getAllItems({
                limit: 13
            });
            result = result.map(async (nft: any) => {
                const dataUrl: any = await downloadFile(nft.asset.file);
                nft.image = URL.createObjectURL(dataUrl);
                return nft;
            });
            result = await Promise.all(result.map(async nft => await nft));
            setNfts(result);
            setIsLoading(false);
        })()
    }, [])

    return (
        <>
            {
                isLoading ? (
                    <div className="etq-loading">Loading&#8230;</div>
                ) : (
                    <div id='canvas-container'>
                        <Canvas
                            dpr={[1, 2]}
                            camera={{
                                fov: 50,
                                position: [0, -150, 10],
                                aspect: window.width / (window.height),
                                near: 1,
                                far: 10000,
                                scale: [2, 2, 1]
                            }}
                            raycaster={new THREE.Raycaster()}
                            style={{ height: "100vh", width: "100vw" }}
                        >
                            <Suspense fallback={<Loader />}>
                                <Container
                                    ceilingProps={{
                                        mapUrl: "/Texture_Ceil.jpg",
                                        position: [0, 200, -450],
                                        rotation: [0, 0, 0],
                                        args: [500, 2, 1200],
                                        meshBasicMaterialProps: {
                                            color: "#abc4ff"
                                        }
                                    }}
                                    floorProps={{
                                        mapUrl: "/gallery/floor/floor3.jpeg",
                                        args: [500, 2, 1200],
                                        position: [0, -95, -450],
                                        rotation: [0, 0, 0],
                                        meshBasicMaterialProps: {
                                            color: "#abc4ff"
                                        }
                                    }}
                                    wallProps={{
                                        data: walls
                                    }}
                                    isOrbitControls={true}
                                >
                                    <Frames frames={frames} nfts={nfts} />
                                    {/* <Sofa
                                        rotation={[0, 1.5, 0]}
                                        position={[10, -70, -400]}
                                        scale={[2, 1.2, 2]}
                                    /> */}
                                    <Ceiling
                                        mapUrl="/Texture_Ceil.jpg"
                                        position={[0, 198, -650]}
                                        rotation={[0, 0, 0]}
                                        args={[250, 2, 250]}
                                        meshBasicMaterialProps={{
                                            color:"#345995"
                                        }}
                                    />
                                    <Ceiling
                                        mapUrl="/Texture_Ceil.jpg"
                                        position={[0, 198, -250]}
                                        rotation={[0, 0, 0]}
                                        args={[250, 2, 250]}
                                        meshBasicMaterialProps={{
                                            color:"#345995"
                                        }}
                                    />
                                </Container>
                            </Suspense>
                        </Canvas>
                    </div>
                )
            }
        </>
    )
}

export default SecondGallery;