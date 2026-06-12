"use client";
import LoginForm from "@/components/auth/loginForm";
import { Suspense } from 'react'

function LoginContent(){
    
    return <div className="flex justify-center items-center w-full min-h-screen ">
               <LoginForm/>
        </div>  
}

const Login = () => {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}

export default Login