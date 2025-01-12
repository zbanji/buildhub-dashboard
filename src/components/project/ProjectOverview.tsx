import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectOverviewProps {
  status: string;
  budget: number;
  squareFootage: string;
  completionDate: string;
}

export function ProjectOverview({ status, budget, squareFootage, completionDate }: ProjectOverviewProps) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground break-words">{status}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Budget</p>
            <p className="text-sm text-muted-foreground">
              ${budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Square Footage</p>
            <p className="text-sm text-muted-foreground">
              {squareFootage} sq ft
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Planned Completion</p>
            <p className="text-sm text-muted-foreground">
              {completionDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}