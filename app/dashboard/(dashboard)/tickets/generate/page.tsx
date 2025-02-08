import GenerateTicketForm from "@/app/dashboard/(dashboard)/tickets/components/GenerateTicketForm";
import { getCollectiveEvents, getCollectiveUsers } from "../actions";
import { TEvent } from "@/types/events";
import { getSession } from "@/utils/auth";
import { type User as TUser } from "@prisma/client";

async function GenerateTicketsPage() {
  const user = (await getSession()) as TUser;
  const [collectiveEvents, collectiveUsers] = await Promise.allSettled([
    getCollectiveEvents(user.collectiveId!),
    getCollectiveUsers(user.collectiveId!),
  ]);

  if (
    collectiveEvents.status === "rejected" ||
    collectiveUsers.status === "rejected"
  ) {
    console.error("An error occurred while fetching data.");
    return;
  }

  const fetchedEvents: TEvent[] = collectiveEvents.value;
  const fetchedCollectiveUsers: TUser[] = collectiveUsers.value;

  return (
    <>
      <GenerateTicketForm
        events={fetchedEvents}
        adminUsers={fetchedCollectiveUsers}
      />
    </>
  );
}

export default GenerateTicketsPage;
