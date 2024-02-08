import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const Tabs: any = dynamic(import('react-tabs').then(mod => mod.Tabs), { ssr: false }) // disable ssr

import { Tab, TabList, TabPanel } from 'react-tabs';
import { getCategories } from '../../services';
import CategoryWiseNfts from './CategoryWiseNfts';


function TopArts({ title = "", categories = []}) {
    const [nfts, setNfts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showingCategories, setShowingCategories] = useState<any>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        (async () => {
            if(categories.length) {
                setIsLoading(true);
                const categoryResult = await getCategories({
                    ids: categories
                });
                setShowingCategories(categoryResult)
                setIsLoading(false);
            }
        })();
    }, [categories])

    const handleSelect = (index: number, lastindex: number, event: any) => {
        setActiveIndex(index)
    }

    return (
        <section className="explore-ngts  bg-gray-200 pt-20 pb-20">
            <div className="container mx-auto">
                <div className="flex flex-row space-x-4 pb-7">
                    <h2 className="text-5xl text-white font-bold text-center artistssection_subtitle mainheading" data-aos="fade-up"
                        data-aos-duration="3000">{title ? title : "Categories"}</h2>
                </div>
                <div className="row">
                    <Tabs
                        onSelect={handleSelect}
                    >
                        <TabList data-aos="fade-up" data-aos-duration="3000">
                            {
                                showingCategories.map((category: any, key: number) => {
                                    return <Tab
                                        tabIndex={category.id}
                                        key={key}
                                    >{category.name}</Tab>
                                })
                            }
                        </TabList>
                        {
                            [...showingCategories].map((category: any, key: number) => {
                                return <TabPanel key={key}>
                                    <CategoryWiseNfts
                                        active={key === activeIndex}
                                        category={category.id ? category : null}
                                        type={category.nftFilter ? category.nftFilter : null}
                                    />
                                </TabPanel>
                            })
                        }
                    </Tabs>
                </div>
            </div>
        </section>
    )
}

export default TopArts