import React from 'react'
import { Wall } from './components'

function Walls({
    data = [],
    ...props
}) {
    return (
        <group {...props}>{data.map((wall, key) => <Wall key={key} {...wall} />)}</group>
    )
}

export default Walls