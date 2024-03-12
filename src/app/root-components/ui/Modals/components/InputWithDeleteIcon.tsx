import Image from "next/image";
import iconCross from "../../../../../../public/icon-cross.svg";

interface IInputWithDeleteIcon {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onDelete: () => void;
  isError: boolean;
}

export default function InputWithDeleteIcon({
  value,
  onChange,
  onDelete,
  placeholder,
  isError,
}: IInputWithDeleteIcon) {
  return (
    <div className="flex items-center space-x-2">
      <input
        className={`${
          isError ? "border-red" : "border-medium-grey"
        } border focus:outline-none text-sm hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 
        rounded dark:bg-dark-grey placeholder:text-medium-grey placeholder:leading-loose placeholder:text-sm`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <div onClick={onDelete}>
        <Image className="cursor-pointer" src={iconCross} alt="delete" />
      </div>
    </div>
  );
}
