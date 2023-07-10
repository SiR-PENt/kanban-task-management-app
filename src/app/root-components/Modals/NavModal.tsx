
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks'
import { getNavModalValue, closeNavModal } from '@/components/redux/features/modalSlice'
import iconBoard from '../../../../public/icon-board.svg'
import iconBoardPurple from '../../../../public/icon-board-purple.png'
import iconLightTheme from '../../../../public/icon-light-theme.svg'
import iconDarkTheme from '../../../../public/icon-dark-theme.svg'

import Image from "next/image";

export default function NavModal() {
   

    const dispatch = useAppDispatch()
    const isNavModalOpen = useAppSelector(getNavModalValue)
    const closeModal = () => dispatch(closeNavModal()) 

    return (
        <Modal isOpen={isNavModalOpen} onRequestClose={closeModal}>  
        <div className='py-3 pr-7'>
             <p className="dark:text-medium-grey pl-5 text-lg uppercase">All Boards (3)</p>  
             <div className="flex items-center space-x-2 pl-5 py-3 pb-3">
             <Image src={iconBoard} alt='board icon'/>
             <p className="dark:text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>

             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoard} alt='board icon'/>
             <p className="dark:text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>

             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoard} alt='board icon'/>
             <p className="dark:text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>
             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoardPurple} alt='board icon'/>
             <p className="dark:text-medium-grey text-base font-bold capitalize dark:text-main-purple"> + Create New Board</p>  
             </div>

             <footer className="pl-5 w-full">
             <div className="py-3 rounded-md flex justify-center space-x-2 dark:bg-very-dark-grey w-full">
               <Image src={iconLightTheme} alt='board icon' className="object-contain"/>
                <div className="w-9 h-5 rounded-2xl px-px relative dark:bg-main-purple flex items-center">
                <div className="w-4 h-4 rounded-full bg-white">
                </div>
               </div>
               <Image src={iconDarkTheme} alt='board icon' className="object-contain"/>
                </div>
            </footer>
         </div>
        
        </Modal>
    )
}