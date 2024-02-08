import axios from "axios";
import { getBaseUrl } from "helpers/axios";


export const getTemplates = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl("api/admin/templates"), {
        params: options
    })
        .then((result: any) => result.data.data.templates)
        .catch((error: any) => {
            console.error(error.response?.data?.message || error.message)
            return [];
        });
        
    return results;
}

export const getTemplateById = async (templateId: string, options: any = {}) => {
    let result = await axios.get(
        getBaseUrl(`api/admin/templates/${templateId}`),
        { params: options }
    )
        .then((result: any) => result.data.data)
        .catch((error: any) => {
            console.error(error.response?.data?.message || error.message)
            return false;
        });
    return result;
}


export const updateTemplateContent = async (templateId: string, params: any) => {
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`api/admin/templates/${templateId}`),
        data: params
    })
        .then((result: any) => result.data)
        .catch((error: any) => {
            const message = error.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}