'use client'

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";


const Settings = () => {
    const user = useCurrentUser();
    const handleSignOut = ()=>{
        logout();
    }
  return (
    <div className="bg-white p-10 rounded-xl">
        <form>
            <button onClick={handleSignOut} type="submit">
                Sign Out
            </button>
        </form>
    </div>
  )
}

export default Settings