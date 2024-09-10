import { getDetailedViewData } from "@/app/actions/auction.actions";
import { getCurrentUser } from "@/app/actions/auth.actions";
import Heading from "@/app/components/Heading";
import CarImage from "@/app/ui/auctions/car-image";
import CountdownTimer from "@/app/ui/auctions/countdown-timer";
import DeleteButton from "@/app/ui/auctions/details/delete-button";
import DetailedSpecs from "@/app/ui/auctions/details/detailed-specs";
import EditButton from "@/app/ui/auctions/details/edit-button";

export default async function Details({ params }: { params: { id: string } }) {
  const data = await getDetailedViewData(params.id);
  const user = await getCurrentUser();

  if ("error" in data) {
    return <div>Whoops! Something went wrong</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Heading title={`${data.make} ${data.model}`} />
          {user?.name === data.seller && (
            <>
              <EditButton id={data.id} />
              <DeleteButton id={data.id} />
            </>
          )}
        </div>

        <div className="flex gap-3">
          <h3 className="text-2xl font-semibold">Time remaining:</h3>
          <CountdownTimer auctionEnd={Date.parse(data.auctionEnd)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-3">
        <div className="w-full bg-gray-200 relative aspect-[16/10] rounded-lg overflow-hidden">
          <CarImage imageUrl={data.imageUrl} />
        </div>

        <div className="border-2 rounded-lg p-2 bg-gray-100">
          <Heading title="bids" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 rounded-lg">
        <DetailedSpecs auction={data} />
      </div>
    </div>
  );
}
