import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
    // State for username and password inputs
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    // State to track hover effect on login button
    const [isHovered, setIsHovered] = useState(false)
    // Custom hook providing login function and error state
    const { logIn, error, user } = useAuth()



    // Hook to navigate programmatically after successful login
    const navigate = useNavigate()

    // useEffect(() => {
    //     const tokenAUTH = localStorage.getItem('authToken');
    //     if (tokenAUTH) {

    //         return <Navigate to={"/dashboard"}/>
    //     }
    // }, [user]);


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    // Handle form submit: call logIn from context and navigate on success
    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await logIn(credentials)
        if (success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="bg-[url('./resources/LogBG.jpg')] bg-cover bg-no-repeat bg-center w-screen h-screen flex flex-col items-center justify-center">
            {/* Logo image as background */}
            <div className="bg-[url('./resources/Logo.png')] bg-contain bg-no-repeat bg-center mb-7 w-30 h-30"></div>

            <form className="bg-white p-10 rounded-xl shadow-lg space-y-4 border border-yellow-500" onSubmit={handleSubmit}>
                <h1 className="text-center text-2xl font-bold">Log In</h1>

                {/* Display error message if login fails */}
                {error &&
                    <div className="bg-red-500 text-white p-2 w-full text-center border border-yellow-300 rounded">
                        <i className="text-xs">{error}</i>
                    </div>
                }

                <div className="flex flex-col">
                    <label htmlFor="username" className="text-center text-sm font-bold">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={handleChange}
                        className="border border-yellow-300 rounded p-1"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-center text-sm font-bold">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        className="border border-yellow-300 rounded p-1"
                    />
                </div>

                {/* Login button with hover effect controlled by isHovered state */}
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 w-full rounded font-bold border-2 ${isHovered ? 'border-yellow-500' : 'border-transparent'
                        }`}
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Reset hover state
                >
                    Log In
                </button>
                <div className="text-center mt-2">
                    <span className="mr-1">Don&apos;t have an account?</span>
                    <Link to={"/register"} className="text-black underline font-bold">register</Link>
                </div>
            </form>


        </div>
    )
}
