"use client";

import { ModalBody, CRUDModal } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  getAddOrEditBoardModalValue,
  closeAddOrEditBoardModal,
  getPageTitle,
  getAddOrEditBoardModalVariantValue,
  setActiveBoardIndex,
  getActiveBoardIndex,
} from "@/components/redux/features/modalSlice";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import React, { useState, useEffect } from "react";
import InputWithLabel from "./components/InputWithLabel";
import Button from "../Button";
import InputWithDeleteIcon from "./components/InputWithDeleteIcon";
import { id } from "../../../utils/data";
import { getSession } from "next-auth/react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/components/app/utils/firebase";
import { data } from "../../../utils/data";

interface IAddBoardData {
  id: string;
  name: string;
  columns: {
    id: string;
    name?: string;
    columns?: { name: string; tasks?: { [key: string]: any }[] };
  }[];
}

let addBoardData = {
  id: id(),
  name: "",
  columns: [
    {
      id: id(),
      name: "",
      tasks: [],
    },
  ],
};

export default function AddOrEditBoardModal() {
  let { data: storeData } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const modalVariant = useAppSelector(getAddOrEditBoardModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Board";
  const [allBoards, setAllBoards] = useState<string[]>();
  const [boardData, setBoardData] = useState<IAddBoardData>();

  // check if the board name field is empty
  const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false);
  // will be used to check if any of the board column field is empty
  const [emptyColumnIndex, setEmptyColumnIndex] = useState<number>();
  // check if the board already exists before adding
  const [boardAlreadyExistsChecker, setBoardAlreadyExistsChecker] =
    useState<boolean>(false);

  const currentBoardTitle = useAppSelector(getPageTitle);
  const currentBoardIndex = useAppSelector(getActiveBoardIndex);
  const dispatch = useAppDispatch();

  const isModalOpen = useAppSelector(getAddOrEditBoardModalValue);

  const closeModal = () => dispatch(closeAddOrEditBoardModal());

  useEffect(() => {
    if (storeData) {
      const [boards] = storeData;
      if (boards) {
        const activeBoards = boards.boards.map(
          (board: { name: string }) => board.name
        );
        setAllBoards(activeBoards);
      }

      if (isVariantAdd) {
        setBoardData(addBoardData);
      } else {
        const activeBoard = storeData[0]?.boards.find(
          (_board: { name: string }, index: number) =>
            index === currentBoardIndex
        );
        setBoardData(activeBoard);
      }
    }
  }, [storeData, modalVariant, currentBoardIndex]);

  // Effect to clear error messages after a 3 secs
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsBoardNameEmpty(false);
      setEmptyColumnIndex(undefined);
      setBoardAlreadyExistsChecker(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [emptyColumnIndex, isBoardNameEmpty, boardAlreadyExistsChecker]);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (boardData) {
      const newName = { ...boardData, name: e.target.value };
      setBoardData(newName);
    }
  };

  const handleColumnNameChange = (id: string) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      // handle change for create new board modal
      if (boardData) {
        const modifyColumns = boardData.columns.map((column) => {
          const { id: columnId } = column;
          if (columnId === id) {
            return { ...column, name: e.target.value };
          }
          return column;
        });
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
      const newColumn = { id: id(), name: "", tasks: [] };

      // Push the new column to the columns array in the copy
      updatedBoardData.columns = [...updatedBoardData.columns, newColumn];

      // Update the state with the modified copy
      setBoardData(updatedBoardData);
    }
  };

  const handleDeleteColumn = (id: string) => {
    if (boardData) {
      const filteredColumns = boardData.columns.filter((column) => {
        const { id: columnId } = column;
        return columnId !== id;
      });
      setBoardData({ ...boardData, columns: filteredColumns });
    }
  };

  const handleAddNewBoardToDb = async () => {
    //condition to run if the board name is empty
    if (boardData?.name === "") {
      setIsBoardNameEmpty(true);
    }

    // check if any of the column has an empty field
    const emptyColumnStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    );

    //if any of the column names is empty, update the emptyColumnIndex with its index
    if (emptyColumnStringChecker) {
      const emptyColumn = boardData?.columns.findIndex(
        (column) => column.name == ""
      );
      setEmptyColumnIndex(emptyColumn);
    }

    //  check if the board already exists
    const boardAlreadyExists = allBoards?.some(
      (board) => board === boardData?.name
    );
    if (boardAlreadyExists) {
      setBoardAlreadyExistsChecker(true);
    }

    //verify that the board name and none of the column names are empty
    if (
      boardData?.name !== "" &&
      !emptyColumnStringChecker &&
      !boardAlreadyExists
    ) {
      const session = await getSession();
      if (session) {
        const { user } = session;
        if (user) {
          const docRef = collection(db, `users/${user.email}/tasks`);
          const getDos = await getDocs(docRef);
  
          if (getDos.docs.length > 0) {
            if (storeData) {
              let [boards] = storeData;
              const addBoard = [...boards.boards, boardData];
              boards = addBoard;
              console.log(boards)
              await updateBoardToDb(boards);
              if(currentBoardIndex === 0) dispatch(setActiveBoardIndex(currentBoardIndex));
              // find the index of the board recently added and it to the store
              else {
                dispatch(setActiveBoardIndex(currentBoardIndex + 1));
              }
              closeModal();
            }
          } else {
            try {
              await addDoc(docRef, data);
              const querySnapshot = await getDocs(docRef);
              let boardsFromDb = querySnapshot.docs.map((doc) => {
                return doc.data();
              });
              storeData = boardsFromDb;
              let [boards] = storeData;
              const addBoard = [...boards.boards, boardData];
              boards = addBoard;
              await updateBoardToDb(boards);
              // find the index of the board recently added and it to the store
              dispatch(setActiveBoardIndex(0));
              closeModal();
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }
        }
        // setGetUser(session.user);
      }
    }
  };

  // function to compare prev storeData with new one before sending to the BE

  function deepEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    // const keys2 = Object.keys(object2);
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areArrays = Array.isArray(val1) && Array.isArray(val2);
      if (areArrays) {
        if (val1.length !== val2.length) {
          return false;
        }

        for (let i = 0; i < val1.length; i++) {
          if (!deepEqual(val1[i], val2[i])) {
            return false;
          }
        }
      }
      if (!areArrays && val1 !== val2) {
        return false;
      }
    }
    return true;
  }

  const handleEditBoard = async () => {
    //condition to run if the board name is empty
    if (boardData?.name === "") {
      setIsBoardNameEmpty(true);
    }

    const emptyColumnStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    );

    //if any of the column names is empty, update the emptyColumnIndex with its index
    if (emptyColumnStringChecker) {
      const emptyColumn = boardData?.columns.findIndex(
        (column) => column.name == ""
      );
      setEmptyColumnIndex(emptyColumn);
    }

    if (storeData) {
      const [boards] = storeData;
      const boardsCopy = [...boards.boards]; // create a copy of the storeData that is not read-only
      const activeBoardIndex = boardsCopy.findIndex(
        (board: { name: string }) => board.name === currentBoardTitle
      );

      const activeBoard = { ...boards.boards[activeBoardIndex] };
      const isTheSame = deepEqual(boardData, activeBoard);

      if (boardData?.name !== "" && !emptyColumnStringChecker && !isTheSame) {
        const updatedBoard = {
          ...boards.boards[activeBoardIndex],
          name: boardData?.name,
          columns: boardData?.columns,
        };
        boardsCopy[activeBoardIndex] = updatedBoard;
        await updateBoardToDb(boardsCopy);
        closeModal();
      }
    }
  };

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        {boardData && (
          <>
            <p className="font-bold text-lg">{modalVariant}</p>
            <div className="py-6">
              <div className="relative">
                <InputWithLabel
                  label="Board Name"
                  placeholder="e.g Web Design"
                  onChange={handleBoardNameChange}
                  value={boardData.name}
                  isError={isBoardNameEmpty || boardAlreadyExistsChecker}
                />

                {/* display this error if the board name is empty or if the board already exists */}
                {isBoardNameEmpty ? (
                  <p className="text-xs text-red absolute right-2 top-2/3">
                    Can&apos;t be empty
                  </p>
                ) : boardAlreadyExistsChecker ? (
                  <p className="text-xs text-red absolute right-2 top-2/3">
                    Board already exists
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="pt-6">
                {boardData.columns.length > 0 ? (
                  <>
                    <label className="text-medium-grey text-sm" htmlFor="">
                      Board Column
                    </label>
                    {boardData &&
                      boardData.columns.map(
                        (
                          column: { name?: string; id: string },
                          index: number
                        ) => {
                          let { name, id } = column;
                          return (
                            <div key={index} className="pt-2 relative">
                              <InputWithDeleteIcon
                                onChange={(e) => handleColumnNameChange(id)(e)}
                                onDelete={() => handleDeleteColumn(id)}
                                value={name!}
                                placeholder="e.g Done"
                                isError={emptyColumnIndex === index}
                              />
                              {/* display this error if the board name is empty */}
                              {emptyColumnIndex === index ? (
                                <p className="text-xs text-red absolute right-8 top-1/2">
                                  Can&apos;t be empty
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        }
                      )}
                  </>
                ) : (
                  ""
                )}
                <div className="pt-3">
                  <Button
                    onClick={handleAddNewColumn}
                    isLoading={null}
                    intent="primary"
                    text={"+ Add New Column"}
                  />
                </div>
              </div>
              <div className="pt-6">
                <Button
                  onClick={() => {
                    isVariantAdd ? handleAddNewBoardToDb() : handleEditBoard();
                  }}
                  isLoading={isLoading}
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
