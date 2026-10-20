import { SignUp } from "@clerk/nextjs";

import { authAppearance } from "@/components/auth/authAppearance";

export default function Page() {
  return <SignUp appearance={authAppearance} />;
}
