export * from "./lib/types";
export * from "./lib/utils";
export * from "./lib/serializers";
export * from "./lib/separator";

// Data table provider and hooks stubs (EE features removed)
// Self-hosters don't need advanced data table features
export const DataTableProvider = ({ children }: { children: React.ReactNode }) => children;
export const useDataTable = () => ({ table: null });
export const useFetchMoreOnBottomReached = () => {};
export const useColumnFilters = () => [];
