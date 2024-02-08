import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three';

import { getAllItems } from '../../services'
import { useWindowSize } from 'components/miscellaneous/hooks'
import Loader from './Loader'
import Container from './Container'
import { Frames } from './frame'
// import Sofa from './Sofa';
// import { Ceiling } from './components';

const PRIMARY_COLOR = "#ededed";
const SECONDARY_COLOR = "#FFFDD0" // "#388ad3"

let frames: any = [
    // Center
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [0, 0, -290],
        scale: [300, 150, 5],
        rotation: [0, 0, 0],
    },
    // Left
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [-442, 20, 200],
        scale: [250, 175, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [-442, 10, -100],
        scale: [200, 150, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [-442, 20, -400],
        scale: [250, 175, 10],
        rotation: [0, Math.PI / 2, 0],
    },
    
    // Right
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [442, 20, 150],
        scale: [250, 175, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [442, 10, -150],
        scale: [200, 150, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [442, 20, -450],
        scale: [250, 175, 10],
        rotation: [0, -(Math.PI / 2), 0],
    },
    // Front
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [-200, 20, -642],
        scale: [250, 175, 10],
        rotation: [0, 0, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [200, 20, -642],
        scale: [250, 175, 10],
        rotation: [0, 0, 0],
    },
    // Back side
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [-200, 20, 345],
        scale: [250, 175, 10],
        rotation: [Math.PI, 0, 0],
    },
    {
        meshStandardMaterialProps: {
            scale: [2, 5, 10],
            color: SECONDARY_COLOR
        },
        imageProps: {},
        innerMesh: {},
        position: [200, 20, 345],
        scale: [250, 175, 10],
        rotation: [Math.PI, 0, 0],
    },

];

const walls = [
    // Front
    {
        position: [0, 0, -650],
        rotation: [20.42, 0, 0],
        args: [900, 2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        }
    },
    // Left
    {
        position: [-450, 0, -150],
        rotation: [20.42, 0, 20.42],
        args: [1000, 2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    },
    // Center
    {
        mapUrl: "/Texture_Ceil.jpg",
        position: [0, 0, -300],
        rotation: [20.42, 0, 0],
        args: [400, 20, 200],
        meshBasicMaterialProps: {
            color: "#fff6f6"
        }
    },
    // Right
    {
        position: [450, 0, -150],
        rotation: [20.42, 0, 20.42],
        args: [1000, 2, 300],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    },
    // Back
    {
        mapUrl: "/Texture_Wall.jpg",
        args: [900, 2, 300],
        position: [0, 0, 350],
        rotation: [20.42, 0, 0],
        meshBasicMaterialProps: {
            color: PRIMARY_COLOR
        },
    }
]

function Gallery() {
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
console.log(result)
            result = result.map(async (nft: any) => {
		console.log(nft.asset.file, 'file');
                const dataUrl: any = await downloadFile(nft.asset.file);
		console.log(dataUrl, 'dataurl');
                nft.image = URL.createObjectURL(dataUrl);
		console.log(nft, 'nft')
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
                                fov: 60,
                                position: new THREE.Vector3(0, -150, 10),
                                aspect: window.width / (window.height),
                                near: 1,
                                far: 10000,
                                scale: new THREE.Vector3(1.5, 1.5, 1)
                            }}
                            raycaster={new THREE.Raycaster()}
                            style={{ height: "100vh", width: "100vw" }}
                        >
                            <Suspense fallback={<Loader />}>
                                <Container
                                    ceilingProps={{
                                        mapUrl: "/Texture_Ceil.jpg",
                                        position: [0, 150, -150],
                                        rotation: [0, 0, 0],
                                        args: [900, 2, 1000],
                                        meshBasicMaterialProps: {
                                            color: PRIMARY_COLOR    
                                        }
                                    }}
                                    floorProps={{
                                        mapUrl: "/gallery/floor/floor3.jpeg",
                                        args: [900, 2, 1000],
                                        position: [0, -150, -150],
                                        rotation: [0, 0, 0],
                                        meshBasicMaterialProps: {
                                            color: PRIMARY_COLOR    
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
                                    {/* <Ceiling
                                        mapUrl= "/Texture_Ceil.jpg"
                                        position= {[0, 148, -50]}
                                        rotation= {[0, 0, 0]}
                                        args= {[250, 2, 250]}
                                        meshBasicMaterialProps= {{
                                            color: PRIMARY_COLOR
                                        }}
                                    /> */}
                                </Container>
                            </Suspense>
                        </Canvas>
                    </div>
                )
            }
        </>
    )
}

export default Gallery;
