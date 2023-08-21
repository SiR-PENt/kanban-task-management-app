'use client'

import logo from '../../../public/logo-mobile.svg'
import chevronDown from '../../../public/icon-chevron-down.svg'
import addTask from '../../../public/icon-add-task-mobile.svg'
import ellipsis from '../../../public/icon-vertical-ellipsis.svg'
import Image from 'next/image'
import NavModal from './Modals/nav-modal/Modal'
import AddBoard from './Modals/AddOrEditBoard'
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks'
import { openNavModal, getPageTitle} from '@/components/redux/features/modalSlice'
import { addBoardColumn } from '../utils/addBoardColumn'
import { useState } from 'react'
import Dropdown from './Dropdown'

export default function Navbar() {

   const dispatch = useAppDispatch()
   const pageTitle = useAppSelector(getPageTitle)
   const openModal = () => dispatch(openNavModal()) 
   const [ show, setShow ] = useState<boolean>(false)

    return (

        <nav className='dark:bg-dark-grey flex h-[4rem] items-center px-4 justify-between'>
            <div className='flex space-x-4'>
            <Image src={logo} alt='logo' className='object-contain'/>

            <div 
             onClick={openModal}
            className='flex space-x-2 items-center cursor-pointer'>
            <p className='text-black dark:text-white text-xl font-bold'>{pageTitle}</p>
            <Image src={chevronDown} alt='chevron-down' className='object-contain'/>
            </div>
            </div>

            <div className='flex items-center space-x-3'>
            <button 
            className='bg-main-purple px-4 py-2 rounded-2xl'>
            <Image src={addTask} alt='icon-add-task'/>
            </button>
            <div className='relative flex items-center'>
            <button onClick={() => setShow(!show)}>
            <Image src={ellipsis} alt='icon-vertical-ellipsis'/>
            </button>
            <Dropdown show={show}/>
            </div>
            </div>
            <NavModal/>
            <AddBoard columns={addBoardColumn}/>
        </nav>
    )
}