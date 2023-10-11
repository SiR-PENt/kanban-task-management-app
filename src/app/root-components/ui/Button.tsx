import { cva, VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'rounded-3xl py-2 w-full font-sm',
   {
    variants: {
    intent: {
      primary: 'bg-white text-main-purple',
      secondary:'bg-main-purple text-white',
      danger:'bg-red text-white'
    },
    defaultVariants: {
      intent: 'primary',
    },
    },
   }
)

interface ButtonProps extends VariantProps<typeof buttonStyles>{
   text: string,
}

export default function Button({intent, text, ...props}: ButtonProps) {

  return (
    <button
    className={buttonStyles({intent})}
    {...props}>
      {text}
    </button>
    )
}