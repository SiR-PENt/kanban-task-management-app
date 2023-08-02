
interface IDropdown {
    show: boolean
}

export default function Dropdown({ show }: IDropdown) {
    return (
        <div className={`${show ? 'block':'hidden'} dark:bg-very-dark-grey w-48 absolute top-[170%] right-0 py-2 px-4 rounded-2xl`}>
            <div>
            <button className='text-sm py-2 text-medium-grey'>Edit Board</button>
            </div>
            <div>
            <button className='text-sm py-2 text-red'>Delete Board</button>
            </div>
        </div>
    )
}