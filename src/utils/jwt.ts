import { sign, verify } from 'jsonwebtoken'

export class JWT {

    private secret: string = "enter-the-queue-secret";
    private expiresIn: string = "3h";

    constructor(
        secret?: string | undefined,
        expiresIn?: string | undefined,
    ) {
        if(typeof expiresIn !== "undefined") this.expiresIn = expiresIn;
        if(typeof secret !== "undefined") this.secret = secret;
    }

    createToken = (data: string | object | Buffer) => {
        const token = sign(data, this.secret, { expiresIn: this.expiresIn });
        return token;
    }

    varifyToken = (token: string, secret: string = "") => {
        try {
            if(!token) return ""; 
            secret = secret && secret.trim() ? secret.trim() : this.secret;
            var decoded = verify(token, secret);;
            return decoded;            
        } catch (error: any) {
            console.error(error?.message || "Invalid token")
            return ""
        }
    }

    // getTokenData = () => {
    //     const token = getCookie(this.csrfToken);
    //     if(typeof token === "string") {
    //         return this.varifyToken(token);
    //     }
    //     return false;
    // }

    deleteToken = () => {
        
    }
}