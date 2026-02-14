import { useBottomNavItems } from "../useBottomNavItems";
import { UserPermissionRole } from "@calcom/prisma/enums";
import type { NavigationItemType } from "./NavigationItem";
import { useSession } from "next-auth/react";

export function useMobileMoreItems() {
  const { data: session } = useSession();
  const user = session?.user as any; // Extended with org properties in session
  const isAdmin = user?.role === UserPermissionRole.ADMIN;
  // Organizations removed - use simple username
  const publicPageUrl = `/${user?.username || ""}`;

  const bottomNavItems = useBottomNavItems({
    publicPageUrl,
    isAdmin,
    user,
  });

  const filteredBottomNavItems = bottomNavItems.filter(
    (item: NavigationItemType) => item.name !== "settings"
  );
  return { isPending: false, isPlatformUser: false };
}
