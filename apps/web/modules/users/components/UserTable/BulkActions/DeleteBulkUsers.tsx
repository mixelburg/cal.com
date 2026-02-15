import { Dialog } from "@calcom/features/components/controlled-dialog";
import { DataTableSelectionBar } from "~/data-table/components";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { DialogTrigger, ConfirmationDialogContent } from "@calcom/ui/components/dialog";
import { showToast } from "@calcom/ui/components/toast";

import type { UserTableUser } from "../types";

interface Props {
  users: Array<{ id: UserTableUser["id"] }>;
  onRemove: () => void;
}

export function DeleteBulkUsers({ users, onRemove }: Props) {
  const { t } = useLocale();
  const selectedRows = users; // Get selected rows from table
  // Bulk user deletion removed (EE organization feature)
  const deleteMutation = {
    mutate: () => {
      showToast("Bulk user deletion not available in self-hosted version", "error");
    },
    isPending: false,
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DataTableSelectionBar.Button icon="ban" color="destructive">
          {t("Delete")}
        </DataTableSelectionBar.Button>
      </DialogTrigger>
      <ConfirmationDialogContent
        variety="danger"
        title={t("remove_users_from_org")}
        confirmBtnText={t("remove")}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate();
          onRemove();
        }}>
        <p className="mt-5">
          {t("remove_users_from_org_confirm", {
            userCount: selectedRows.length,
          })}
        </p>
      </ConfirmationDialogContent>
    </Dialog>
  );
}
