import { cva, VariantProps } from "class-variance-authority";
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const buttonStyles = cva("rounded-3xl py-2 w-full text-sm font-bold", {
  variants: {
    intent: {
      primary:
        "bg-light-grey text-main-purple hover:bg-light-hovered transition ease-in duration-150 delay-150",
      secondary:
        "bg-main-purple text-white hover:bg-primary transition ease-in duration-150 delay-150",
      danger:
        "bg-red text-white transition ease-in duration-150 delay-150 hover:bg-light-red",
    },
    defaultVariants: {
      intent: "primary",
    },
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  text: string;
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  isLoading: boolean | null;
}

export default function Button({ intent, text, isLoading, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles({ intent })} {...props}>
      {isLoading ? (
        <ClipLoader
          color={"#ffffff"}
          loading={isLoading}
          cssOverride={override}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        text
      )}
    </button>
  );
}
