
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Metamask } from "context"

export default function BaseAbout() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [data, setData] = useState([])

    const { user }: any = Metamask.useContext();
    const userAddress: any = user.address || "";
    const handleSubmit = async () => {
        alert("login")
    }



    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded border-2 border-[#1729a7] p-5">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
                    {/* <p className="mt-2 text-center text-sm text-gray-600">
                            Or
                            <a href="#" className="font-medium text-[#1729a7] hover:text-[#1729a7]">start your 14-day free trial</a>
                        </p> */}
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="dark:text-white" >Email</label>
                            <input id="email-address" name="email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} autoComplete="email" required className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1729a7] focus:outline-none focus:ring-[#1729a7] sm:text-sm mb-4" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="dark:text-white" >Password</label>
                            <input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} autoComplete="current-password" required className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1729a7] focus:outline-none focus:ring-[#1729a7] sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1729a7] focus:ring-[#1729a7]" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-[#1729a7] hover:text-[#1729a7]">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1729a7] py-2 px-4 text-sm font-medium text-white hover:bg-[#1729a7] focus:outline-none focus:ring-2 focus:ring-[#1729a7] focus:ring-offset-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-[#1729a7] group-hover:text-[#1729a7]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
