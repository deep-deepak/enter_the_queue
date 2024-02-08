import React, { useState, useEffect } from 'react'

import { NoDataFound } from 'components/miscellaneous'
import Card from 'components/nft/Card';
import { getAllItems } from 'services';

function CategoryWiseNfts({ category, type, active }: any) {
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [nfts, setNfts] = useState<any>([]);

    useEffect(() => {
      (async () => {
        if(active) {
            setIsLoading(true);
            const results = await getAllItems({
                limit: 20,
                sort: { createdAt: -1 },
                categoryId: category?.id,
                trending: type === "trending"
            });
            setNfts(results);
            setIsLoading(false);
        }
      })();
    }, [category, type, active]);  

    return (
        <div className="trending-nfts">
            {isLoading ? (
                <NoDataFound>Loading...</NoDataFound>
            ) : nfts.length ? (
                <>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1  gap-4">
                        {
                            nfts.map((nft: any, key: number) => {
                                return (
                                    <Card {...nft} key={key} />
                                )
                            })
                        }
                    </div>
                </>
            ) : (
                <NoDataFound />
            )}
        </div>
    )
}

export default CategoryWiseNfts