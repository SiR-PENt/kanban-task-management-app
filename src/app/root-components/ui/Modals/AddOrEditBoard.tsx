"use client";

import { ModalBody, CRUDModal } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  getAddOrEditBoardModalValue,
  closeAddOrEditBoardModal,
  getPageTitle,
  getAddOrEditBoardModalVariantValue,
} from "@/components/redux/features/modalSlice";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import React, { useState, useEffect } from "react";
import InputWithLabel from "./components/InputWithLabel";
import Button from "../Button";
import InputWithDeleteIcon from "./components/InputWithDeleteIcon";

interface IAddBoardData {
  name: string;
  columns: {
    name?: string;
    columns?: { name: string; tasks?: { [key: string]: any }[] };
  }[];
}

let addBoardData = {
  name: "",
  columns: [
    {
      name: "",
    },
  ],
};

export default function AddOrEditBoardModal() {
  let { data } = useFetchDataFromDbQuery();
  const modalVariant = useAppSelector(getAddOrEditBoardModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Board";
  const [boardData, setBoardData] = useState<IAddBoardData>();
  const currentBoardTitle = useAppSelector(getPageTitle);
  const [updateBoardToDb] = useUpdateBoardToDbMutation();
  const dispatch = useAppDispatch();

  const isModalOpen = useAppSelector(getAddOrEditBoardModalValue);

  const closeModal = () => dispatch(closeAddOrEditBoardModal());

  useEffect(() => {
    if (data) {
      if (isVariantAdd) {
        setBoardData(addBoardData);
      } else {
        const activeBoard = data[0].boards.find(
          (board: { name: string }) => board.name === currentBoardTitle
        );
        setBoardData(activeBoard);
      }
    }
  }, [data, modalVariant]);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (boardData) {
      const newName = { ...boardData, name: e.target.value };
      setBoardData(newName);
    }
  };

  const handleColumnNameChange = (name: string) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      // handle change for create new board modal
      if (boardData) {
        const modifyColumns = boardData.columns.map(
          (column: { name?: string }) => {
            if (column.name === name) {
              return { ...column, name: e.target.value };
            }
            return column;
          }
        );
        const modifiedColumn = { ...boardData, columns: modifyColumns };
        setBoardData(modifiedColumn);
      }
    };
  };

  const handleAddNewColumn = () => {
    if (boardData && boardData.columns.length < 6) {
      // Make a copy of the existing boardData
      const updatedBoardData = { ...boardData };

      // Create a new column object
      const newColumn = { name: "" };

      // Push the new column to the columns array in the copy
      updatedBoardData.columns = [...updatedBoardData.columns, newColumn];

      // Update the state with the modified copy
      setBoardData(updatedBoardData);
    }
  };

  const handleDeleteColumn = (index: number) => {
    if (boardData) {
      const filteredColumns = boardData.columns.filter(
        (column, columnIndex) => columnIndex !== index
      );
      setBoardData({ ...boardData, columns: filteredColumns });
    }
  };

  const handleAddNewBoardToDb = () => {
    const emptyStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    ); //check if any of the column names is empty
    if (boardData?.name !== "" && !emptyStringChecker) {
      //verify that the board name and none of the column names are empty
      if (data) {
        let [boards] = data;
        const addBoard = [...boards.boards, boardData];
        boards = addBoard;
        updateBoardToDb(boards);
      }
    }
  };

  const handleEditBoard = () => {
    const emptyStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    );
    if (boardData?.name !== "" && !emptyStringChecker) {
      if (data) {
        const [boards] = data;
        const boardsCopy = [...boards.boards]; // create a copy of the data that is not read-only
        const activeBoardIndex = boardsCopy.findIndex(
          (board: { name: string }) => board.name === currentBoardTitle
        );
        const updatedBoard = {
          ...boards.boards[activeBoardIndex],
          name: boardData?.name,
          columns: boardData?.columns,
        };
        boardsCopy[activeBoardIndex] = updatedBoard;
        updateBoardToDb(boardsCopy);
      }
    }
  };

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        {boardData && (
          <>
            <p>{modalVariant}</p>
            <div className="py-6">
              <InputWithLabel
                label="Board Name"
                placeholder="e.g Web Design"
                onChange={handleBoardNameChange}
                value={boardData.name}
              />

              <div className="pt-6">
                <label htmlFor="">Board Column</label>
                {boardData &&
                  boardData.columns.map(
                    (column: { name?: string }, index: number) => {
                      let { name } = column;
                      return (
                        <div key={index} className="pt-2">
                          <InputWithDeleteIcon
                            onChange={(e) => handleColumnNameChange(name!)(e)}
                            onDelete={() => handleDeleteColumn(index)}
                            value={name!}
                            placeholder="e.g Done"
                          />
                        </div>
                      );
                    }
                  )}
                <div className="pt-3">
                  <Button
                    onClick={handleAddNewColumn}
                    intent="primary"
                    text={isVariantAdd ? "+ Add New Board" : "+ Add New Column"}
                  />
                </div>
              </div>
              <div className="pt-6">
                <Button
                  onClick={() => {
                    isVariantAdd ? handleAddNewBoardToDb() : handleEditBoard();
                  }}
                  intent="secondary"
                  text={isVariantAdd ? "Create New Board" : "Save Changes"}
                />
              </div>
            </div>
          </>
        )}
      </ModalBody>
    </CRUDModal>
  );
}
