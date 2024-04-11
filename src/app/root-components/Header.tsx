"use client";

import { useState, useEffect } from "react";
import logo from "../../../public/logo-mobile.svg";
import chevronDown from "../../../public/icon-chevron-down.svg";
import addTask from "../../../public/icon-add-task-mobile.svg";
import ellipsis from "../../../public/icon-vertical-ellipsis.svg";
import Image from "next/image";
import NavModal from "./ui/Modals/navigation-modal/Modal";
import AddOrEditBoardModal from "./ui/Modals/AddOrEditBoard";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  openNavModal,
  getPageTitle,
  openAddOrEditTaskModal,
  getActiveBoardIndex,
} from "@/components/redux/features/modalSlice";
import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice";
import BoardDropdown from "./Dropdown";
import AddOrEditTaskModal from "./ui/Modals/AddOrEditTask";
import DeleteBoardOrTaskModal from "./ui/Modals/DeleteBoardOrTask";
import navbarLogoDark from "../../../public/navbar-logo-dark.png";
import navbarLogoLight from "../../../public/navbar-logo-light.png";
import { useTheme } from "next-themes";

interface Column {
  name: string;
  tasks?: any[]; // Update this type to match your actual data structure
}

export default function MobileNavbar() {
  const dispatch = useAppDispatch();
  const pageTitle = useAppSelector(getPageTitle);
  const currentBoardIndex = useAppSelector(getActiveBoardIndex);
  const openModal = () => dispatch(openNavModal());
  const [show, setShow] = useState<boolean>(false);
  const { data } = useFetchDataFromDbQuery();
  const [columns, setColumns] = useState<Column[]>([]);


  useEffect(() => {
    if (data !== undefined) {
      const [boards] = data;
      if (boards) {
        const activeBoardData = boards.boards.find(
          (board: { name: string }) => board.name === pageTitle
        );
        if (activeBoardData) {
          const { columns } = activeBoardData;
          setColumns(columns);
        }
      }
    }
  }, [data, pageTitle]);

  return (
    <nav className="dark:bg-dark-grey flex h-16 md:hidden items-center px-4 justify-between">
      <div className="flex space-x-4">
        <Image src={logo} alt="logo" className="object-contain" />

        <div
          onClick={openModal}
          className="flex space-x-2 items-center cursor-pointer"
        >
          <p className="text-black dark:text-white text-xl font-bold">
            {pageTitle}
          </p>
          <Image
            src={chevronDown}
            alt="chevron-down"
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            columns.length > 0
              ? dispatch(
                  openAddOrEditTaskModal({
                    variant: "Add New Task",
                    isOpen: true,
                  })
                )
              : "";
          }}
          className={`${
            columns.length > 0 ? "bg-main-purple" : "bg-primary"
          } bg-main-purple px-4 py-2 rounded-2xl`}
        >
          <Image src={addTask} alt="icon-add-task" />
        </button>
        <div className="relative flex items-center">
          <button onClick={() => setShow(!show)}>
            <Image src={ellipsis} alt="icon-vertical-ellipsis" />
          </button>
          <BoardDropdown setShow={setShow} show={show} />
        </div>
      </div>
      <NavModal />
      <AddOrEditBoardModal />
      <AddOrEditTaskModal />
      <DeleteBoardOrTaskModal />
    </nav>
  );
}

export function TabletNavbar() {
  const { theme } = useTheme();
  const pageTitle = useAppSelector(getPageTitle);
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);

  const { data } = useFetchDataFromDbQuery();
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    if (data !== undefined) {
      const [boards] = data;
      if (boards) {
        const activeBoardData = boards.boards.find(
          (board: { name: string }) => board.name === pageTitle
        );
        if (activeBoardData) {
          const { columns } = activeBoardData;
          setColumns(columns);
        }
      }
    }
  }, [data, pageTitle]);

  return (
    <nav className="bg-white dark:bg-dark-grey md:flex hidden h-24 ">
      <div className="flex-none w-[18.75rem] border-r-2 dark:border-lines-dark flex items-center pl-[2.12rem]">
        {theme === "light" ? (
          <Image src={navbarLogoLight} alt="logo" className="object-contain" />
        ) : (
          <Image src={navbarLogoDark} alt="logo" className="object-contain" />
        )}
      </div>

      <div className="border-b-2 dark:border-lines-dark flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-black dark:text-white text-2xl font-bold pl-6">
          {pageTitle ? pageTitle : 'Empty board'}
        </p>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              columns.length > 0
                ? dispatch(
                    openAddOrEditTaskModal({
                      variant: "Add New Task",
                      isOpen: true,
                    })
                  )
                : "";
            }}
            className={`${
              columns.length > 0 ? "bg-main-purple" : "bg-primary"
            }  text-white px-4 py-2 flex rounded-3xl items-center space-x-2`}
          >
            <Image src={addTask} alt="icon-add-task" />
            <p>Add New Task</p>
          </button>
          <div className="relative flex items-center">
            <button onClick={() => setShow(!show)}>
              <Image src={ellipsis} alt="icon-vertical-ellipsis" />
            </button>
            <BoardDropdown show={show} setShow={setShow} />
          </div>
        </div>
      </div>
    </nav>
  );
}
