import React, { useRef } from 'react'
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber'

interface ContainerProps {
    children: React.ReactNode;
    scroll: any;
}

function Container({ scroll, children }: ContainerProps) {
    const { viewport, ...others } = useThree()
    const group: any = useRef();

    useFrame((state, delta) => {
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta)
    })

    return <group ref={group}>{children}</group>
  }

export default Container