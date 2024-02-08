
import type { UserWalletAddress, IPFSImageProps } from "./wallet";

export interface UserInputFields {
    name: string;
    email: string;
    password: string;
    ethAddress: UserWalletAddress;
    username: string;
    description: string;
    colors: string[];
    accounts: UserWalletAddress[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        discord?: string;
    }
    isVarified: Boolean;
    theme: string;
    banner: IPFSImageProps | undefined;
    image: IPFSImageProps | undefined;
    authData?: any;
    role?: "USER" | "ARTIST" | "ADMIN";
    isApproved?: Boolean;
    status?: Boolean;
    isArtist ?: Boolean;
    canAdminApprove?: Boolean,
    isMarketplaceAdmin?: Boolean,
    rememberToken?: string;
}

export interface UserInputUpdateFields {
    name?: string;
    username?: string;
    description?: string;
    accounts?: UserWalletAddress[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        discord?: string;
    }
    theme?: string;
    banner?: IPFSImageProps | undefined;
    image?: IPFSImageProps | undefined;
    authData?: any;
    status?: Boolean;
    
}

interface CountProps {
    count?: number;
}

export interface UserDataProps {
    _id?: string;
    id?: string;
    name: string;
    ethAddress: UserWalletAddress;
    address?: UserWalletAddress;
    username: string;
    description: string
    socialLinks: {
        instagram?: string,
        facebook?: string,
        twitter?: string,
        discord?: string, 
        website?: string,
    };
    banner: IPFSImageProps | string;
    image: IPFSImageProps | string;
    colors: string;
    isVarified: Boolean;
    ownedNft?: CountProps[] | undefined;
    createdNft?: CountProps[] | undefined;
    collections?: CountProps[] | undefined
    followers?: CountProps[] | undefined
    followings?: CountProps[] | undefined
    createdAt: Date;
    updatedAt: Date; 
    artist?: Boolean;
}


export interface optionProps {
    skip?: number;
    match?: any;
    ownedNft?: Boolean;
    createdNft?: Boolean;
    limit?: number;
    sortBy?: any;
    collection?: Boolean;
    follower?: Boolean;
    following?: Boolean;
    others?: Array<{}>;
    artist?: Boolean;
    from?:String;
}