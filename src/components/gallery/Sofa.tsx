import { useGLTF, useScroll } from "@react-three/drei";


function Sofa({ ...props }) {
    // This hook gives you offets, ranges and other useful things
    const scroll = useScroll()
    const { scene, animations } = useGLTF('/gallery/sofa/sofa.glb')
    // const { actions } = useAnimations(animations, scene)
    // useLayoutEffect(() => Object.values(nodes).forEach((node) => (node.receiveShadow = node.castShadow = true)))
    // useEffect(() => void (actions['Take 001'].play().paused = true), [actions])
    // useFrame((state, delta) => {
    //     const action = actions['Take 001']
    //     // The offset is between 0 and 1, you can apply it to your models any way you like
    //     const offset = 1 - scroll.offset
    //     action.time = THREE.MathUtils.damp(action.time, (action.getClip().duration / 2) * offset, 100, delta)
    //     state.camera.position.set(Math.sin(offset) * -10, Math.atan(offset * Math.PI * 2) * 5, Math.cos((offset * Math.PI) / 3) * -10)
    //     state.camera.lookAt(0, 0, 0)
    // })
    return <primitive color="red" object={scene} {...props} />
}

// useGLTF.preload('/LittlestTokyo-transformed.glb')

export default Sofa;