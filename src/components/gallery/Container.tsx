import { Environment } from '@react-three/drei'
import React from 'react'
import { Ceiling, Floor } from './components'
import GalleryControls from './GalleryControls'
import Walls from './Walls'

function Container({
    isCeiling = true,
    ceilingProps = {},
    isFloor = true,
    floorProps = {},
    isWall = true,
    wallProps = {},
    isOrbitControls = false,
    orbitControlProps = {},
    children
}): any {
    return (
        <>
            {/* Let there be ceiling! */}
            {
                isCeiling && (<Ceiling {...ceilingProps} />)
            }
            {/* Let there be floor! */}
            {
                isWall && (<Walls {...wallProps} />)
            }
            {/* Let there be light! */}
            <ambientLight />
            {/*
                This lets you rotate the camera.
                We've associated our React ref with it
                like we would do for any React component
            */}
            {children}
            {/* Let there be floor! */}
            {
                isFloor && (<Floor {...floorProps} />)
            }
            {/* Let there be floor! */}
            {
                isOrbitControls && (<GalleryControls {...orbitControlProps} />)
            }
            {/* <Environment preset="apartment" /> */}
        </>
    )
}

export default Container
