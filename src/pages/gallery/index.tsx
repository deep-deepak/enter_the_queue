import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Layout from 'components/Layout';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItemProps {
    img: string;
    title: string;
    author: string;
    slug: string;
}

export default function TitlebarImageList() {
    return (
        <Layout title='Galleries'>
            <ImageList cols={3} sx={{ width: "100%", py: 2, px: 5, pb: 5 }}>
                <ImageListItem key="Subheader" cols={3}>
                    <ListSubheader component="div">3D Galleries</ListSubheader>
                </ImageListItem>
                {itemData.map((item: GalleryItemProps, key: number) => (
                    <Link
                        href={`gallery/${item.slug}`}
                        passHref
                        legacyBehavior
                        key={key}
                    >
                        <ImageListItem
                            sx={{
                                cursor: 'pointer'
                            }}
                        >
                            <Image
                                alt={item.title}
                                src={item.img}
                                height={500}
                                width={500}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.author}
                                // actionIcon={
                                //     <IconButton
                                //         sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                //         aria-label={`info about ${item.title}`}
                                //     >
                                //         <InfoIcon />
                                //     </IconButton>
                                // }
                            />
                        </ImageListItem>
                    </Link>
                ))}
            </ImageList>
        </Layout>
    );
}

const itemData = [
    {
        img: '/gallery/gallery-1.jpeg',
        title: 'Gallery 1',
        slug: "gallery-1",
        author: '@paradisedev',
    },
    {
        img: '/gallery/gallery-2.jpeg',
        title: 'Gallery 2',
        slug: "gallery-2",
        author: '@paradisedev',
    }
];