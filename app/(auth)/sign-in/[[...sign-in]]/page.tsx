import { SignIn } from "@clerk/nextjs";

import { authAppearance } from "@/components/auth/authAppearance";

export default function Page() {
  return <SignIn appearance={authAppearance} />;
}
