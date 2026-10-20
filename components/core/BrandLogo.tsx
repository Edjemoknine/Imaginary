import Image from "next/image";

type BrandLogoProps = {
  size?: "landing" | "dashboard" | "footer";
};

const sizeClasses = {
  landing: {
    icon: "h-9 w-9",
    gap: "gap-2.5",
    text: "text-[17px]",
  },
  dashboard: {
    icon: "h-10 w-10",
    gap: "gap-2.5",
    text: "text-lg",
  },
  footer: {
    icon: "h-5 w-5",
    gap: "gap-2",
    text: "text-sm",
  },
};

export default function BrandLogo({ size = "dashboard" }: BrandLogoProps) {
  const classes = sizeClasses[size];

  return (
    <span className={`inline-flex shrink-0 items-center ${classes.gap}`}>
      <Image
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        priority
        className={`block ${classes.icon}`}
      />
      <span className={`${classes.text} font-semibold tracking-tight text-white`}>Eido</span>
    </span>
  );
}
