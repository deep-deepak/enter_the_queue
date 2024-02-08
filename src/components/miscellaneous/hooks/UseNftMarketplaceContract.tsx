import { ethers } from 'ethers';
import { getWeb3Provider } from 'helpers';
import React from 'react'
import { NFT_MARKET_PLACE_ABI, NFT_MARKET_PLACE_ADDRESS } from 'utils';

function UseNftMarketplaceContract() {
    const [constract, setContract] = React.useState<any>(false);

    React.useEffect(() => {
        (async () => {
            const { ethereum }: any = window;
            try {
                const account = ethereum.selectedAddress;
                if (account) {
                    const provider = await getWeb3Provider();
                    const signer = provider.getSigner();
                    const newContract = new ethers.Contract(NFT_MARKET_PLACE_ADDRESS, NFT_MARKET_PLACE_ABI, signer);
                    setContract(newContract)
                }
            } catch (error) {
                console.log(error)
            }
        })();
    }, [])

    return [constract, setContract];
}

export default UseNftMarketplaceContract