"use client";

import { useEffect, useState, useRef } from "react";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import {
  getActiveBoardIndex,
  setPageTitle,
  getPageTitle,
  openAddOrEditBoardModal,
} from "@/components/redux/features/modalSlice";
import Image from "next/image";
import Tasks from "./Tasks";
import addTask from "../../../public/icon-add-task-mobile.svg";
import TaskDetailsModal from "./ui/Modals/TaskDetails";
import { DragDropContext } from "react-beautiful-dnd";
import { useTheme } from "next-themes";
// import Droppable from the custom hook
import { StrictModeDroppable as Droppable } from "./StrictModeDroppable";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export interface ISubtask {
  id: string;
  isCompleted: boolean;
  title?: string;
}

interface ITask {
  id: string;
  title: string;
  subtasks: ISubtask[];
  description: string;
  status: string;
}

interface Column {
  id: string;
  name: string;
  tasks: ITask[]; // Update this type to match your actual data structure
}

export default function Boards() {
  const [columns, setColumns] = useState<Column[]>([]);
  const { theme } = useTheme();
  const currentBoardIndex = useAppSelector(getActiveBoardIndex);
  const pageTitle = useAppSelector(getPageTitle);
  let { data, isLoading } = useFetchDataFromDbQuery();
  const [updateBoardToDb] = useUpdateBoardToDbMutation();
  const initialRender = useRef(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const [boards] = data!;
      if (boards) {
        const activeBoardData = boards.boards.find(
          (_board: { name: string }, index: number) => index === currentBoardIndex
        );
        if (activeBoardData) {
          dispatch(setPageTitle(activeBoardData.name));
          const { columns } = activeBoardData;
          setColumns(columns);
        }
      }
    }
  }, [data, pageTitle ]);

  useEffect(() => {
    // Check if it's the initial render, to avoid sending the data to the backend on mount
    if (!initialRender.current) {
      // Update the backend with the new order
      try {
        if (data) {
          const [boards] = data;
          const boardsCopy = [...boards.boards];
          const updatedBoard = {
            ...boards.boards[currentBoardIndex],
            columns,
          };
          boardsCopy[currentBoardIndex] = updatedBoard;
          updateBoardToDb(boardsCopy);
        }
      } catch (error) {
        // Handle error
        console.error("Error updating board:", error);
      }
    } else {
      // Set initial render to false after the first render
      initialRender.current = false;
    }
  }, [columns]);

  const handleDragEnd = async ({ destination, source }: any) => {
    // Check if the destination is not null (i.e., it was dropped in a valid droppable)
    if (!destination) return;
    // get a deep nested copy of the columns state
    const newColumns = columns.map((column) => ({
      ...column,
      tasks: [...column.tasks], // Create a new array for tasks
    }));
    // Find the source and destination columns based on their droppableIds
    const sourceColumnIndex = newColumns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destinationColumnIndex = newColumns.findIndex(
      (col) => col.id === destination.droppableId
    );
    const destinationColumn = newColumns.find(
      (col) => col.id === destination.droppableId
    );

    // Task that was dragged
    const itemMoved = newColumns[sourceColumnIndex]?.tasks[source.index];

    // Remove from its source
    newColumns[sourceColumnIndex].tasks.splice(source.index, 1);
    // Insert into its destination
    newColumns[destinationColumnIndex].tasks.splice(destination.index, 0, {
      ...itemMoved,
      status: destinationColumn!.name,
    });
    // Update the state
    setColumns(newColumns);
  };

  return (
    <div className="p-6 w-full h-full overflow-x-auto overflow-y-auto">
      {isLoading ? (
        <SkeletonTheme
          baseColor={theme === "dark" ? "#2b2c37" : "#e4ebfa"}
          highlightColor={theme == "dark" ? "#444" : "#F4F7FD"}
        >
          <div className="flex space-x-6">
            {[1, 2, 3, 4].map((number) => {
              return (
                <div key={number}>
                  <Skeleton
                    borderRadius={"0.25rem"}
                    height={80}
                    width={"17.5rem"}
                    count={4}
                  />
                </div>
              );
            })}
          </div>
        </SkeletonTheme>
      ) : (
        <>
          {     
          (data![0]?.boards.length > 0) ? (
            <>
              {(columns.length > 0) ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="flex space-x-6">
                    {columns.map((column, index) => {
                      const { name, tasks, id } = column;
                      return (
                        <div key={index} className="w-[17.5rem] shrink-0">
                          <p>{`${name} (${tasks ? tasks?.length : 0})`}</p>
                          <Droppable droppableId={id}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="h-full"
                              >
                                {tasks &&
                                  (tasks.length > 0 ? (
                                    <Tasks tasks={tasks!} />
                                  ) : (
                                    <div className="mt-6 h-full rounded-md border-dashed border-4 border-medium-grey" />
                                  ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                    })}
                    {columns.length < 7 ? (
                      <div
                        onClick={() =>
                          dispatch(openAddOrEditBoardModal("Edit Board"))
                        }
                        className="cursor-pointer rounded-md bg-light-hovered dark:bg-dark-grey hover:text-main-purple w-[17.5rem] mt-12 shrink-0 flex justify-center items-center shadow-sm"
                      >
                        <p className="font-bold text-2xl">+ New Column</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </DragDropContext>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <p className="dark:text-medium-grey text-sm text-center">
                      This board is empty. Create a new column to get started.
                    </p>
                    <button
                      onClick={() =>
                        dispatch(openAddOrEditBoardModal("Edit Board"))
                      }
                      className="bg-main-purple transition ease-in duration-150 delay-150 dark:hover:bg-primary text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
                    >
                      <Image src={addTask} alt="icon-add-task" />
                      <p>Add New Column</p>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="dark:text-medium-grey text-sm text-center">
                  You haven&apos;t created a board yet. Create a new board to get started.
                </p>
                <button
                  onClick={() =>
                    dispatch(openAddOrEditBoardModal("Add New Board"))
                  }
                  className="bg-main-purple transition ease-in duration-150 delay-150 dark:hover:bg-primary text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
                >
                  <Image src={addTask} alt="icon-add-task" />
                  <p>Create New Board</p>
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <TaskDetailsModal />
    </div>
  );
}
