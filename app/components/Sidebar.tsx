// "use client";
// import { cn } from "@/lib/utils";
// import React, { useState, createContext, useContext } from "react";
// import { AnimatePresence, motion } from "motion/react";
// import { IconMenu2, IconX } from "@tabler/icons-react";

// export default function Sidebar() {
//   return (
//     <div className="fixed top-0 left-0 h-full w-48 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 z-40">
//       <div className="p-4 h-full overflow-y-auto">
//         <h2 className="text-xl font-semibold dark:text-white">Application</h2>
//         <nav className="mt-4">
//           <ul className="space-y-2">
//             <li>
//               <a href="/home" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700 rounded">
//                 Home
//               </a>
//             </li>
//             <li>
//               <a href="/mypapers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700 rounded">
//                 My Papers
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { SidebarLink, SidebarProvider, SidebarBody } from "./ui/Sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Upload from "./UploadSection";

export function SidebarDemo({children}:{children: ReactNode}) {
  const links = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Papers",
      href: "/mypapers",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const {data: session} = useSession();

  console.log(session?.user?.image);
  

  if(!session){
    return
  }
  

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: session.user?.name || "Guest",
                href: "#",
                icon: (
                  <img
                    src= {session.user?.image || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsbcf.fr%2Fen%2Fdefault-avatar%2F&psig=AOvVaw0GlMKARIQeemjRLhyso0jt&ust=1750257700960000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLizwpfY-I0DFQAAAAAdAAAAABAM"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard children={children} />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        <p className="text-2xl">Peperfy</p>
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = ({children}:{children: ReactNode}) => {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1 bg-white rounded-tl-2xl">
        {children}
      </div>
    </div>
  );
};

//flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white md:p-10 dark:border-neutral-700 dark:bg-neutral-900

