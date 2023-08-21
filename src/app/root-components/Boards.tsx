'use client'

import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice"
import { useAppSelector } from "@/components/redux/hooks"
import { getUserDetails } from "@/components/redux/features/userSlice"
import { getPageTitle } from "@/components/redux/features/modalSlice"
import { useEffect, useState } from "react"
import Tasks from "./Tasks"

interface Column {
  name: string;
  tasks: any[]; // Update this type to match your actual data structure
}

export default function Boards() {
    
    const [ columns, setColumns ] = useState<Column[]>([])
    const user = useAppSelector(getUserDetails)
    const activeBoard = useAppSelector(getPageTitle)
    const { data } = useFetchDataFromDbQuery(user.email)

    useEffect(() => {
      if(data !== undefined) {
        const [ boards ] = data
        if(boards) {
          console.log('boards', boards.boards)
          const activeBoardData = boards.boards.find((board: {name: string}) => board.name === activeBoard)
          if(activeBoardData) {
            const { columns } = activeBoardData
            setColumns(columns)
          }
        }
        console.log(columns)
      }
    }, [ data, activeBoard ])
    
    return  (
        <div className='p-4 border h-full flex space-x-6 overflow-y-auto'>
          {(columns.length > 0) ? (
             columns.map((column, index) => {
               const { name, tasks } = column;
               console.log(tasks)
               return (
                 <div key={index} className="w-[17.5rem] shrink-0">
                     <p>{`${name} (${tasks.length})`}</p>
                     <Tasks tasks={tasks}/>
                 </div>
               )
             })) : <p>loading data</p>  
          }             
        </div>
    )
}