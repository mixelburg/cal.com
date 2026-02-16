import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { MembershipRole } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Avatar } from "@calcom/ui/components/avatar";
import { Button } from "@calcom/ui/components/button";
import { Form } from "@calcom/ui/components/form";
import { ToggleGroup, Select } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetBody } from "@calcom/ui/components/sheet";
import { Skeleton, Loader } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { Tooltip } from "@calcom/ui/components/tooltip";
import type { MemberPermissions } from "@calcom/features/pbac/lib/team-member-permissions";

import { updateRoleInCache, getUpdatedUser } from "./MemberChangeRoleModal";
import type { Action, State, User } from "./MemberList";

const formSchema = z.object({
  role: z.union([z.nativeEnum(MembershipRole), z.string()]), // Support both traditional roles and custom role IDs
});

type FormSchema = z.infer<typeof formSchema>;

export function EditMemberSheet({
  state,
  dispatch,
  currentMember,
  teamId,
  permissions,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  currentMember: MembershipRole;
  teamId: number;
  permissions?: MemberPermissions;
}) {
  const { t } = useLocale();
  const { user } = state.editSheet;
  const selectedUser = user as User;
  const [editMode, setEditMode] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [role, setRole] = useState<string>(selectedUser.customRoleId || selectedUser.role);
  const name =
    selectedUser.name ||
    (() => {
      const emailName = selectedUser.email.split("@")[0] as string;
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    })();

  const bookerUrl = selectedUser.bookerUrl;
  const utils = trpc.useUtils();
  const bookerUrlWithoutProtocol = bookerUrl.replace(/^https?:\/\//, "");
  const bookingLink = selectedUser.username ? `${bookerUrlWithoutProtocol}/${selectedUser.username}` : "";

  // Load custom roles for the team
  const { data: customRoles, isPending: isLoadingRoles } = trpc.viewer.pbac.getTeamRoles.useQuery(
    { teamId },
    {
      enabled: !!teamId,
      retry: false, // Don't retry if PBAC is not enabled
    }
  );

  const options = useMemo(() => {
    // If we have custom roles, only show custom roles
    if (customRoles && customRoles.length > 0) {
      return customRoles.map((customRole) => ({
        label: customRole.name,
        value: customRole.id,
      }));
    }

    // Otherwise, show traditional roles
    return [
      {
        label: t("member"),
        value: MembershipRole.MEMBER,
      },
      {
        label: t("admin"),
        value: MembershipRole.ADMIN,
      },
      {
        label: t("owner"),
        value: MembershipRole.OWNER,
      },
    ].filter(({ value }) => value !== MembershipRole.OWNER || currentMember === MembershipRole.OWNER);
  }, [t, currentMember, customRoles]);

  // Determine if we should use Select (when custom roles exist) or ToggleGroup (traditional only)
  const hasCustomRoles = customRoles && customRoles.length > 0;
  const shouldUseSelect = hasCustomRoles; // Use Select for custom roles, ToggleGroup for traditional roles

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: selectedUser.customRoleId || selectedUser.role, // Use custom role ID if available, otherwise traditional role
    },
  });

  const { data: getUserConnectedApps, isPending } = trpc.viewer.teams.getUserConnectedApps.useQuery({
    userIds: [selectedUser.id],
    teamId,
  });

  const connectedApps = getUserConnectedApps?.[selectedUser.id];

  const changeRoleMutation = trpc.viewer.teams.changeMemberRole.useMutation({
    onMutate: async ({ teamId, memberId, role }) => {
      await utils.viewer.teams.listMembers.cancel();
      const previousValue = utils.viewer.teams.listMembers.getInfiniteData({
        limit: 10,
        teamId,
        searchTerm: undefined,
      });

      if (previousValue) {
        updateRoleInCache({
          utils,
          teamId,
          memberId,
          role: role as MembershipRole | string,
          searchTerm: undefined,
          customRoles,
        });
      }

      return { previousValue };
    },
    onSuccess: async (_data, { role }) => {
      setRole(role as string);
      setMutationLoading(false);
      await utils.viewer.teams.get.invalidate();
      await utils.viewer.teams.listMembers.invalidate();
      showToast(t("profile_updated_successfully"), "success");
      setEditMode(false);

      dispatch({
        type: "EDIT_USER_SHEET",
        payload: {
          showModal: true,
          user: getUpdatedUser(selectedUser, role, customRoles),
        },
      });
    },
    async onError(err) {
      showToast(err.message, "error");
      setMutationLoading(false);
    },
  });

  function changeRole(values: FormSchema) {
    setMutationLoading(true);
    changeRoleMutation.mutate({
      teamId: teamId,
      memberId: user?.id as number,
      role: values.role,
    });
  }

  const appList = (connectedApps || []).map(({ logo, name, externalId }) => {
    return logo ? (
      externalId ? (
        <div className="ltr:mr-2 rtl:ml-2 ">
          <Tooltip content={externalId}>
            <img className="h-5 w-5" src={logo} alt={`${name} logo`} />
          </Tooltip>
        </div>
      ) : (
        <div className="ltr:mr-2 rtl:ml-2">
          <img className="h-5 w-5" src={logo} alt={`${name} logo`} />
        </div>
      )
    ) : null;
  });

  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        setEditMode(false);
        dispatch({ type: "CLOSE_MODAL" });
      }}>
      <SheetContent className="bg-cal-muted">
        {!isPending && !isLoadingRoles ? (
          <Form form={form} handleSubmit={changeRole} className="flex h-full flex-col">
            <SheetHeader showCloseButton={false} className="w-full">
              <div className="border-subtle bg-default w-full rounded-xl border p-4">
                <div
                  className="block w-full rounded-lg ring-1 ring-[#0000000F]"
                  style={{
                    background: "linear-gradient(to top right, var(--cal-bg-emphasis), var(--cal-bg))",
                    height: "110px",
                  }}
                />
                <div className="bg-default ml-3 w-fit translate-y-[-50%] rounded-full p-1 ring-1 ring-[#0000000F]">
                  <Avatar asChild size="lg" alt={`${name} avatar`} imageSrc={selectedUser.avatarUrl} />
                </div>
                <Skeleton as="p" waitForTranslation={false}>
                  <h2 className="text-emphasis font-sans text-2xl font-semibold">
                    {name || "Nameless User"}
                  </h2>
                </Skeleton>
                <Skeleton as="p" waitForTranslation={false}>
                  <p className="text-subtle max-h-[3em] overflow-hidden text-ellipsis text-sm font-normal">
                    {selectedUser.bio ? selectedUser?.bio : t("user_has_no_bio")}
                  </p>
                </Skeleton>
              </div>
            </SheetHeader>
            <SheetBody className="stack-y-4 flex flex-col p-4">
              <div className="stack-y-4 mb-4 flex flex-col">
                <h3 className="text-emphasis mb-1 text-base font-semibold">{t("profile")}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex w-[110px] items-center gap-2">
                    <Icon className="text-subtle h-4 w-4" name="external-link" />
                    <label className="text-subtle text-sm font-medium">Cal</label>
                  </div>
                  <span className="text-default text-sm">{bookingLink}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex w-[110px] items-center gap-2">
                    <Icon className="text-subtle h-4 w-4" name="at-sign" />
                    <label className="text-subtle text-sm font-medium">{t("email")}</label>
                  </div>
                  <span className="text-default text-sm">{selectedUser.email}</span>
                </div>
                {!editMode ? (
                  <div className="flex items-center gap-6">
                    <div className="flex w-[110px] items-center gap-2">
                      <Icon className="text-subtle h-4 w-4" name="fingerprint" />
                      <label className="text-subtle text-sm font-medium">{t("role")}</label>
                    </div>
                    <span className="text-default text-sm">{selectedUser.customRole?.name || selectedUser.role}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="flex w-[110px] items-center gap-2">
                      <Icon className="h-4 w-4" name="fingerprint" />
                      <label className="text-sm font-medium">{t("role")}</label>
                    </div>
                    <div className="flex flex-1">
                      {shouldUseSelect ? (
                        <Select
                          value={options.find((option) => option.value === form.watch("role"))}
                          onChange={(selectedOption: any) => {
                            if (selectedOption) {
                              form.setValue("role", selectedOption.value);
                            }
                          }}
                          options={options}
                          isDisabled={isLoadingRoles}
                          placeholder={isLoadingRoles ? t("loading") : t("select_role")}
                          className="flex-1"
                        />
                      ) : (
                        <ToggleGroup
                          isFullWidth
                          defaultValue={role}
                          value={form.watch("role")}
                          options={options}
                          onValueChange={(value: FormSchema["role"]) => {
                            form.setValue("role", value);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <div className="flex w-[110px] items-center gap-2">
                    <Icon className="text-subtle h-4 w-4" name="grid-3x3" />
                    <label className="text-subtle text-sm font-medium">{t("apps")}</label>
                  </div>
                  <div className="flex flex-1">
                    {!connectedApps ? (
                      <div>{t("user_has_no_app_installed")}</div>
                    ) : (
                      <div className="flex">{appList}</div>
                    )}
                  </div>
                </div>
              </div>
            </SheetBody>
            <SheetFooter className="mt-auto">
                <div className="flex w-full justify-end gap-2">
                {!editMode ? (
                  permissions?.canChangeMemberRole ? (
                    <Button color="secondary" onClick={() => setEditMode(true)}>
                      {t("edit")}
                    </Button>
                  ) : null
                ) : (
                  <>
                    <Button color="secondary" onClick={() => setEditMode(false)}>
                      {t("cancel")}
                    </Button>
                    <Button type="submit" color="primary" loading={mutationLoading}>
                      {t("save")}
                    </Button>
                  </>
                )}
              </div>
            </SheetFooter>
          </Form>
        ) : (
          <Loader />
        )}
      </SheetContent>
    </Sheet>
  );
}
