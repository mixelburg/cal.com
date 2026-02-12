
import { createContainer } from "../di";

const container = createContainer();

export function getManagedEventReassignmentService() {
  managedEventReassignmentServiceModuleLoader.loadModule(container);
  return container.get<ManagedEventReassignmentService>(managedEventReassignmentServiceModuleLoader.token);
}
