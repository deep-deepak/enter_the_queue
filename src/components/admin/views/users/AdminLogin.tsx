
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Metamask } from "context"
import { TextField, Typography } from "@mui/material";

const defaultError = {
    email: "",
    password: "",
    success: "",
    error: ""

};

export default function AdminLogin() {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false
    })

    const [errors, setErrors] = useState<any>(defaultError);
    const router = useRouter()

    const { adminLogin, isAdminLoggedIn }: any = Metamask.useContext();

    useEffect(() => {
        if(isAdminLoggedIn) {
            router.push('/admin/dashboard');
        }
    }, [isAdminLoggedIn]);

    const handleChange = (event: any) => {
        let value = event.target.value;
        let name = event.target.name;
        if(event.target.type == "checkbox") {
            value = event.target.checked;
        }
        setFormData((prevalue) => {
            return {
                ...prevalue,
                [name]: value
            }
        })
        setErrors(defaultError)
    }


    const handleSubmit = async () => {
        try {
            const { email, password, remember = false } = formData;
            if (!email) {
                setErrors({ ...defaultError, email: "Please fill the Email!" })
                return;
            }
            if (!password) {
                setErrors({ ...defaultError, password: "Please fill the password!" })
                return;
            }
            setIsLoading(true);
            const result: any = await adminLogin(email, password, remember);
            if (result.status !== "success") {
                setErrors({ ...defaultError, error: result.message || "Something went wrong!" });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded border-2 border-[#1729a7] p-5">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in as an Admin </h2>
                </div>
                <form className="mt-8 space-y-6 ">
                    <Typography component="span" color="red">{errors.error}</Typography>
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="dark:text-white" >Email</label>
                            <TextField
                                fullWidth
                                id="email-address"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                value={formData.email}
                                autoComplete="email"
                                className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-white-500 focus:z-10 focus:border-[#1729a7] focus:outline-none focus:ring-[#1729a7] sm:text-sm mb-4"
                                placeholder="Email address"
                                error={errors.email}
                                helperText={<Typography component="span" color="red">{errors.email}</Typography>}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="dark:text-white" >Password</label>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                value={formData.password}
                                autoComplete="current-password"
                                className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1729a7] focus:outline-none focus:ring-[#1729a7] sm:text-sm"
                                placeholder="Password"
                                error={errors.password}
                                helperText={<Typography component="span" color="red">{errors.password}</Typography>}

                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember" checked={formData.remember} onChange={handleChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1729a7] focus:ring-[#1729a7]" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white" style={{ color: "white" }}>Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-[#1729a7] hover:text-[#1729a7]">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1729a7] py-2 px-4 text-sm font-medium text-white hover:bg-[#1729a7] focus:outline-none focus:ring-2 focus:ring-[#1729a7] focus:ring-offset-2"
                            onClick={isLoading ? undefined : handleSubmit}
                        >
                            {isLoading ? "Loading..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
