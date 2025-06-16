"use client"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
export const SignOutButton = ()=>{
    return(
        <button onClick={()=> signOut({callbackUrl: "/"})}
        className="flex items-center gap-2 px-5 py-1 hover:bg-muted rounded-md"
        >        
            <LogOut className="h-4 w-4" />
            Sign Out    
        </button>
    )
}