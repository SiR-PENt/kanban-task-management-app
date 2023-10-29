import { useAppSelector, useAppDispatch } from '@/components/redux/hooks'
import { getTaskDetailsModalValue, closeTaskDetailsModal } from '@/components/redux/features/modalSlice'
import { CRUDModal, ModalBody } from './Modal'
import { ISubtask } from '../../Tasks'
import { Dispatch, SetStateAction } from 'react';


interface TaskDetailsModal {
    title: string,
    subtasks: ISubtask[],
    description: string,
}

export default function TaskDetailsModal({ title, subtasks, description, }: TaskDetailsModal) {

    const dispatch = useAppDispatch()

    const closeModal = () => {     
        dispatch(closeTaskDetailsModal())
    }

    const isModalOpen = useAppSelector(getTaskDetailsModalValue)

    return (
        <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
            <ModalBody>
                <p className='text-lg'>{title}</p>
                <p>{description}</p>
                <p>{subtasks.length}</p>
            </ModalBody>
        </CRUDModal>
    )
}