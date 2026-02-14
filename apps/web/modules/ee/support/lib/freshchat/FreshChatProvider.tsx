// Stub for removed EE Freshchat support
import type { ReactNode } from "react";
export const FreshChatProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export default FreshChatProvider;
export const useFreshChat = () => ({ isOpen: false, openFreshChat: () => {}, closeFreshChat: () => {} });
