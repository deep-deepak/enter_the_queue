import Layout from "../../../components/Layout"
import { Details } from "../../../components/collections";
import { getBaseUrl } from "helpers/axios";
import { formatCollectionData, getAllItems, getCollectionById } from "services";
import { useEffect, useState } from "react";


export default function BaseCollectionDetails({ collection, id, query }) {

    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<any>(query);
    const [updated, setUpdated] = useState<Boolean>(false);
    const [nfts, setNfts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const items = await getAllItems({
                ...filters,
                collectionId: id,
                skip: 0,
                limit: 20,
                collection: id,
                creator: true,
                owner: true,
                view: true,
                like: true,
            });
            setNfts(items);
            setIsLoading(false);
        })();
    }, [updated, filters, id])


    const handleSearch = async (data = {}) => {
        if (Object.keys(data).length) {
            setFilters(data);
        } else {
            setFilters(data);
        }
        setUpdated(!updated);
    }

    return (
        <Layout isLoading={isLoading}>
            <Details
                id={id}
                nfts={nfts}
                collection={collection}
                useFilter={() => [filters, handleSearch]}
            />
        </Layout>
    )
}

export const getServerSideProps = async (context: any) => {
    const { collectionId }: any = context.query;
    const collection: any = await fetch(getBaseUrl(`api/collections/${collectionId}`))
        .then(res => res.json())
        .then(res => formatCollectionData(res.data));

    if (Object.keys(collection).length) {
        return { props: { collection, id: collectionId, query: context.query || {} } };
    }
    return {
        notFound: true
    }
}