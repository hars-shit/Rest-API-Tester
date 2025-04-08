import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.ts'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
const SignUp = () => {

    const navigate = useNavigate()
   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 5) {
            toast.error("Password must contain more than 5 letters")
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password)
          
            setPassword('')
            setEmail('')
            setConfirmPassword('')
            toast.success("Signup successful!");

          setTimeout(()=>{
                navigate('/')
            },2000)
     

        }
        catch (error: any) {
            toast.error(error.message)
            
        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

                <form onSubmit={handleSignUp} className="space-y-4">
               
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <div
                            className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <div
                            className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </div>

                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="mx-2 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow h-px bg-gray-300" />
                </div>

            
            </div>
        </div>
    );
};

export default SignUp;
