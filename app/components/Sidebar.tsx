"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { SidebarLink, SidebarBody } from "./ui/Sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
                  <Image
                    src= {session.user?.image || "/default-avatar.jpeg"}
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
      <Dashboard>
        {children}
      </Dashboard>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src= {"/icon-removebg-preview.png"}
        className="h-7 w-6 "
        width={50}
        height={50}
        alt="icon"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        <p className="text-2xl">Paperfy</p>
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
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <Image
        src= {"/icon-removebg-preview.png"}
        className="h-7 w-6 "
        width={50}
        height={50}
        alt="icon"
      />
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

