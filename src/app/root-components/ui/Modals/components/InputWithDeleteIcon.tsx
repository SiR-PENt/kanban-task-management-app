
import Image from 'next/image';
import iconCross from '../../../../../../public/icon-cross.svg'

interface IInputWithDeleteIcon {
   value: string,
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
   placeholder: string,
   onDelete: () => void,
}

export default function InputWithDeleteIcon ({ value, onChange, onDelete, placeholder }: IInputWithDeleteIcon) {
    
  return (
    <div className='flex items-center space-x-2'>
      <input
        className="border border-medium-grey focus:outline-none text-sm hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <div onClick={onDelete}>
        <Image className="cursor-pointer" src={iconCross} alt="delete" />
      </div>
    </div>
  );
};


