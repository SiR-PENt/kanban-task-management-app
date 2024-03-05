import { CSSProperties } from "react";
import { cva, VariantProps } from "class-variance-authority";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const buttonStyles = cva("rounded-3xl py-2 w-full text-sm font-bold", {
  variants: {
    intent: {
      primary: "bg-white text-main-purple",
      secondary: "bg-main-purple text-white",
      danger: "bg-red text-white",
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
