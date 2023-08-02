
interface IButton {
    text: string, 
}

export default function Button({text, }: IButton) {
  return (
    <button className="text-main-purple text-sm p-2 rounded-[1.25rem] bg-white w-full">
        {text}
    </button>
  )
}