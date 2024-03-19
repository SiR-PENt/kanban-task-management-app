import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice";
import Image from "next/image";
import { useAppDispatch } from "@/components/redux/hooks";
import {
  setPageTitle,
  setActiveBoardIndex,
} from "@/components/redux/features/modalSlice";
import { useState, useEffect } from "react";
import iconBoard from "../../.././public/icon-board.svg";
import iconBoardPurple from "../../.././public/icon-board-purple.png";
import iconBoardWhite from "../../.././public/icon-board-white.png";
import iconLightTheme from "../../.././public/icon-light-theme.svg";
import iconDarkTheme from "../../.././public/icon-dark-theme.svg";
import iconHideSidebar from "../../.././public/icon-hide-sidebar.svg";
import iconShowSidebar from "../../.././public/icon-show-sidebar.svg";
import { openAddOrEditBoardModal } from "@/components/redux/features/modalSlice";
import { useTheme } from "next-themes";

export default function Sidebar() {
  const { data } = useFetchDataFromDbQuery();

  const [active, setActive] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const handleNav = (index: number, name: string) => {
    setActive(index);
    dispatch(setPageTitle(name));
  };

  useEffect(() => {
    if (data) {
      const activeBoard = data[0]?.boards.find(
        (_item: any, index: number) => index === active
      );
      dispatch(setPageTitle(activeBoard?.name));
    }
  }, [data]);

  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative hidden md:block">
      <aside
        className={`${
          !showSidebar
            ? "w-0 overflow-hidden"
            : "w-[18.75rem] flex-none bg-white dark:bg-dark-grey h-full py-6 pr-6"
        }
          transition-width duration-150 ease-out relative`}
      >
        {data && (
          <>
            <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
              {`All Boards (${data[0]?.boards.length})`}
            </p>
            {data[0]?.boards.map(
              (board: { [key: string]: any }, index: number) => {
                const { name } = board;
                const isActive = index === active;
                return (
                  <div
                    onClick={() => handleNav(index, name)}
                    key={index}
                    className={`${
                      isActive
                        ? "bg-main-purple text-white"
                        : "text-medium-grey transition ease-in duration-150 delay-150 dark:hover:bg-white dark:hover:text-main-purple"
                    } cursor-pointer rounded-tr-full rounded-br-full flex items-center space-x-2 pl-[2.12rem] py-3 pb-3`}
                  >
                    {isActive ? (
                      <Image src={iconBoardWhite} alt="active board icon" />
                    ) : (
                      <Image src={iconBoard} alt="board icon" />
                    )}
                    <p className="text-lg capitalize">{name}</p>
                  </div>
                );
              }
            )}
          </>
        )}
        <button
          onClick={() => dispatch(openAddOrEditBoardModal("Add New Board"))}
          className="flex items-center space-x-2 pl-[2.12rem] py-3"
        >
          <Image src={iconBoardPurple} alt="board icon" />
          <p className="text-base font-bold capitalize text-main-purple">
            {" "}
            + Create New Board
          </p>
        </button>

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
                className="w-9 h-5 rounded-2xl px-px relative hover:bg-primary bg-main-purple flex items-center cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute ${
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
            className="dark:hover:bg-white py-3 pb-3 pl-6 cursor-pointer flex mt-5 transition ease-in duration-150 delay-150 rounded-tr-full rounded-br-full"
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
        </footer>
      </aside>
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className={`${
          !showSidebar ? "block" : "hidden"
        } cursor-pointer h-12 w-14 bg-main-purple dark:hover:bg-primary transition ease-in duration-150 delay-150 absolute left-full rounded-tr-full rounded-br-full 
            bottom-4 flex items-center justify-center`}
      >
        <Image
          src={iconShowSidebar}
          alt="show sidebar"
          className="object-contain"
        />
      </div>
    </div>
  );
}
