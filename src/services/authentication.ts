import { UserWalletAddress } from "../../@types";
import axios from "axios";

import { getBaseUrl } from "../helpers/axios";
import { JWT } from '../utils/jwt'
import { formatUserData } from "./users";

interface OptionPops {
    address: UserWalletAddress;
    authData: {
        customEth: {
            id: UserWalletAddress;
            signer: string;
            message: string;
            network: {
                chainId: number;
                ensAddress: string;
                name: string;
            }
        }
    };
    accounts: string[],
}

export const authenticate = async (options: OptionPops) => {
    let result = await axios({
        method: "POST",
        url: getBaseUrl("/api/login"),
        data: options
    })
        .then(result => result.data)
        .catch(error => {
            const message = error.response?.data?.message || error.message;
            console.error(message);
            return {
                status: "error",
                message
            };
        });
        
    if(result.status === "success") {
        const data = result.data;
        return {
            token: data.token,
            user: formatUserData(data.user),
            status: true
        }
    }
    return {
        status: false,
        message: result.message
    }
}

export const getTokenData = (token: string, secret: string = "") => {
    if (token) {
        const jwt = new JWT();
        const data = jwt.varifyToken(token, secret);
        if(!data) return false;
        return {
            token,
            user: data
        }
    }
    return false;

}

export const signOut = async () => {
    let result = await axios.get(getBaseUrl("/api/logout"))
        .then(result => result.data)
        .catch(error => {
            console.log(error)
            return [];
        });
    return result;
}

export const adminLogin = async (params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'post',
        url: getBaseUrl(`/api/admin/login`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            return {
                status: "error",
                message: error.response.data.message
            };
        });

    return results;
}

export const adminLogout = async () => {
    let result = await axios.get(getBaseUrl("/api/admin/logout"))
        .then(result => result.data)
        .catch(error => {
            console.log(error)
            return [];
        });
    return result;
}



export const getLoginUser = async () => {
    const result = await fetch(getBaseUrl('api/user'))
        .then(result => result.json())
        .then(result => result.data)
        .catch(err => {
            console.log(err)
            return false;
        })
    if(result) {
        return {
            ...result,
            user: formatUserData(result.user)
        }
    }
    return false;
}