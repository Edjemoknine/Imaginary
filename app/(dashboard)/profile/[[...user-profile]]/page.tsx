import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

export default function ProfilePage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] justify-center px-4 py-8 sm:px-8 sm:py-12">
      <UserProfile
        appearance={{
          theme: dark,
        }}
      />
    </main>
  );
}
