import { EventTeamAssignmentTab, type EventTeamAssignmentTabBaseProps } from "./EventTeamAssignmentTab";

const EventTeamAssignmentTabWebWrapper = (
  props: Omit<EventTeamAssignmentTabBaseProps, "isSegmentApplicable">
) => {
  // Organizations removed - segments not applicable for self-hosters
  const isSegmentApplicable = false;
  return <EventTeamAssignmentTab {...props} isSegmentApplicable={isSegmentApplicable} />;
};

export default EventTeamAssignmentTabWebWrapper;
