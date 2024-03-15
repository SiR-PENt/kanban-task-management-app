"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import { TaskDropdown } from "../../Dropdown";
import {
  getPageTitle,
  getTaskDetailsModalValue,
  getTaskDetailsModalTitle,
  getTaskDetailsModalIndex,
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

const override: CSSProperties = {
  display: "block",
  margin: "0",
  borderColor: "white",
};

interface ITaskDetails {
  title: string;
  subtasks: { isCompleted: boolean; title: string }[];
  description: string;
  status: string;
}

export default function TaskDetailsModal() {
  let { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(closeTaskDetailsModal());
  };

  const [show, setShow] = useState<boolean>(false);
  const [taskDetails, setTaskDetails] = useState<ITaskDetails>();
  const [options, setOptions] = useState<[]>();
  const [subtaskIndex, setSubtaskIndex] = useState<number>();
  const isModalOpen = useAppSelector(getTaskDetailsModalValue);
  const currentBoardTitle = useAppSelector(getPageTitle);
  const currentTaskTitle = useAppSelector(getTaskDetailsModalTitle);
  const currentTaskIndex = useAppSelector(getTaskDetailsModalIndex);

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
          .find((task: { title: string }) => task.title === currentTaskTitle);
        setTaskDetails(activeTask);
      }
    }
    return () => setTaskDetails(undefined)
  }, [data, currentTaskTitle, currentBoardTitle]);

  const handleIsCompletedStatus = async (subtaskIndex: number) => {
    setSubtaskIndex(subtaskIndex);
    const { title, status, description, subtasks } = taskDetails!;
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
          (task: any, index: number) => {
            if (index === currentTaskIndex) {
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
              return { title, status, description, subtasks: updatedSubtask };
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

  const handleStatusChange = (e: React.FormEvent<HTMLSelectElement>) => {
    let value = e.target.value;
    const { title, status, description, subtasks } = taskDetails!;
    console.log(taskDetails);
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
            (_task: [], index: number) => index !== currentTaskIndex
          ),
        };
        // update the new column of the task
        const updatedStatusColumn = {
          ...getStatusColumn,
          tasks: [
            ...getStatusColumn?.tasks,
            { title, status: value, description, subtasks },
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
        updateBoardToDb(boardsCopy);
      }
    }
  };

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody className="overflow-hidden">
        {taskDetails && (
          <>
            <div className="relative flex justify-between w-full items-center pb-6">
              <p className="text-lg">{taskDetails?.title}</p>
              <button onClick={() => setShow(!show)}>
                <Image src={ellipsis} alt="icon-vertical-ellipsis" />
              </button>
              <TaskDropdown show={show} />
            </div>
            {taskDetails.description ? (
              <p className="dark:text-medium-grey text-sm leading-6">
                {taskDetails?.description}
              </p>
            ) : (
              <em className="dark:text-medium-grey text-sm">No description</em>
            )}
            <div className="pt-6">
              <p className="text-sm">
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
                        className="mt-4 px-4 py-4 dark:text-medium-grey dark:bg-very-dark-grey w-full flex items-center space-x-4"
                      >
                        {isLoading ? (
                          index === subtaskIndex ? (
                            <ClipLoader
                              color={"#ffffff"}
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
                              className="w-4 h-4 text-blue-600 bg-gray-100
                      dark:border-medium-grey rounded focus:ring-main-purple 
                       dark:focus:ring-main-purple focus:ring-2 dark:bg-dark-grey"
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
                              ? "dark:text-white"
                              : "dark:text-medium-grey"
                          } text-sm`}
                        >
                          {title}
                        </label>
                      </div>
                    );
                  }
                )}
            </div>
            <p className="mt-6 text-sm">Current Status</p>
            <select
              id="status"
              className="outline-none border text-sm rounded-lg block w-full p-2.5 mt-4 placeholder:text-medium-grey border-medium-grey
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
        )}
      </ModalBody>
    </CRUDModal>
  );
}
