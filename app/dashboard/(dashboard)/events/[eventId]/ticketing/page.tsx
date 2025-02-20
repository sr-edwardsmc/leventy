export default async function EventTicketingPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <div> {eventId} </div>;
}
