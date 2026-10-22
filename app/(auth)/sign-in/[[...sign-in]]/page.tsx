import { SignIn } from "@clerk/nextjs";

import { authAppearance } from "@/components/auth/authAppearance";
import DemoSignInButton from "@/components/auth/DemoSignInButton";

export default function Page() {
  return (
    <>
      <SignIn appearance={authAppearance} />
      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#d8ddd5]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#9aa39d]">
          or
        </span>
        <span className="h-px flex-1 bg-[#d8ddd5]" />
      </div>
      <DemoSignInButton />
    </>
  );
}
