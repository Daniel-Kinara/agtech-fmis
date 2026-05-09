import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Activity, Weight, AlertTriangle } from "lucide-react";

interface Livestock {
  status: string;
  weight: number | null;
}

export function LivestockStats({ data }: { data: Livestock[] }) {
  const totalAnimals = data.length;
  const sickAnimals = data.filter(a => a.status === 'Sick' || a.status === 'Quarantined').length;
  const totalWeight = data.reduce((acc, curr) => acc + (curr.weight || 0), 0);
  const avgWeight = totalAnimals > 0 ? (totalWeight / totalAnimals).toFixed(1) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          <Table className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAnimals} Head</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${sickAnimals > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sickAnimals} Issues</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Biomass</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWeight.toLocaleString()} kg</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Weight</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgWeight} kg</div>
        </CardContent>
      </Card>
    </div>
  );
}