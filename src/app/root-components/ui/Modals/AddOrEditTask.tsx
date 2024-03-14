"use client";

import { useEffect, useState } from "react";
import { CRUDModal, ModalBody } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  getAddOrEditTaskModalValue,
  getAddOrEditTaskModalVariantValue,
  closeAddOrEditTaskModal,
  getPageTitle,
  getTaskDetailsModalTitle,
  getTaskDetailsModalStatus,
  getTaskDetailsModalIndex,
} from "@/components/redux/features/modalSlice";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import InputWithLabel from "./components/InputWithLabel";
import InputWithDeleteIcon from "./components/InputWithDeleteIcon";
import Button from "../Button";
import CustomSelect from "./components/Select";
import { ActionMeta } from "react-select";

interface ITaskData {
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; isCompleted?: boolean }[];
}

let initialTaskData: ITaskData = {
  title: "",
  description: "",
  status: "",
  subtasks: [
    {
      title: "",
      isCompleted: false,
    },
  ],
};

export default function AddOrEditTaskModal() {
  let { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const [taskData, setTaskData] = useState<ITaskData>();
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState<boolean>();
  const [emptySubtaskIndex, setEmptySubtaskIndex] = useState<number>();
  const [isTaskStatusEmpty, setIsTaskStatusEmpty] = useState<boolean>();
  const [statusExists, setStatusExists] = useState<boolean>(true);
  const [options, setOptions] = useState<[]>();
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getAddOrEditTaskModalValue);
  const modalVariant = useAppSelector(getAddOrEditTaskModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Task";
  const closeModal = () => dispatch(closeAddOrEditTaskModal());
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

        if (isVariantAdd) {
          setTaskData(initialTaskData);
        } else {
          const activeTask = columns
            .map((column: { tasks: [] }) => column.tasks)
            .flat()
            .find((task: { title: string }) => task.title === currentTaskTitle);
          setTaskData(activeTask);
        }
      }
    }
  }, [modalVariant]);

  // Effect to clear error messages after a 3 secs
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsTaskTitleEmpty(false);
      setIsTaskStatusEmpty(false);
      setEmptySubtaskIndex(undefined);
      setStatusExists(true);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [isTaskTitleEmpty, isTaskStatusEmpty, emptySubtaskIndex, statusExists]);

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) setTaskData({ ...taskData, title: e.target.value });
  };

  const handleTaskDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (taskData) setTaskData({ ...taskData, description: e.target.value });
  };

  const handleSubtaskTitleChange = (index: number) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      // handle change for create new board modal
      if (taskData) {
        const updatedSubtaskTitle = taskData.subtasks.map(
          (subtask, subtaskIndex) => {
            if (subtaskIndex === index) {
              return { ...subtask, title: e.target.value };
            }
            return subtask;
          }
        );
        setTaskData({ ...taskData, subtasks: updatedSubtaskTitle });
      }
    };
  };

  const handleDeleteSubtask = (index: number) => {
    if (taskData) {
      const deletedSubtask = taskData.subtasks.filter(
        (_subtask, subtaskIndex) => subtaskIndex !== index
      );
      setTaskData({ ...taskData, subtasks: deletedSubtask });
    }
  };

  const handleAddNewSubtask = () => {
    const newSubtask = { title: "", isCompleted: false };

    if (taskData) {
      taskData.subtasks.push(newSubtask);
      setTaskData({ ...taskData, subtasks: taskData.subtasks });
    }
  };

  // Handler for task status change
  const handleTaskStatusChange = (e) => {
    if (taskData) setTaskData({ ...taskData, status: e.target.value });
  };

  // handler to add new task to the db
  const handleAddNewTaskToDb = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const { title, status, description, subtasks } = taskData!;

    // check if any of the subtasks has an empty field
    const emptySubtaskStringChecker = subtasks.some(
      (subtask) => subtask.title === ""
    );

    //if any of the column names is empty, update the emptyColumnIndex with its index
    if (emptySubtaskStringChecker) {
      const emptyColumn = subtasks.findIndex((subtask) => subtask.title == "");
      setEmptySubtaskIndex(emptyColumn);
    }

    if (!title) {
      setIsTaskTitleEmpty(true);
    }

    if (!status) {
      setIsTaskStatusEmpty(true);
    }

    // check if the status input exists among the existing columns
    const doesStatusExists = options?.some(
      (option) => option === taskData?.status
    );

    if (!doesStatusExists) {
      setStatusExists(false);
    }

    // if all conditions are met
    if (title && status && doesStatusExists && emptySubtaskIndex) {
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
        // find the column in the board to update
        const getStatusColumn = columns?.find(
          (column: { name: string }) => column.name === status
        );
        const getStatusColumnIndex = columns?.findIndex(
          (column: { name: string }) => column.name === status
        );
        // desctructure tasks in a column. "Now" for example.
        const { tasks } = getStatusColumn;
        const addNewTask = [...tasks, { title, status, subtasks, description }]; //add new task id: id()
        const updatedStatusColumn = { ...getStatusColumn, tasks: addNewTask };
        //update the columns in a board
        const columnsCopy = [...columns];
        columnsCopy[getStatusColumnIndex] = updatedStatusColumn;
        const updatedBoard = {
          ...boards.boards[activeBoardIndex],
          columns: columnsCopy,
        };
        //update the board in the db
        boardsCopy[activeBoardIndex] = updatedBoard;
        await updateBoardToDb(boardsCopy);
        closeModal();
      }
    }
  };

  // function deepEqual(object1: any, object2: any) {
  //   const keys1 = Object.keys(object1);
  //   // const keys2 = Object.keys(object2);
  //   for (const key of keys1) {
  //     const val1 = object1[key];
  //     const val2 = object2[key];
  //     const areArrays = Array.isArray(val1) && Array.isArray(val2);
  //     if (areArrays) {
  //       if (val1.length !== val2.length) {
  //         return false;
  //       }

  //       for (let i = 0; i < val1.length; i++) {
  //         if (!deepEqual(val1[i], val2[i])) {
  //           return false;
  //         }
  //       }
  //     }
  //     if (!areArrays && val1 !== val2) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  const handleEditTaskToDb = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { title, status, description, subtasks } = taskData!;

    if (!title) {
      setIsTaskTitleEmpty(true);
    }

    // check if any of the subtasks has an empty field
    const emptySubtaskStringChecker = subtasks.some(
      (subtask) => subtask.title === ""
    );

    //if any of the column names is empty, update the emptyColumnIndex with its index
    if (emptySubtaskStringChecker) {
      const emptyColumn = subtasks.findIndex((subtask) => subtask.title == "");
      setEmptySubtaskIndex(emptyColumn);
    }

    // check if the status input exists among the existing status
    if (!status) {
      setIsTaskStatusEmpty(true);
    }

    const doesStatusExists = options?.some(
      (option) => option === taskData?.status
    );

    if (!doesStatusExists) {
      setStatusExists(false);
    }

    if (title && status && doesStatusExists && emptySubtaskStringChecker) {
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

        // Check if the task status to edit is equal to the column.name
        if (status === currentTaskStatus) {
          const updatedStatusColumn = {
            ...columns[getStatusColumnIndex],
            tasks: columns[getStatusColumnIndex]?.tasks?.map(
              (task: any, index: number) => {
                if (index === currentTaskIndex) {
                  return { title, status, description, subtasks };
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
          closeModal();
        } else {
          // Find the column with the name in the task status and append the edited task
          const getStatusColumn = columns?.find(
            (column: { name: string }) => column.name === status
          );
          // delete task from previous column
          const getPrevStatusColumn = columns?.find(
            (column: { name: string }) => column.name === currentTaskStatus
          );
          const getPrevStatusColumnIndex = columns?.findIndex(
            (column: { name: string }) => column.name === currentTaskStatus
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
              { title, status, description, subtasks },
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
          closeModal();
        }
      }
    }
  };

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p>{modalVariant}</p>
        {taskData && (
          <div className="py-6 relative">
            <div>
              <InputWithLabel
                label="Title"
                value={taskData.title}
                onChange={handleTaskTitleChange}
                placeholder="e.g Take coffee break"
                isError={isTaskTitleEmpty!}
              />
              {isTaskTitleEmpty ? (
                <p className="text-xs text-red absolute right-2 top-2/3">
                  Can&apos;t be empty
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="pt-6">
              <label>Description</label>
              <div className="pt-2">
                <textarea
                  placeholder="e.g. It's always good to take a break. This fifteen minutes break will recharge the batteries a little"
                  style={{
                    resize: "none",
                  }}
                  value={taskData.description}
                  onChange={handleTaskDescriptionChange}
                  className={`border-medium-grey border focus:outline-none text-sm 
              hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded h-32
               placeholder:text-medium-grey placeholder:text-sm placeholder:leading-loose dark:bg-dark-grey`}
                />
              </div>
            </div>

            <div className="py-6">
              <label>Subtasks</label>
              {taskData.subtasks.map(
                (subtask: { title: string }, index: number) => {
                  const { title } = subtask;
                  return (
                    <div className="pt-2 relative" key={index}>
                      <InputWithDeleteIcon
                        value={title}
                        placeholder="e.g Make Coffee"
                        onChange={(e) => handleSubtaskTitleChange(index)(e)}
                        onDelete={() => handleDeleteSubtask(index)}
                        isError={emptySubtaskIndex === index}
                      />

                      {emptySubtaskIndex === index ? (
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
              <div className="pt-3">
                <Button
                  isLoading={null}
                  onClick={handleAddNewSubtask}
                  intent="primary"
                  text={"+ Add New Subtask"}
                />
              </div>
            </div>

            <div className="relative">
              <p className="mt-6 text-sm">Current Status</p>
              <select
                id="status"
                className="outline-none border text-sm rounded-lg block w-full p-2.5 mt-4 placeholder:text-medium-grey border-medium-grey
               dark:focus:ring-main-purple dark:focus:border-main-purple dark:bg-dark-grey"
                onChange={(e) => handleTaskStatusChange(e)}
              >
                {options?.map((option) => {
                  if (option === taskData.status) {
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
            </div>
            <div className="pt-6">
              <Button
                isLoading={isLoading}
                onClick={(e) => {
                  isVariantAdd
                    ? handleAddNewTaskToDb(e)
                    : handleEditTaskToDb(e);
                }}
                intent="secondary"
                text={isVariantAdd ? "Create Task" : "Save Changes"}
              />
            </div>
          </div>
        )}
      </ModalBody>
    </CRUDModal>
  );
}
