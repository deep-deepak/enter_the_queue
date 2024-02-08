
import React from 'react'

function ReactImageLightbox() {
  return (
    <div>
         <video autoPlay loop muted width="100%">
          {/* <source src="img/animate.mp4" type="video/mp4" /> */}
          <source src="img/banner.mp4" type="video/mp4" />
        </video>
    </div>
  )
}

export default ReactImageLightbox