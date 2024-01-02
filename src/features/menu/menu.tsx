import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BarChartHorizontalBig } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "../user-profile";

export const MainMenu = () => {
  return (
    <div className="flex gap-2 flex-col justify-between">
      <div className="flex gap-2 flex-col justify-between">
        <Link
          href="/"
          className="w-10 h-10 items-center justify-center flex"
          title="Home"
        >
          <Avatar className="">
            <AvatarImage src="/lihkg_logo_test.png" />
          </Avatar>
        </Link>
        <Link
          href="/reporting"
          className="w-10 h-10 items-center justify-center flex rounded-full hover:bg-secondary"
          title="Reporting"
        >
          <BarChartHorizontalBig size={20} />
        </Link>
      </div>
      <UserProfile />
    </div>
  );
};
