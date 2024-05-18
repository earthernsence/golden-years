import { Logo } from "@/components/Logo";

export const Header = () => (
  <div className="max-w-3xl space-y-4 flex items-center flex-col md:flex-row">
    <Logo size="Normal" />
    <div className="flex flex-col space-y-2">
      <div className="text-2xl sm:text-4xl md:text-5xl font-bold">
      Bringing students <span className="underline">closer</span>.
      </div>
      <div className="text-base sm:text-xl md:text-2xl font-medium">
      Connecting volunteers to past generations.
      </div>
    </div>
  </div>
);