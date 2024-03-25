"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import { TaskDropdown } from "../../Dropdown";
import {
  getPageTitle,
  getTaskDetailsModalValue,
  getTaskDetailsModalId,
  closeTaskDetailsModal,
} from "@/components/redux/features/modalSlice";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import { CRUDModal, ModalBody } from "./Modal";
import ellipsis from "../../../../../public/icon-vertical-ellipsis.svg";
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { id } from "../../../utils/data";


interface ITaskDetails {
  id: string,
  title: string;
  subtasks: { isCompleted: boolean; title: string }[];
  description: string;
  status: string;
}

export default function TaskDetailsModal() {

  const { theme, } = useTheme();
  
  const override: CSSProperties = {
    display: "block",
    margin: "0",
    borderColor: theme === 'dark' ? "white": "black",
  };


  let { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const dispatch = useAppDispatch();
  
  const closeModal = () => {
    dispatch(closeTaskDetailsModal());
  };
  
  const [ show, setShow ] = useState<boolean>(false);
  const [ taskDetails, setTaskDetails ] = useState<ITaskDetails>();
  const [options, setOptions] = useState<[]>();
  const [subtaskIndex, setSubtaskIndex] = useState<number>();
  const isModalOpen = useAppSelector(getTaskDetailsModalValue);
  const currentBoardTitle = useAppSelector(getPageTitle);
  const currentTaskId = useAppSelector(getTaskDetailsModalId);
 
  useEffect(() => {
    if (data) {
      const getActiveBoard = data[0].boards.find(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      if (getActiveBoard) {
        const { columns } = getActiveBoard;
        const getColumnNames = getActiveBoard.columns.map(
          (column: { name: string }) => column.name
        );
        setOptions(getColumnNames);
        const activeTask = columns
          .map((column: { tasks: [] }) => column.tasks)
          .flat()
          .find((task: { id: string }) => task.id === currentTaskId);
        setTaskDetails(activeTask);
      }
    }
    return () => setTaskDetails(undefined);
  }, [data, currentTaskId, currentBoardTitle]);

  const handleIsCompletedStatus = async (subtaskIndex: number) => {
    setSubtaskIndex(subtaskIndex);
    const { title, status, description, subtasks, id } = taskDetails!;
    if (data) {
      const [boards] = data;
      const boardsCopy = [...boards.boards];
      const activeBoard = boardsCopy.find(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      const activeBoardIndex = boardsCopy.findIndex(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      const { columns } = activeBoard;
      const getStatusColumnIndex = columns?.findIndex(
        (column: { name: string }) => column.name === status
      );

      const updatedStatusColumn = {
        ...columns[getStatusColumnIndex],
        tasks: columns[getStatusColumnIndex]?.tasks?.map(
          (task: {id: string}) => {
            if (task.id === currentTaskId) {
              const updatedSubtask = subtasks.map(
                (
                  subtask: { isCompleted: boolean; title: string },
                  index: number
                ) => {
                  const { isCompleted, title } = subtask;
                  if (index === subtaskIndex) {
                    return { isCompleted: !isCompleted, title };
                  }
                  return subtask;
                }
              );
              return { id, title, status, description, subtasks: updatedSubtask };
            }
            return task;
          }
        ),
      };
      const columnsCopy = [...columns];
      columnsCopy[getStatusColumnIndex] = updatedStatusColumn;
      const updatedBoard = {
        ...boards.boards[activeBoardIndex],
        columns: columnsCopy,
      };
      //update the board in the db
      boardsCopy[activeBoardIndex] = updatedBoard;
      await updateBoardToDb(boardsCopy);
      setSubtaskIndex(undefined);
    }
  };

  const handleStatusChange = async (e: React.FormEvent<HTMLSelectElement>) => {
    let value = (e.target as HTMLSelectElement).value;
    const { title, status, description, subtasks, id } = taskDetails!;
    if (status !== value) {
      if (data) {
        const [boards] = data;
        const boardsCopy = [...boards.boards];

        const activeBoard = boardsCopy.find(
          (board: { name: string }) => board.name === currentBoardTitle
        );

        const activeBoardIndex = boardsCopy.findIndex(
          (board: { name: string }) => board.name === currentBoardTitle
        );

        const { columns } = activeBoard;
        const getStatusColumnIndex = columns?.findIndex(
          (column: { name: string }) => column.name === value
        );

        // Find the column with the name in the task status and append the edited task
        const getStatusColumn = columns?.find(
          (column: { name: string }) => column.name === value
        );

        // delete task from previous column
        const getPrevStatusColumn = columns?.find(
          (column: { name: string }) => column.name === status
        );

        const getPrevStatusColumnIndex = columns?.findIndex(
          (column: { name: string }) => column.name === status
        );

        //update the previous column of the task
        const updatedPrevStatusColumn = {
          ...getPrevStatusColumn,
          tasks: getPrevStatusColumn?.tasks.filter(
            (task: {id : string }, index: number) => task.id !== currentTaskId
          ),
        };
        // update the new column of the task
        const updatedStatusColumn = {
          ...getStatusColumn,
          tasks: [
            ...getStatusColumn?.tasks,
            { id, title, status: value, description, subtasks },
          ],
        };
        const columnsCopy = [...columns];
        columnsCopy[getStatusColumnIndex] = updatedStatusColumn;
        columnsCopy[getPrevStatusColumnIndex] = updatedPrevStatusColumn;
        const updatedBoard = {
          ...boards.boards[activeBoardIndex],
          columns: columnsCopy,
        };
        //update the board in the db
        boardsCopy[activeBoardIndex] = updatedBoard;
        await updateBoardToDb(boardsCopy);
      }
    }
  };

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody className="overflow-hidden">
        {taskDetails ? (
          <>
            <div className="relative flex justify-between w-full items-center pb-6">
              <p className="text-lg font-bold">{taskDetails?.title}</p>
              <button onClick={() => setShow(!show)}>
                <Image src={ellipsis} alt="icon-vertical-ellipsis" />
              </button>
              <TaskDropdown show={show} setShow={setShow} />
            </div>
            {taskDetails.description ? (
              <p className="dark:text-medium-grey text-sm leading-6">
                {taskDetails?.description}
              </p>
            ) : (
              <em className="text-medium-grey text-sm">No description</em>
            )}
            <div className="pt-6">
              <p className="text-sm text-medium-grey">
                Subtasks (
                {
                  taskDetails?.subtasks?.filter(
                    (subtask: { isCompleted: boolean }) =>
                      subtask?.isCompleted === true
                  ).length
                }{" "}
                of {taskDetails.subtasks.length})
              </p>
              {taskDetails.subtasks?.length > 0 &&
                taskDetails.subtasks.map(
                  (
                    subtask: { isCompleted: boolean; title: string },
                    index: number
                  ) => {
                    const { isCompleted, title } = subtask;

                    return (
                      <div
                        key={index}
                        className="mt-4 px-4 py-4 dark:text-medium-grey bg-light-grey dark:bg-very-dark-grey w-full flex 
                        items-center space-x-4 hover:bg-light-hovered dark:hover:bg-main-purple dark:hover:text-white 
                        cursor-pointer transition ease-in duration-150 delay-150"
                      >
                        {isLoading ? (
                          index === subtaskIndex ? (
                            <ClipLoader
                              color={(theme === 'dark') ? "#ffffff": '#000000'}
                              loading={isLoading}
                              cssOverride={override}
                              size={15}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          ) : (
                            <input
                              id={title}
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleIsCompletedStatus(index)}
                              className="w-4 h-4 text-blue-600 bg-white
                      dark:border-medium-grey rounded focus:ring-main-purple 
                       dark:focus:ring-main-purple focus:ring-2 dark:bg-dark-gre"
                            />
                          )
                        ) : (
                          <input
                            id={title}
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleIsCompletedStatus(index)}
                            className="w-4 h-4 text-blue-600 bg-gray-100
                      dark:border-medium-grey rounded focus:ring-main-purple 
                       dark:focus:ring-main-purple focus:ring-2 dark:bg-dark-grey"
                          />
                        )}
                        <label
                          htmlFor={title}
                          className={`${
                            !isCompleted
                              ? "dark:text-white text-black"
                              : "text-medium-grey"
                          } text-sm dark:hover:text-white cursor-pointer w-full`}
                        >
                          {title}
                        </label>
                      </div>
                    );
                  }
                )}
            </div>
            <p className="mt-6 text-sm text-medium-grey">Current Status</p>
            <select
              id="status"
              className="outline-none border text-sm rounded-lg block w-full p-2.5
               mt-4 placeholder:text-medium-grey border-medium-grey
               dark:focus:ring-main-purple dark:focus:border-main-purple dark:bg-dark-grey"
              onChange={(e) => handleStatusChange(e)}
            >
              {options?.map((option) => {
                if (option === taskDetails.status) {
                  return (
                    <option selected={option} key={option} value={option}>
                      {option}
                    </option>
                  );
                }
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </>
        ): <p>Hi</p>}
      </ModalBody>
    </CRUDModal>
  );
}
