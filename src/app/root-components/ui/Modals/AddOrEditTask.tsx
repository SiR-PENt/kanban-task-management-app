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
        } 
        else {
          const activeTask = columns
            .map((column: { tasks: [] }) => column.tasks)
            .flat()
            .find((task: { title: string }) => task.title === currentTaskTitle);
          setTaskData(activeTask);
        }
      }
    }
  }, [modalVariant]);

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) setTaskData({ ...taskData, title: e.target.value });
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
    if(taskData) {
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
  const handleTaskStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) setTaskData({ ...taskData, status: e.target.value });
  };

  // handler to add new task to the db
  const handleAddNewTaskToDb = async (e: React.FormEvent<HTMLButtonElement>) => {

    e.preventDefault();
    const { title, status, description, subtasks } = taskData!;

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
    if (title && status && doesStatusExists) {
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
        closeModal()
      }
    }
  };


  const handleEditTaskToDb = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { title, status, description, subtasks } = taskData!;
    if (!title) {
      setIsTaskTitleEmpty(true);
    }
    if (!status) {
      setIsTaskStatusEmpty(true);
    }
    // check if the status input exists among the existing status
    const doesStatusExists = options?.some(
      (option) => option === taskData?.status
    );
    if (!doesStatusExists) {
      setStatusExists(false);
    }
    if (title && status && doesStatusExists) {
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
          closeModal()
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
            tasks: [...getStatusColumn?.tasks, { title, status, description, subtasks }],
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
          closeModal()
        }
      }
    }
  };


  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p>{modalVariant}</p>
        {taskData && (
          <div className="py-6">
            <InputWithLabel
              label="Title"
              value={taskData.title}
              onChange={handleTaskTitleChange}
              placeholder="e.g Take coffee break"
            />

            <div className="pt-6">
              <label>Description</label>
              <div className="pt-2">
                <textarea
                  placeholder="e.g. It's always good to take a break. This fifteen minutes break will recharge the batteries a little"
                  style={{
                    resize: "none",
                  }}
                  className="border border-medium-grey focus:outline-none text-sm 
              hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded h-20"
                />
              </div>
            </div>

            <div className="py-6">
              <label>Subtasks</label>
              {taskData.subtasks.map(
                (subtask: { title: string }, index: number) => {
                  const { title } = subtask;
                  return (
                    <div className="pt-2" key={index}>
                      <InputWithDeleteIcon
                        value={title}
                        placeholder="e.g Make Coffee"
                        onChange={(e) => handleSubtaskTitleChange(index)(e)}
                        onDelete={() => handleDeleteSubtask(index)}
                      />
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

            <div>
              <InputWithLabel
                label="Status"
                value={taskData.status}
                onChange={handleTaskStatusChange}
                placeholder={options?.join(", ")!}
              />

              {/* <label>
                Subtasks
                </label>
             <CustomSelect
              options={options}
              value={taskData.status}
              // onChange={handleStatusChange}
              /> */}
            </div>
            <div className="pt-6">
              <Button
                isLoading={isLoading}
                onClick={(e) => {
                  isVariantAdd ? handleAddNewTaskToDb(e) : handleEditTaskToDb(e)
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
