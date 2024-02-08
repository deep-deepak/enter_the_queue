import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { NoDataFound } from '../miscellaneous';
import { getCollections } from '../../services';
import { CollectionCard } from '../collections';

function FeaturedCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const results = await getCollections({
                limit: 4
            });

            setCollections(results);
            setLoading(false);
        })();
    }, [])

    return (
        <>
            <section className="Top-collections-tabs pt-20 pb-20">
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-4 pb-7">
                        <h2 className="text-6xl text-black font-bold">Top collections</h2>
                    </div>
                    {isLoading ? (
                        <NoDataFound>Loading...</NoDataFound>
                    ) : (
                        <>
                            {
                                collections.length ? (
                                    collections.map((collection, key) => {
                                        return (
                                            <div className="grid grid-cols-4 gap-4 pt-10" key={key}>
                                                <div className="lg:flex broadband_section_flex  md:flex block flex-row lg:space-x-4 md:space-x-4 space-x-0 lg:space-y-0 md:space-y-0 space-y-3" >
                                                    <CollectionCard collection={collection} id={collection.id} />
                                                </div>
                                            </div >
                                        )
                                    })
                                ) : (
                                    <NoDataFound />
                                )
                            }
                        </>

                    )}

                </div>
            </section>

        </>
    )
}

export default FeaturedCollections