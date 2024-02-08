import { FC, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import ImageFrame from './ImageFrame'
import { Quaternion, Vector3 } from 'three'
import VideoFrame from './VideoFrame'
import { useRouter } from 'next/router'
import { Metamask } from 'context'
import { Html, useCursor } from '@react-three/drei'
import Details from '../assets/Details'
import moment from 'moment'

const GOLDEN_RATIO = 35;

interface FramesProps {
    nfts: any[];
    frames: any[];
    q?: Quaternion;
    p?: Vector3
}


const Frames: FC<FramesProps> = ({ nfts = [], frames = [], q = new Quaternion(), p = new Vector3() }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [currentName, setCurrentName] = useState<string>("");
    const [currentObject, setCurrentObject] = useState<any>(false);
    const ref: any = useRef()
    const router = useRouter();
    const clicked: any = useRef()
    const [hovered, hover] = useState(false);

    useCursor(hovered)
    const { login, isAuthenticated } = Metamask.useContext();

    frames = frames.map((frame: any, key: number) => {
        const nft = nfts?.[key] || {};

        let data: any = {
            ...frame,
            type: nft?.asset?.type || "image",
            data: nft,
            name: nft?.id || moment().valueOf().toString(),
            imageProps: {
                ...frame.imageProps || {},
                url: nft?.image || "/plus.png"
            },
        }
        if(data.type == "video") {
            data.image = nft?.image || "/plus.png"
        }
        return data;
    })

    useEffect(() => {
        clicked.current = ref.current.getObjectByName(currentName)
        if (clicked.current) {
            clicked.current.parent.updateWorldMatrix(true, true)
            clicked.current.parent.localToWorld(p.set(10, 1, 500))
            clicked.current.parent.getWorldQuaternion(q)
        } else {
            p.set(0, 0, 5.5)
            q.identity()
        }
    })

    useFrame((state, dt) => {
        easing.damp3(state.camera.position, p, 0.4, dt, 0)
        easing.dampQ(state.camera.quaternion, q, 0.4, dt, 0)
    })

    const handleClick = async (event: any) => {
        event.stopPropagation();
        const { userData, name } = event.object;
        delete userData.logo;
        setCurrentName(name);
        if (Object.keys(userData).length) {
            setOpen(true)
            setCurrentObject(userData);
        } else {
            setCurrentObject(false);
            if (!isAuthenticated) {
                await login();
                return;
            }
            router.push(`/nft/create?redirect_url=${router.pathname}`);
        }

    }

    const handlePointerMissed = (event: any) => {
        setOpen(false)
        setCurrentObject(false);
    }

    return (
        <group
            position={[0, -0.5, 0]}
            ref={ref}
            onClick={handleClick}
            onPointerMissed={handlePointerMissed}
        >
            {
                frames.map((frame: any, key: number) => {
                    
                    return (
                        <>
                            {
                                frame.type === "image" ? (
                                    <ImageFrame
                                        key={key}
                                        {...frame}
                                        meshProps={{
                                            ...frame.mashProps || {},
                                            onPointerOver: (e: any) => (e.stopPropagation(), hover(true)),
                                            onPointerOut: () => hover(false)
                                        }}
                                    />
                                ) : (
                                    <VideoFrame
                                        key={key}
                                        {...frame}
                                    />
                                )
                            }
                            <AssetPopup asset={frame.data} currentAsset={currentObject} useOpen={() => [open, setOpen]} />
                        </>
                    )
                })
            }
        </group>
    )
}

const AssetPopup = ({ asset, currentAsset, useOpen }: any) => {
    return (
        <>
            {
                asset?.id && currentAsset?.id === asset?.id && (
                    <Html>
                        <Details useOpen={useOpen} {...asset} />
                    </Html>
                )
            }
        </>
    )
}

export default Frames;
