'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import { TaskDropdown } from "../../Dropdown";
import {
  getPageTitle,
  getTaskDetailsModalValue,
  getTaskDetailsModalTitle,
  getTaskDetailsModalStatus,
  getTaskDetailsModalIndex,
  closeTaskDetailsModal,
} from "@/components/redux/features/modalSlice";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import { CRUDModal, ModalBody } from "./Modal";
import ellipsis from "../../../../../public/icon-vertical-ellipsis.svg";

interface ITaskDetails {
  title: string;
  subtasks: { isCompleted: boolean, title: string }[];
  description: string;
  status: string;
}

export default function TaskDetailsModal() {

  let { data } = useFetchDataFromDbQuery();

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(closeTaskDetailsModal());
  };

  const [show, setShow] = useState<boolean>(false);
  const [taskDetails, setTaskDetails] = useState<ITaskDetails>();
  const [ options, setOptions ] = useState<[]>()
  const isModalOpen = useAppSelector(getTaskDetailsModalValue);
  const currentBoardTitle = useAppSelector(getPageTitle);
  const currentTaskTitle = useAppSelector(getTaskDetailsModalTitle);
  const currentTaskStatus = useAppSelector(getTaskDetailsModalStatus);
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
          .find((task: { title: string }) => task.title === currentTaskTitle)
          setTaskDetails(activeTask);
      }
    }

    return () => setTaskDetails(undefined);

  }, [data, currentTaskTitle])

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
                of {taskDetails?.subtasks?.length})
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
                        <input
                          id={title}
                          type="checkbox"
                          checked={isCompleted}
                          className="w-4 h-4 text-blue-600 bg-gray-100
                    dark:border-medium-grey rounded focus:ring-main-purple 
                     dark:focus:ring-main-purple focus:ring-2 dark:bg-dark-grey"
                        />
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
            >
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}
      </ModalBody>
    </CRUDModal>
  );
}
