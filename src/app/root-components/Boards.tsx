'use client'

import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice"
import { useAppSelector } from "@/components/redux/hooks"
import { getPageTitle } from "@/components/redux/features/modalSlice"
import { useEffect, useState } from "react"
import Tasks from "./Tasks"
import Sidebar from "./Sidebar"

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
             })) : <p>loading data</p>  
          }             
        </div>
        </div>
    )
}