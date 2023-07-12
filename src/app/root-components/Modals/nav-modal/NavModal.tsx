import Modal from "../Modal";
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks'
import { getNavModalValue, closeNavModal } from '@/components/redux/features/modalSlice'
import iconBoard from '../../../../../public/icon-board.svg'
import iconBoardPurple from '../../../../../public/icon-board-purple.png'
import Image from "next/image";
import NavFooter from "./Footer";

export default function NavModal() {
   

    const dispatch = useAppDispatch()
    const isNavModalOpen = useAppSelector(getNavModalValue)
    const closeModal = () => dispatch(closeNavModal()) 

    return (
        <Modal isOpen={isNavModalOpen} onRequestClose={closeModal}>  
        <div className='py-3 pr-7'>
             <p className="text-medium-grey pl-5 text-[.95rem] font-semibold uppercase">All Boards (3)</p>  

             <div className="flex items-center space-x-2 pl-5 py-3 pb-3 mt-3 bg-main-purple rounded-tr-full rounded-br-full">
             <Image src={iconBoard} alt='board icon'/>
             <p className="text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>

             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoard} alt='board icon'/>
             <p className="text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>

             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoard} alt='board icon'/>
             <p className="text-medium-grey text-lg capitalize">Platform Launch</p>  
             </div>
             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoardPurple} alt='board icon'/>
             <p className="text-base font-bold capitalize text-main-purple"> + Create New Board</p>  
             </div>

         </div>
           <NavFooter/>
        
        </Modal>
    )
}