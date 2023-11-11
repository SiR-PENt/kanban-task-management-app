import { useAppDispatch, useAppSelector } from "@/components/redux/hooks"
import { openAddOrEditBoardModal, openDeleteBoardOrTaskModal, getPageTitle } from "@/components/redux/features/modalSlice"

interface IDropdown {
    show: boolean
}

export default function Dropdown({ show }: IDropdown) {

    const dispatch = useAppDispatch()
    const boardName = useAppSelector(getPageTitle)

    return (
        <div className={`${show ? 'block':'hidden'} dark:bg-very-dark-grey w-48 absolute top-[170%] right-0 py-2 px-4 rounded-2xl`}>
            <div>
            <button 
               onClick={() => dispatch(openAddOrEditBoardModal('Edit Board'))}
            className='text-sm py-2 text-medium-grey'>Edit Board</button>
            </div>
            <div>
            <button 
            onClick={() => dispatch(openDeleteBoardOrTaskModal({ variant:'Delete this board?', name: boardName }))}
            className='text-sm py-2 text-red'>Delete Board</button>
            </div>
        </div>
    )
}