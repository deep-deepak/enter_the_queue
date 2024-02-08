import Layout from "../../components/Layout"
import { Collection } from "../../components/collections";
import { SECRET } from "../../utils";
import { getCollections, getTokenData } from "../../services";
import { useEffect, useState } from "react";
import { Metamask } from "context";


export default function BaseCollection({ query }: any) {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<any>(query);
    const [updated, setUpdated] = useState<Boolean>(false);
    const { user }: any = Metamask.useContext();
    const currentUserId = user.id || "";

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getCollections({
                createdBy: currentUserId,
                ...filters
            });
            setCollections(results);
            setIsLoading(false);
        })();
    }, [updated, currentUserId, filters])


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
            <Collection
                collections={collections}
                isUser={true}
                useFilter={() => [filters, handleSearch]}
            />
        </Layout>
    )
}

export const getServerSideProps = (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    const data: any = getTokenData(token);

    const isAllowed = token || data?.user?.role === "ADMIN" || (data?.user?.role === "ARTIST" && data?.user?.isApproved)
    if (isAllowed) {
        return { props: { query: context.query || {} } }
    }

    return {
        redirect: {
            permanent: true,
            destination: "/",
        },
    }
}
