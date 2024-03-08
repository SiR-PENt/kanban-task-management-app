interface IInputWithLabel {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}

export default function InputWithLabel({
  label,
  onChange,
  value,
  placeholder,
}: IInputWithLabel) {
  return (
    <div>
      <label>{label}</label>
      <div className="pt-2">
        <input
          className="border border-medium-grey w-full p-2 rounded text-sm hover:border-main-purple cursor-pointer focus:outline-none focus:border-main-purple"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
}
