import { AdminLogin } from 'components/admin/views/users'
import React from 'react'

function Login() {
    return (
        <div>
            <AdminLogin />
        </div>
    )
}

Login.getLayout = () => <Login />

export default Login;