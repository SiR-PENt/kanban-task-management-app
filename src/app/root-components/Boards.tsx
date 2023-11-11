'use client'

import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice"
import { useAppSelector } from "@/components/redux/hooks"
import { getPageTitle } from "@/components/redux/features/modalSlice"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Tasks from "./Tasks"
import Sidebar from "./Sidebar"
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
    
    return  (
        <div className="md:flex h-full">
          <Sidebar/>
         <div className='p-6 w-full overflow-x-auto overflow-y-auto flex space-x-6'>
          {(columns.length > 0) ? (
             columns.map((column, index) => {
               const { name, tasks } = column;
               return (
                 <div key={index} className="w-[17.5rem] shrink-0">
                     <p>{`${name} (${tasks ? tasks?.length : 0})`}</p>
                     <Tasks tasks={tasks!}/>
                 </div>
               )
             })) : (
              <div className='w-full h-full flex justify-center items-center'>
                <div className='flex flex-col items-center'>
                <p className='dark:text-medium-grey text-sm'>This board is empty. Create a new column to get started.</p>
                <button 
                // onClick={() => dispatch(openAddOrEditTaskModal('Add New Task'))}
                className='bg-main-purple text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2'>
                <Image src={addTask} alt='icon-add-task'/>
                <p>Add New Column</p>
                </button>
                </div>
              </div>
             )
          }             
        </div>
         <TaskDetailsModal/>
        </div>
    )
}