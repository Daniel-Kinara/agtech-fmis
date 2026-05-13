import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ListingCard = ({ item }: { item: any }) => (
  <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-bold text-lg">{item.asset_name}</h3>
      <Badge variant="secondary">Ksh {item.price_ksh.toLocaleString()}</Badge>
    </div>
    <div className="text-sm text-muted-foreground mb-4">
      <p>Origin: {item.location}</p>
      <p>Weight/Qty: {item.quantity}</p>
    </div>
    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
      Buy Now
    </Button>
  </div>
);