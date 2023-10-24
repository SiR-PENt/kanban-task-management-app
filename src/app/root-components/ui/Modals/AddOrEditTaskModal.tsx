'use client'

import { useEffect, useState } from 'react'
import { CRUDModal, ModalBody } from './Modal'
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getAddOrEditTaskModalValue, getAddOrEditTaskModalVariantValue, closeAddOrEditTaskModal, getPageTitle} from "@/components/redux/features/modalSlice";
import { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } from "@/components/redux/services/apiSlice";
import InputWithLabel from "./components/InputWithLabel";
import InputWithDeleteIcon from './components/InputWithDeleteIcon'
import Button from "../Button";


interface ITaskData {
   title: string,
   description: string,
   status: string,
   subtasks: { title: string, isCompleted?: boolean}[]
}

let initialTask: ITaskData = {
    title: '',
    description: '',
    status: '',
    subtasks: [{
      title: '',
      isCompleted: false,
    }]
} 

export default function AddOrEditTaskModal() {

    let { data } = useFetchDataFromDbQuery();

    const [ taskData, setTaskData ] = useState<ITaskData>(initialTask)
    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(getAddOrEditTaskModalValue)

    const modalVariant = useAppSelector(getAddOrEditTaskModalVariantValue) 
    const isVariantAdd = modalVariant === 'Add New Task'
    const closeModal = () => dispatch(closeAddOrEditTaskModal()) 
    const currentBoardTitle = useAppSelector(getPageTitle);

    useEffect(() => {
      if(data) {
        const activeBoard = data[0].boards.find((board: {name: string}) => board.name === currentBoardTitle)
        console.log(activeBoard)
      }
    }, [modalVariant])

    const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setTaskData({...taskData, title: e.target.value})
    }

    const handleSubtaskTitleChange = (title: string) => { 
      return function (e: React.ChangeEvent<HTMLInputElement>) {
          // handle change for create new board modal     
          const updatedSubtaskTitle = taskData.subtasks.map((subtask: { title: string}) => {
                  if(subtask.title === title) {
                     return { ...subtask, title: e.target.value }
                    }
                     return subtask
                   })
              setTaskData({...taskData, subtasks: updatedSubtaskTitle })
               }              
       }
      
    const handleDeleteSubtask = (index: number) => {
                const deletedSubtask = taskData.subtasks.filter((subtask, subtaskIndex) => subtaskIndex !== index)
                setTaskData({ ...taskData, subtasks: deletedSubtask });  
            }

    const handleAddNewSubtask = () => {
      const newSubtask = { title: '', isCompleted: false,}
      taskData.subtasks.push(newSubtask)
      setTaskData({...taskData, subtasks: taskData.subtasks})
    }
    

   return (
      <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <ModalBody>
          <p>{modalVariant}</p>
          <div className='py-6'>
           <InputWithLabel
           label='Title'
           value={taskData.title}
           onChange={handleTaskTitleChange}
           placeholder='e.g Take coffee break'/>

           <div>
           <label>
            Description
            </label>
            <textarea/>
            </div>

            <div>
            <label>
              Subtasks
            </label>
            {taskData.subtasks.map((subtask: {title: string}, index: number) => {
              const { title } = subtask
              return (
                <InputWithDeleteIcon
                 key={index}
                 value={title}
                 placeholder='e.g Make Coffee'
                 onChange={(e) => handleSubtaskTitleChange(title)(e)}
                 onDelete={() => handleDeleteSubtask(index)}
                 />
              )
            })}
               <div className='pt-3'>
                  <Button onClick={handleAddNewSubtask} intent='primary' text={isVariantAdd ? '+ Add New Subtask': '+ Add New Column'}/>
                </div>

            </div>

          </div>
        </ModalBody>  
      </CRUDModal>
   )

}