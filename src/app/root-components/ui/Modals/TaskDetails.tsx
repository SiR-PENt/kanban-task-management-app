import { useState } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import { TaskDropdown } from '../../Dropdown';
import {
  getTaskDetailsModalValue,
  getTaskDetailsModalTitle,
  getTaskDetailsModalDescription,
  getTaskDetailsModalSubtasks,
  getTaskDetailsModalCompletedSubtasks,
  closeTaskDetailsModal,
} from "@/components/redux/features/modalSlice"; 

import { CRUDModal, ModalBody } from "./Modal";
import { ISubtask } from "../../Tasks";
import { Dispatch, SetStateAction } from "react";
import ellipsis from '../../../../../public/icon-vertical-ellipsis.svg';

interface TaskDetailsModal {
  title: string;
  subtasksData: { completedSubtasks: number; subtasks: ISubtask[] };
  description: string;
}

export default function TaskDetailsModal() {

  const dispatch = useAppDispatch();

  const closeModal = () => {
     dispatch(closeTaskDetailsModal());
  }

  const [show, setShow] = useState<boolean>(false);
  const [options, setOptions] = useState<[]>();
  const isModalOpen = useAppSelector(getTaskDetailsModalValue);
  const title = useAppSelector(getTaskDetailsModalTitle);
  const description = useAppSelector(getTaskDetailsModalDescription);
  const subtasks = useAppSelector(getTaskDetailsModalSubtasks);
  const completedSubtasks = useAppSelector(getTaskDetailsModalCompletedSubtasks);

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody className='overflow-hidden'>
        <div className="relative flex justify-between w-full items-center pb-6">
          <p className="text-lg">{title}</p>
          <button onClick={() => setShow(!show)}>
            <Image src={ellipsis} alt="icon-vertical-ellipsis" />
          </button>
          <TaskDropdown show={show} />
        </div>
        {description ? (
          <p className="dark:text-medium-grey text-sm leading-6">
            {description}
          </p>
        ) : (
          <em className="dark:text-medium-grey text-sm">No description</em>
        )}
        <div className="pt-6">
          <p className="text-sm">
            Subtasks ({completedSubtasks} of {subtasks.length})
          </p>
          {subtasks.length > 0 &&
            subtasks.map(
              (
                subtask: { isCompleted: boolean; title: string },
                index: number
              ) => {
                const { isCompleted, title } = subtask;

                return (
                  <div
                    key={index}
                    className="mt-4 px-4 py-4 dark:text-medium-grey dark:bg-very-dark-grey w-full"
                  >
                    <p>{title}</p>
                  </div>
                );
              }
            )}
        </div>
        <p className='mt-6 text-sm'>Current Status</p>
        <select className='w-full dark:bg-dark-grey p-2 mt-2 outline-none dark:border-red'>
         <option>Doing</option>
         <option>Hey</option>
         <option>Doing</option>
        </select>
      </ModalBody>
    </CRUDModal>
  );
}
