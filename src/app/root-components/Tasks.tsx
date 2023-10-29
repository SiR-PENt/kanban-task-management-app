import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { openDeleteBoardOrTaskModal, openTaskDetailsModal, getTaskDetailsModalValue } from "@/components/redux/features/modalSlice"
import TaskDetailsModal from "./ui/Modals/TaskDetails";

export interface ISubtask {
    isCompleted: boolean;
    title?: string,
  }
  
interface ITask {
    title: string;
    subtasks: ISubtask[];
    description: string,
  }
  
interface ITasksProps {
    tasks: ITask[];
  }
  
  export default function Tasks({ tasks }: ITasksProps) {

    const [ modalIndex, setModalIndex ] = useState<number>()

    const dispatch = useAppDispatch()

    const handleOpenModal = (index: number) => {
       setModalIndex(index)
       dispatch(openTaskDetailsModal())
    }

    const isModalOpen = useAppSelector(getTaskDetailsModalValue)

    useEffect(()=> {
      if (!isModalOpen) {
        setModalIndex(undefined);
      }   
    }, [isModalOpen])
    
    return (
        tasks?.map((task, index) => {

          const { title, subtasks, description } = task;
          const completedSubtasks = subtasks?.filter((subtask) => subtask?.isCompleted === true).length;
  
          return (
            <div 
             onClick={() => handleOpenModal(index)}
             key={index} className='dark:bg-dark-grey p-6 rounded-md mt-6 cursor-pointer'>
              <p>{title}</p>
              <p className="text-medium-grey text-xs">{`${completedSubtasks} of ${subtasks.length} subtasks`}</p>
              {(index === modalIndex) ? <TaskDetailsModal 
              title={title} 
              subtasks={subtasks} 
              description={description} /> : ''}
            </div>
          );
        })
    );
  }
  