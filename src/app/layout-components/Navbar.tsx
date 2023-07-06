import logo from '../../../public/logo-mobile.svg'
import chevronDown from '../../../public/icon-chevron-down.svg'
import addTask from '../../../public/icon-add-task-mobile.svg'
import ellipsis from '../../../public/icon-vertical-ellipsis.svg'
import Image from 'next/image'

export default function Navbar() {

    return (

        <nav className='dark:bg-dark-grey flex h-[4rem] border items-center px-4 justify-between'>
            <div className='flex space-x-4'>
            <Image src={logo} alt='logo' className='object-contain'/>
            <div className='flex space-x-4'>
            <p className='text-black dark:text-white'>Platform Launch</p>
            <Image src={chevronDown} alt='chevron-down' className='object-contain'/>
            </div>
            </div>

            <div className='flex items-center space-x-2'>
            <button className='bg-main-purple px-4 py-2 rounded-md'>
            <Image src={addTask} alt='icon-add-task'/>
            </button>
            <button>
            <Image src={ellipsis} alt='icon-vertical-ellipsis'/>
            </button>
            </div>

        </nav>
    )
}