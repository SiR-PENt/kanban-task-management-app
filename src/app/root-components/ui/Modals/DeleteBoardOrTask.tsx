import { CRUDModal, ModalBody } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  getDeleteBoardOrTaskModalValue,
  closeDeleteBoardOrTaskModal,
  getDeleteBoardOrTaskModalVariantValue,
  getPageTitle,
  getTaskDetailsModalId,
  getTaskDetailsModalStatus,
  getTaskDetailsModalTitle,
  getActiveBoardIndex,
  setActiveBoardIndex,
} from "@/components/redux/features/modalSlice";
import Button from "../Button";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/components/redux/services/apiSlice";


export default function DeleteBoardOrTaskModal() {

  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getDeleteBoardOrTaskModalValue);
  const closeModal = () => dispatch(closeDeleteBoardOrTaskModal());
  const modalVariant = useAppSelector(getDeleteBoardOrTaskModalVariantValue);
  const taskTitle = useAppSelector(getTaskDetailsModalTitle); 
  const currentTaskId = useAppSelector(getTaskDetailsModalId);
  const taskStatus = useAppSelector(getTaskDetailsModalStatus);
  const pageTitle = useAppSelector(getPageTitle);
  const currentBoardIndex = useAppSelector(getActiveBoardIndex);
  let { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  
    const handleDelete = async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (data) {
        if (modalVariant === "Delete this board?") {
          // Implement the logic for deleting the board
          if (pageTitle) {
            //  Assuming data is available, you need to handle the logic to update the data
            const [boards] = data;
            const updatedBoards = boards.boards.filter(
              (board: { name: string }) => board.name !== pageTitle
            );
            await updateBoardToDb(updatedBoards);
            dispatch(setActiveBoardIndex(currentBoardIndex - 1));
            closeModal();
          }
        } else {
          // Implement the logic for deleting a task
          if (currentTaskId !== undefined && taskStatus && pageTitle) {
            const [boards] = data;
            //  Handle the logic to update the tasks
            const updatedBoards = boards.boards.map(
              (board: {
                name: string;
                columns: [{ name: string; tasks: [] }];
              }) => {
                // check the board active board
                if (board.name === pageTitle) {
                  // loop through the columns of the board to find the column in which the task to edit is
                  const updatedColumns = board.columns.map((column) => {
                    if (column.name === taskStatus) {
                      // delete the the task
                      const updatedTasks = column.tasks.filter(
                        (task: { id: string }) => task.id !== currentTaskId
                      );
                      return { ...column, tasks: updatedTasks };
                    }
                    return column;
                  });
                  return { ...board, columns: updatedColumns };
                }
                return board;
              }
            );
            await updateBoardToDb(updatedBoards);
            // find the index of the board recently deleted and reduce it by 1
        
            closeModal();
          }
        }
      }   
    };

    
  return (
    <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="text-red font-bold text-lg">{modalVariant}</p>
        <div className="pt-6">
          <p className="text-sm text-medium-grey leading-6">
            {modalVariant === "Delete this board?"
              ? `Are you sure you want to delete the '${pageTitle}' board? This action will remove all columns
                and tasks and cannot be reversed.`
              : `Are you sure you want to delete the '${taskTitle}' tasks and its subtasks? This action cannot be reversed.`}
          </p>
        </div>
        <div className="pt-6 flex space-x-2">
          <div className="w-1/2">
            <Button
              onClick={handleDelete}
              intent="danger"
              text="Delete"
              isLoading={isLoading}
            />
          </div>
          <div className="w-1/2">
            <Button 
             isLoading={null}
             onClick={closeModal} intent="primary" text="Cancel" />
          </div>
        </div>
      </ModalBody>
    </CRUDModal>
  );
}
