import { useSession } from "next-auth/react";

import { WEBSITE_URL } from "@calcom/lib/constants";
import { localeOptions } from "@calcom/lib/i18n";

import type { EventSetupTabProps } from "./EventSetupTab";
import { EventSetupTab } from "./EventSetupTab";

const EventSetupTabWebWrapper = (props: EventSetupTabProps) => {
  // Organizations removed (EE feature)
  const session = useSession();
  const urlPrefix = `${WEBSITE_URL?.replace(/^(https?:|)\/\//, "")}`;
  return (
    <EventSetupTab
      urlPrefix={urlPrefix}
      hasOrgBranding={false}
      localeOptions={localeOptions}
      {...props}
    />
  );
};

export default EventSetupTabWebWrapper;
