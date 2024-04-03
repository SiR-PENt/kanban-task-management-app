'use client'

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import Image from "next/image";
import iconLightTheme from "../../../.././public/icon-light-theme.svg";
import iconDarkTheme from "../../../.././public/icon-dark-theme.svg";
import iconHideSidebar from "../../../.././public/icon-hide-sidebar.svg";

interface ISidebarFooter {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarFooter({ showSidebar, setShowSidebar }: ISidebarFooter) {

  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer
      className={`${
        !showSidebar ? "hidden" : "block"
      } absolute bottom-0 py-6 pr-6 w-full`}
    >
      <div className="pl-6">
        <div className="h-[3rem] rounded-md flex justify-center items-center space-x-6 bg-light-grey dark:bg-very-dark-grey w-full">
          <Image
            src={iconLightTheme}
            alt="board icon"
            className="object-contain"
          />
          <div
            onClick={() =>
              theme === "light" ? setTheme("dark") : setTheme("light")
            }
            className="w-9 h-5 rounded-2xl px-px relative hover:bg-primary bg-main-purple flex items-center 
                cursor-pointer transition-width duration-150 ease-out"
          >
            <div
              className={`transition-width duration-150 ease-out w-4 h-4 rounded-full bg-white absolute mx-0.5 ${
                theme === "light" ? "left-0" : "right-0"
              }`}
            />
          </div>
          <Image
            src={iconDarkTheme}
            alt="board icon"
            className="object-contain"
          />
        </div>
      </div>

      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className="hover:bg-light-grey dark:hover:bg-white py-3 pb-3 pl-6 cursor-pointer flex mt-5 transition ease-in duration-150 delay-150 rounded-tr-full rounded-br-full"
      >
        <Image
          src={iconHideSidebar}
          alt="hide sidebar"
          className="object-contain"
        />
        <p className="text-medium-grey ml-2 text-sm hover:text-main-purple">
          Hide Sidebar
        </p>
      </div>
      <div className="pl-6">
        <button
          onClick={() => signOut()}
          className="bg-main-purple transition ease-in duration-150 delay-150 dark:hover:bg-primary text-white
                   px-4 py-2 mt-6 rounded-3xl space-x-2 w-full"
        >
          <p className="text-center w-full">Sign Out</p>
        </button>
      </div>
    </footer>
  );
}
