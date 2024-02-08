
import { FaEthereum } from 'react-icons/fa';
import { SITE_TOKEN } from "utils";


const CryptoToken = (props: any = {}) => {

    return (
        <>
            {
                SITE_TOKEN === "ETH" ? (
                    <FaEthereum style={{
                        display: "inline-block",
                        marginTop: "-4px"
                    }} {...props} />
                ) : SITE_TOKEN
            }
        </>
    )
}

export default CryptoToken;