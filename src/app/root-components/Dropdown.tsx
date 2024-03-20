import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import {
  openAddOrEditBoardModal,
  openDeleteBoardOrTaskModal,
  openAddOrEditTaskModal,
  closeTaskDetailsModal,
} from "@/components/redux/features/modalSlice";
import { Dispatch, SetStateAction } from "react";

interface IDropdown {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function BoardDropdown({ show, setShow }: IDropdown) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, setShow]);

  const dispatch = useAppDispatch();

  const openEditBoard = () => {
    dispatch(openAddOrEditBoardModal("Edit Board"));
    setShow(!show);
  };

  const openDeleteBoard = () => {
    dispatch(
      openDeleteBoardOrTaskModal({
        variant: "Delete this board?",
      })
    );
    setShow(!show);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${
        show ? "block" : "hidden"
      } dark:bg-very-dark-grey bg-white shadow-sm w-48 absolute top-[170%] right-0 py-2 px-4 rounded-2xl`}
    >
      <div>
        <button
          onClick={openEditBoard}
          className="text-sm py-2 text-medium-grey"
        >
          Edit Board
        </button>
      </div>
      <div>
        <button onClick={openDeleteBoard} className="text-sm py-2 text-red">
          Delete Board
        </button>
      </div>
    </div>
  );
}

export function TaskDropdown({ show, setShow }: IDropdown) {
  const dispatch = useAppDispatch();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, setShow]);

  const openEditTaskModal = () => {
    dispatch(openAddOrEditTaskModal({ variant: "Edit Task", isOpen: true }));
    dispatch(closeTaskDetailsModal());
    setShow(!show)
  };

  const openDeleteTaskModal = () => {
    dispatch(
      openDeleteBoardOrTaskModal({ variant: "Delete this task?", isOpen: true })
    );
    dispatch(closeTaskDetailsModal());
    setShow(!show);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${
        show ? "block" : "hidden"
      } dark:bg-very-dark-grey w-48 bg-white shadow-lg absolute top-[70%] right-0 py-2 px-4 rounded-2xl`}
    >
      <div>
        <button
          onClick={openEditTaskModal}
          className="text-sm py-2 text-medium-grey"
        >
          Edit Task
        </button>
      </div>
      <div>
        <button onClick={openDeleteTaskModal} className="text-sm py-2 text-red">
          Delete Task
        </button>
      </div>
    </div>
  );
}
