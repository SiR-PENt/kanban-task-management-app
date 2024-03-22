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
import { id } from "../../../utils/data";

interface ITaskData {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: { id: string; title: string; isCompleted?: boolean }[];
}

let initialTaskData: ITaskData = {
  id: id(),
  title: "",
  description: "",
  status: "",
  subtasks: [
    {
      id: id(),
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
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [isTaskTitleEmpty, isTaskStatusEmpty, emptySubtaskIndex]);

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) setTaskData({ ...taskData, title: e.target.value });
  };

  const handleTaskDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (taskData) setTaskData({ ...taskData, description: e.target.value });
  };

  const handleSubtaskTitleChange = (id: string) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      // handle change for create new board modal
      if (taskData) {
        const updatedSubtaskTitle = taskData.subtasks.map((subtask) => {
          const { id: subtaskId } = subtask;
          if (subtaskId === id) {
            return { ...subtask, title: e.target.value };
          }
          return subtask;
        });
        setTaskData({ ...taskData, subtasks: updatedSubtaskTitle });
      }
    };
  };

  const handleDeleteSubtask = (id: string) => {
    if (taskData) {
      const deletedSubtask = taskData.subtasks.filter((subtask) => {
        const { id: subtaskId } = subtask;
        return subtaskId !== id;
      });
      setTaskData({ ...taskData, subtasks: deletedSubtask });
    }
  };

  const handleAddNewSubtask = () => {
    const newSubtask = { title: "", isCompleted: false, id: id() };
    if (taskData) {
      setTaskData({
        ...taskData,
        subtasks: [...taskData.subtasks, newSubtask],
      });
    }
  };

  // Handler for task status change
  const handleTaskStatusChange = (e: React.FormEvent<HTMLSelectElement>) => {
     const target = e.target as HTMLSelectElement;
    if (taskData) setTaskData({ ...taskData, status: target.value });
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

    // if all conditions are met
    if (title && !emptySubtaskStringChecker && status != "") {
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
        const addNewTask = [...tasks, { title, status, subtasks, description, id: id() }]; 
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

    if (title && !emptySubtaskStringChecker) {
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
                  return { id:id(), title, status, description, subtasks };
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
              { id: id(), title, status, description, subtasks },
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
        <p className="font-bold text-lg">{modalVariant}</p>
        {taskData && (
          <div className="py-6">
            <div className="relative">
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
              <label className="text-medium-grey text-sm">Description</label>
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
              <label className="text-medium-grey text-sm">Subtasks</label>
              {taskData.subtasks.map(
                (subtask: { title: string; id: string }, index: number) => {
                  const { id, title } = subtask;
                  return (
                    <div className="pt-2 relative" key={id}>
                      <InputWithDeleteIcon
                        value={title}
                        placeholder="e.g Make Coffee"
                        onChange={(e) => handleSubtaskTitleChange(id)(e)}
                        onDelete={() => handleDeleteSubtask(id)}
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
              <p className="mt-3 text-sm text-medium-grey">Status</p>
              <select
                id="status"
                className="outline-none border text-sm rounded-lg block w-full p-2.5 mt-2 placeholder:text-medium-grey border-medium-grey
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
                {taskData.status === "" ? (
                  <option selected value="">
                    Select Status
                  </option>
                ) : (
                  ""
                )}
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
