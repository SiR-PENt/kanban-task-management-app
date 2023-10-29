import { CRUDModal, ModalBody } from './Modal'
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getDeleteBoardOrTaskModalValue, closeDeleteBoardOrTaskModal,
     getDeleteBoardOrTaskModalVariantValue, getDeleteBoardOrTaskModalNameValue } from "@/components/redux/features/modalSlice";
import Button from '../Button';


export default function DeleteBoardOrTaskModal() {

    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(getDeleteBoardOrTaskModalValue)
    const closeModal = () => dispatch(closeDeleteBoardOrTaskModal()) 
    const modalVariant = useAppSelector(getDeleteBoardOrTaskModalVariantValue) 
    const modalOrTaskName = useAppSelector(getDeleteBoardOrTaskModalNameValue) 

    return (
        <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
           <ModalBody>
             <p className='text-red font-bold text-lg'>{modalVariant}</p>
             <div className='pt-6'>
              <p className='text-sm text-medium-grey leading-6'>
                 { (modalVariant === 'Delete this board?')
               ? `Are you sure you want to delete the '${modalOrTaskName}' board? This action will remove all columns
                and tasks and cannot be reversed.`: 
                `Are you sure you want to delete the '${modalOrTaskName}' tasks and its subtasks? This action cannot be reversed.`}
              </p>           
             </div>
             <div className='pt-6 flex space-x-2'>
                <div className='w-1/2'>
                 <Button intent='danger' text='Delete' />
                </div>
                <div className='w-1/2'>
                <Button onClick={closeModal} intent='primary' text='Cancel'/>
                </div>
             </div>
           </ModalBody>
        </CRUDModal>
    )
}