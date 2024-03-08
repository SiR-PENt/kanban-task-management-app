import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  openAddOrEditBoardModal,
  openDeleteBoardOrTaskModal,
  openAddOrEditTaskModal,
  getPageTitle,
  closeTaskDetailsModal,
} from "@/components/redux/features/modalSlice";

interface IDropdown {
  show: boolean;
}

export default function BoardDropdown({ show }: IDropdown) {
  const dispatch = useAppDispatch();
  const boardName = useAppSelector(getPageTitle);

  return (
    <div
      className={`${
        show ? "block" : "hidden"
      } dark:bg-very-dark-grey w-48 absolute top-[170%] right-0 py-2 px-4 rounded-2xl`}
    >
      <div>
        <button
          onClick={() => dispatch(openAddOrEditBoardModal("Edit Board"))}
          className="text-sm py-2 text-medium-grey"
        >
          Edit Board
        </button>
      </div>
      <div>
        <button
          onClick={() =>
            dispatch(
              openDeleteBoardOrTaskModal({
                variant: "Delete this board?",
                name: boardName,
              })
            )
          }
          className="text-sm py-2 text-red"
        >
          Delete Board
        </button>
      </div>
    </div>
  );
}
export function TaskDropdown({ show }: IDropdown) {
  const dispatch = useAppDispatch();
//   const boardName = useAppSelector(getPageTitle);

  const openEditTaskModal = () => {
    dispatch(openAddOrEditTaskModal({ variant: "Edit Task", isOpen: true }));
    dispatch(closeTaskDetailsModal())
  }

  return (
    <div
      className={`${
        show ? "block" : "hidden"
      } dark:bg-very-dark-grey w-48 absolute top-[70%] right-0 py-2 px-4 rounded-2xl`}
    >
      <div>
        <button
          // onClick={() => dispatch(openAddOrEditBoardModal('Edit Board'))}
          onClick={openEditTaskModal}
          className="text-sm py-2 text-medium-grey"
        >
          Edit Task
        </button>
      </div>
      <div>
        <button
          // onClick={() => dispatch(openDeleteBoardOrTaskModal({ variant:'Delete this board?', name: boardName }))}
          className="text-sm py-2 text-red"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}
