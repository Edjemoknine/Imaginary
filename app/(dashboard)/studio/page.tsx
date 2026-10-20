import { auth } from "@clerk/nextjs/server";
import StudioClient from "./StudioClient";

export default async function StudioPage() {
  const { has } = await auth();
  const canUseAiTools =
    has({ plan: "pro" }) || has({ plan: "enterprise" });

  return <StudioClient canUseAiTools={canUseAiTools} />;
}
