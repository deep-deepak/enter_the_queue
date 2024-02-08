import { GalleryLayout } from 'components/gallery/layouts'
import React from 'react'
import { Gallery, SecondGallery } from 'components/gallery'
import { useRouter } from 'next/router'
import Four0Four from 'components/miscellaneous/404';

function BaseGallery() {
    const router = useRouter();
    const { slug }: any = router.query;

    const galleries = {
        "gallery-1": <Gallery />,
        "gallery-2": <SecondGallery />
    }

    return (
        <GalleryLayout>
            {galleries[slug] || <Four0Four />}
        </GalleryLayout>
    )
}

export default BaseGallery