'use client'

import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice"
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks"
import { getPageTitle, openAddOrEditBoardModal } from "@/components/redux/features/modalSlice"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Tasks from "./Tasks"
import addTask from '../../../public/icon-add-task-mobile.svg'
import TaskDetailsModal from "./ui/Modals/TaskDetails"

interface Column {
  name: string;
  tasks?: any[]; // Update this type to match your actual data structure
}

export default function Boards() {
    
    const [ columns, setColumns ] = useState<Column[]>([])
    const activeBoard = useAppSelector(getPageTitle)
    const { data } = useFetchDataFromDbQuery()

    const dispatch = useAppDispatch();

    useEffect(() => {
      if(data !== undefined) {
        const [ boards ] = data
        if(boards) {
          console.log(boards)
          const activeBoardData = boards.boards.find((board: {name: string}) => board.name === activeBoard)
          if(activeBoardData) {
            const { columns } = activeBoardData
            setColumns(columns)
          }
        }
      }
    }, [ data, activeBoard ])
    
    return (
      <div className="p-6 w-full overflow-x-auto overflow-y-auto">
        {columns.length > 0 ? (
          <div className="flex space-x-6">
            {columns.map((column, index) => {
              const { name, tasks } = column;
              return (
                <div key={index} className="w-[17.5rem] shrink-0">
                  <p>{`${name} (${tasks ? tasks?.length : 0})`}</p>
                  {tasks &&
                    (tasks.length > 0 ? (
                      <Tasks tasks={tasks!} />
                    ) : (
                      <div className="mt-6 h-full rounded-md border-dashed border-4 border-medium-grey" />
                    ))}
                </div>
              );
            })}
            {columns.length < 7 ? (
              <div
                 onClick={() => dispatch(openAddOrEditBoardModal("Edit Board"))}
                className="rounded-md dark:bg-dark-grey w-[17.5rem] mt-12 shrink-0 flex justify-center items-center"
              >
                <p className="cursor-pointer font-bold text-medium-grey text-2xl">
                  + New Column
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center">
              <p className="dark:text-medium-grey text-sm">
                This board is empty. Create a new column to get started.
              </p>
              <button
                onClick={() => dispatch(openAddOrEditBoardModal("Edit Board"))}
                className="bg-main-purple text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
              >
                <Image src={addTask} alt="icon-add-task" />
                <p>Add New Column</p>
              </button>
            </div>
          </div>
        )}
        <TaskDetailsModal />
      </div>
    );
}