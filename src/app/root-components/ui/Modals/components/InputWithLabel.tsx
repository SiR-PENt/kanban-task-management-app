interface IInputWithLabel {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  isError: boolean;
}

export default function InputWithLabel({
  label,
  onChange,
  value,
  placeholder,
  isError
}: IInputWithLabel) {
  return (
    <div>
      <label className="text-medium-grey text-sm">{label}</label>
      <div className="pt-2">
        <input
          className={`${
            isError ? "border-red" : "border-medium-grey"
          } border w-full p-2 rounded text-sm hover:border-main-purple cursor-pointer focus:outline-none focus:border-main-purple dark:bg-dark-grey
        placeholder:text-medium-grey placeholder:text-sm`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
}
