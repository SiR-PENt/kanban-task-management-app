import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
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
  

  // console.log(subtasks);
  const isModalOpen = useAppSelector(getTaskDetailsModalValue);
  const title = useAppSelector(getTaskDetailsModalTitle);
  const description = useAppSelector(getTaskDetailsModalDescription);
  const subtasks = useAppSelector(getTaskDetailsModalSubtasks);
  const completedSubtasks = useAppSelector(getTaskDetailsModalCompletedSubtasks);

  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="text-lg pb-6">{title}</p>
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
          {subtasks.length > 0 && (subtasks.map((subtask: {isCompleted: boolean, title: string }, index: number) => {
            const { isCompleted, title } = subtask;

            return (
              <div
                key={index}
                className="mt-4 px-4 py-4 dark:text-medium-grey dark:bg-very-dark-grey w-full">
                <p>{title}</p>
              </div>
            );
          }))}
        </div>
        <p>Current Status</p>

      </ModalBody>
    </CRUDModal>
  );
}
