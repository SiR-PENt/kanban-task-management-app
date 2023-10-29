'use client'

import { useEffect, useState } from 'react'
import { CRUDModal, ModalBody } from './Modal'
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getAddOrEditTaskModalValue, getAddOrEditTaskModalVariantValue, closeAddOrEditTaskModal, getPageTitle} from "@/components/redux/features/modalSlice";
import { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } from "@/components/redux/services/apiSlice";
import InputWithLabel from "./components/InputWithLabel";
import InputWithDeleteIcon from './components/InputWithDeleteIcon'
import Button from "../Button";
import CustomSelect from './components/Select';
import { ActionMeta } from 'react-select'

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
const hey = [
  {label: 'hey', value: 'hey'},
  {label: 'fuck', value: 'fuck'}
]
export default function AddOrEditTaskModal() {

    let { data } = useFetchDataFromDbQuery();

    const [ taskData, setTaskData ] = useState<ITaskData>(initialTask)
    const[ activeBoardData, setActiveBoardData ] = useState()
    const [ options, setOptions ] = useState() 
    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(getAddOrEditTaskModalValue)
    const modalVariant = useAppSelector(getAddOrEditTaskModalVariantValue) 
    const isVariantAdd = modalVariant === 'Add New Task'
    const closeModal = () => dispatch(closeAddOrEditTaskModal()) 
    const currentBoardTitle = useAppSelector(getPageTitle);

    useEffect(() => {
      if(data) {
        const getActiveBoard = data[0].boards.find((board: {name: string}) => board.name === currentBoardTitle)
        setActiveBoardData(getActiveBoard)
        console.log(getActiveBoard)
        const getColumnNames = activeBoardData?.columns.map(column => column.name)
        const options = getColumnNames?.map((name: string) => ({ value: name, label: name}))
        setOptions(options)
      }
    }, [ modalVariant ])

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
    
    const handleStatusChange = (option: string, actionMeta: ActionMeta<string>) => {
      setTaskData({...taskData, status: option});
 
    };

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

           <div className='pt-6'>
           <label>
            Description
            </label>
            <div className='pt-2'>
              <textarea 
              placeholder='e.g. It&aposs always good to take a break. This fifteen minutes break will recharge the batteries a little'
              style={{
                resize: 'none'
              }}
              className='border border-medium-grey focus:outline-none text-sm 
              hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded h-20'/>
            </div>
            </div>

            <div className='py-6'>
            <label>
              Subtasks
            </label>
            { taskData.subtasks.map((subtask: {title: string}, index: number) => {
              const { title } = subtask
              return (
                <div className='pt-2' key={index}>
                <InputWithDeleteIcon
                 value={title}
                 placeholder='e.g Make Coffee'
                 onChange={(e) => handleSubtaskTitleChange(title)(e)}
                 onDelete={() => handleDeleteSubtask(index)}
                 />
                </div>
              )
            })}
               <div className='pt-3'>
                  <Button onClick={handleAddNewSubtask} intent='primary' text={'+ Add New Subtask'}/>
                </div>
            </div>

            <div>
              <label>
                Subtasks
              </label>
              <CustomSelect
              options={options}
              value={taskData.status}
              // onChange={handleStatusChange}
              />
            </div>
            <div className="pt-6">
                <Button intent='secondary' text={isVariantAdd ? 'Create Task': 'Save Changes'}/>
              </div>
          </div>
        </ModalBody>  
      </CRUDModal>
   )

}