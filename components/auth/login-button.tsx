"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps{
    children: React.ReactNode;
    mode?:"modal" | "redirect",
    asChild?: boolean;
}


export const LoginButton = ({
    children,
    mode="redirect",
    asChild
}: LoginButtonProps) =>{
    const router = useRouter();

    const handleOnClick = () =>{
        router.push("/auth/login");
    }
    if(mode === "modal"){
        return (
            <span>
                TODO:Implement modal
            </span>
        )
    }
    return (
        <span onClick={handleOnClick} className="cursor-pointer"> 
            {children}
        </span>
    )
}
