"use client";

import { useState, useEffect } from "react";
import Modal from "../Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  getNavModalValue,
  closeNavModal,
  setPageTitle,
  getActiveBoardIndex,
  setActiveBoardIndex,
} from "@/components/redux/features/modalSlice";
import iconBoard from "../../../../../../public/icon-board.svg";
import iconBoardPurple from "../../../../../../public/icon-board-purple.png";
import iconBoardWhite from "../../../../../../public/icon-board-white.png";
import Image from "next/image";
import NavModalFooter from "./Footer";
import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice";
import { openAddOrEditBoardModal } from "@/components/redux/features/modalSlice";

export default function NavModal() {
  const dispatch = useAppDispatch();
  const isNavModalOpen = useAppSelector(getNavModalValue);
  const closeModal = () => dispatch(closeNavModal());
  const { data } = useFetchDataFromDbQuery();

  const handleNav = (index: number, name: string) => {
    dispatch(setActiveBoardIndex(index));
    dispatch(setPageTitle(name));
  };

  const currentBoardIndex = useAppSelector(getActiveBoardIndex)

  useEffect(() => {
    if (data) {
      const activeBoard = data[0]?.boards.find(
        (_item: any, index: number) => index === currentBoardIndex
      );
      dispatch(setPageTitle(activeBoard?.name));
    }
  }, [ data, currentBoardIndex ]);

  return (
    <Modal isOpen={isNavModalOpen} onRequestClose={closeModal}>
      {data && (
        <div className="w-[16.5rem] py-3 pr-7">
          <p className="text-medium-grey pl-5 text-[.95rem] font-semibold uppercase pb-3">
            {`All Boards (${data[0]?.boards.length})`}
          </p>
          {data[0]?.boards.map(
            (board: { [key: string]: any }, index: number) => {
              const { name } = board;
              const isActive = index === currentBoardIndex;
              return (
                <div
                  onClick={() => handleNav(index, name)}
                  key={index}
                  className={`${
                    isActive
                      ? "bg-main-purple rounded-tr-full rounded-br-full"
                      : ""
                  } cursor-pointer flex items-center space-x-2 pl-5 py-3 pb-3`}
                >
                  {isActive ? (
                    <Image src={iconBoardWhite} alt="active board icon" />
                  ) : (
                    <Image src={iconBoard} alt="board icon" />
                  )}
                  <p
                    className={`${
                      isActive ? "text-white" : "text-medium-grey"
                    } text-lg capitalize`}
                  >
                    {name}
                  </p>
                </div>
              );
            }
          )}
          <button
            onClick={() => dispatch(openAddOrEditBoardModal("Add New Board"))}
            className="flex items-center space-x-2 pl-5 py-3"
          >
            <Image src={iconBoardPurple} alt="board icon" />
            <p className="text-base font-bold capitalize text-main-purple">
              {" "}
              + Create New Board
            </p>
          </button>
        </div>
      )}
      <NavModalFooter />
    </Modal>
  );
}
