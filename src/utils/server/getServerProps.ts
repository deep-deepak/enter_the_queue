import { getBaseUrl } from "helpers/axios";
import { getTokenData } from "services";
import { SECRET } from "utils/constants";


export const getAdminServerProps = async (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    const data: any = getTokenData(token);
    if (data) {
        const user = await fetch(getBaseUrl(`api/users/${data.user.id}`))
            .then(response => response.json())
            .then(result => result.data)
            .catch(err => {
                console.log(err)
                return false;
            });
        if (user) {
            return { props: {} };
        }
    }
    return {
        redirect: {
            permanent: true,
            destination: "/admin/login",
        }
    }
}