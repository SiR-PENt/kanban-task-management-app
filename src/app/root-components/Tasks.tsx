import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  openDeleteBoardOrTaskModal,
  openTaskDetailsModal,
  closeTaskDetailsModal,
  getTaskDetailsModalValue,
} from "@/components/redux/features/modalSlice";

export interface ISubtask {
    isCompleted: boolean;
    title?: string,
  }
  
interface ITask {
    title: string;
    subtasks: ISubtask[];
    description: string,
    status: string,
  }
  
interface ITasksProps {
    tasks: ITask[];
  }
  
  export default function Tasks({ tasks }: ITasksProps) {

    const dispatch = useAppDispatch()

    const handleOpenModal = (title: string, description: string, subtasks: {[key: string]:any}[], completedSubtasks: number, index: number, status:string) => {
      dispatch(openTaskDetailsModal({title, description, subtasks, completedSubtasks, index, status }))
    }

    return (
        tasks && tasks.map((task, index) => {

          const { title, subtasks, description, status } = task;
          const completedSubtasks = subtasks?.filter((subtask) => subtask?.isCompleted === true).length;
          
          return (
            <div
              onClick={() => handleOpenModal( title, description, subtasks, completedSubtasks, index, status )}
              key={index}
              className="dark:bg-dark-grey p-6 rounded-md mt-6 cursor-pointer">
              <p>{title}</p>
              <p className="text-medium-grey text-xs">{`${completedSubtasks} of ${subtasks.length} subtasks`}</p>
             
            </div>
          );
        })
    );
  }
  