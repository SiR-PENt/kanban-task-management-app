'use client'

import Modal from "../Modal";
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks'
import { getNavModalValue, closeNavModal, setPageTitle } from '@/components/redux/features/modalSlice'
import iconBoard from '../../../../../public/icon-board.svg'
import iconBoardPurple from '../../../../../public/icon-board-purple.png'
import iconBoardWhite from '../../../../../public/icon-board-white.png'
import Image from "next/image";
import NavFooter from "./Footer";
import { useFetchDataFromDbQuery } from "@/components/redux/features/apiSlice";
import { getUserDetails } from "@/components/redux/features/userSlice";
import { useState, useEffect } from "react";

export default function NavModal() {
   
    const [ active, setActive ] = useState<number>(0)
    const dispatch = useAppDispatch()
    const isNavModalOpen = useAppSelector(getNavModalValue)
    const closeModal = () => dispatch(closeNavModal()) 
    const user = useAppSelector(getUserDetails)
    const { data } = useFetchDataFromDbQuery(user.email)

    const handleNav = (index: number, name: string) => {
       setActive(index)
       dispatch(setPageTitle(name))
    }

    useEffect(() => {
      if(data) {
        console.log(data)
        const activeBoard = data[0]?.boards.find((item:any, index:number) => index === active)
        dispatch(setPageTitle(activeBoard.name))
      }
    }, [data])

    return (
        <Modal isOpen={isNavModalOpen} onRequestClose={closeModal}>  
        {
          data && (
          <div className='py-3 pr-7'>
             <p className="text-medium-grey pl-5 text-[.95rem] font-semibold uppercase pb-3">{`All Boards (${data[0]?.boards.length})`}</p>  
             {
              data[0]?.boards.map((board: {[key:string]: any}, index: number) => {
                const { name } = board
                const isActive = index === active
                return (        
                <div 
                onClick={() => handleNav(index, name)}
                key={index}
                className={`${isActive ? 'bg-main-purple rounded-tr-full rounded-br-full': ''} flex items-center space-x-2 pl-5 py-3 pb-3`}>
                {isActive ? <Image src={iconBoardWhite} alt='active board icon'/> : <Image src={iconBoard} alt='board icon'/> }
                <p className={`${isActive ? 'text-white' : 'text-medium-grey'} text-lg capitalize`}>{name}</p>  
               </div>
                )
              })
             }
             <div className="flex items-center space-x-2 pl-5 py-3">
             <Image src={iconBoardPurple} alt='board icon'/>
             <p className="text-base font-bold capitalize text-main-purple"> + Create New Board</p>  
             </div>

         </div>
          )
        }
        <NavFooter/>        
        </Modal>
    )
}