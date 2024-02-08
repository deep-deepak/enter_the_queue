export * from './metamask'

export const trimString = (address: string, length = 4) => {
    const double = length * 2;
    address = typeof address == "string" && address.trim() ? address.trim() : '';
    if (address) {
        return address.length > double ? `${address.substring(0, double - 1)}...${address.substr(address.length - length - 1)}` : address;
    }
    return '';
}

export const trimUrl = (url = "") => {
    url = typeof url === "string" && url.trim() ? url.trim() : "";
    return url = url.charAt(0) == "/" ? `/${url.slice(1)}` : `/${url}`;
}

export const subString = (str: string, length = 25) => {
    str = str && str.trim() ? str.trim() : '';
    if (str) {
        return str.length > (length - 3) ? `${str.substring(0, length - 3)}...` : str;
    }
    return '';
}

export const toCaptalize = (str: string) => {
    if (str) { return str.charAt(0).toUpperCase() + str.slice(1) }
    return "";
}

export const slugify = (text: string) => {
    if (typeof text !== "string") return "";
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export const getUiAvatar = (name: string, options = {}) => {
    name = name && name.trim() ? name.trim().replace(" ", "+") : "D+V";
    return `https://ui-avatars.com/api/?format=png&name=${name}&rounded=true&size=124`;
}

export const getColors = (length: number = 1) => {
    const colors = [];
    for (let index = 0; index < length; index++) {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colors.push(`#${randomColor}`);
    }
    return colors;
}

export const IsJsonString = (str: string | any) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

export const checkYouOrNot = (loginUser: any, user: any) => {
    const isYou = loginUser?.id === user?.id;
    const href = `/creators/${isYou ? loginUser.id : user.id}`;
    return {
        href: href,
        text: isYou ? "you" : subString(user.username)
    }
}

export const formatSolidityError = (str: string) => {
    let message = "Something went wrong!";
    if (!str?.trim()) return { message }
    if(typeof IsJsonString(str) === "object") return IsJsonString(str);

    var errorObjKeys: any = [];
    let errorObj: any = {};

    let firstIndexOfSimpleBrace = str.indexOf("(");
    let lastIndexOfSimpleBrace = str.indexOf(")");

    if (firstIndexOfSimpleBrace >= 0 && lastIndexOfSimpleBrace >= 0) {
        str = str.slice(firstIndexOfSimpleBrace + 1, lastIndexOfSimpleBrace);
        str = str.replace(/(\w+=)|(\w+ =)/g, function (matchedStr: string) {
            matchedStr = matchedStr.trim().slice(0, -1);
            errorObjKeys.push(matchedStr)
            return matchedStr.substring(0, matchedStr.length) + ":";
        });

        let splitTxt = str;
        for (let i = 0; i <= errorObjKeys.length; i++) {
            let key = errorObjKeys[i];
            let splitData: any = splitTxt.split(`${key}:`);
            if (i > 0) {
                let data = splitData.shift().trim();
                data = data.slice(-1) == "," ? data.slice(0, -1) : data;
                errorObj[errorObjKeys[i - 1]] = IsJsonString(data);
            }
            splitTxt = i > 0 ? splitData.shift() : splitData.pop();
        }
        if (errorObj.hasOwnProperty("error") && typeof errorObj.error === "object") { 
            let error = errorObj.error;
            error.message = error?.message || message;
            delete errorObj.error;
            errorObj = {
                ...errorObj,
                ...error
            }
        }
        errorObj.message = errorObj?.message || message;
    } else {
        errorObj.message = str;
    }
    return {
        ...errorObj,
        message: errorObj?.message?.replace("execution reverted: ", "")
    };
}

export const arrayChunk = (data: any, perChunk = 3) => {
    if (!data?.length) return [];
    return data.reduce((resultArray: any, item: any, index: number) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, [])
}

export const checkImageUrl = (url: string, domain: string = "") => {
    url = url.trim();
    if (url) {
        const checkDomains = ["ipfs.infura.io"];
        checkDomains.forEach((domain: string) => {
            url = url.replace(domain, 'paradise.infura-ipfs.io');
        })
    }
    return url;
}

export function getRandomValue(max: number, min: number = 0) {
    const randVal = Math.floor(Math.random() * max);
    if (randVal > min) return randVal;
    return randVal + min;
}

export const reorder = <T>(
    list: T[],
    startIndex: number,
    endIndex: number
  ): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };


const Helpers = {
    trimString,
    trimUrl,
    subString,
    toCaptalize,
    slugify,
    getUiAvatar,
    getColors,
    IsJsonString,
    formatSolidityError,
    arrayChunk,
    checkImageUrl,
    getRandomValue
};

export default Helpers;