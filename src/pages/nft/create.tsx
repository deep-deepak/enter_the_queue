import Layout from "../../components/Layout"
import { NftForm } from "../../components/nft"
import { SECRET } from '../../utils/constants';
import { getTokenData } from "../../services";


export default function BaseNFT() {

    return (
        <>
            <Layout>
                <NftForm />
            </Layout>
        </>
    )
}


export const getServerSideProps = (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    const data: any = getTokenData(token);
    const isAllowed = data?.user?.role === "ADMIN" || (data?.user?.role === "ARTIST" && data?.user?.isApproved)
    if (isAllowed) {
        return { props: {} };
    }
    return {
        redirect: {
            permanent: true,
            destination: "/",
        },
    }
}