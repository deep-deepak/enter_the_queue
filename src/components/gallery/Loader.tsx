import { Html, useProgress } from '@react-three/drei';
import React from 'react'


function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    return <Html center style={{ width: "100px"}}>{Math.trunc( progress )} % loaded</Html>;
}

export default Loader