import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectOverviewProps {
  status: string;
  budget: number;
  squareFootage: string;
  completionDate: string;
}

export function ProjectOverview({ status, budget, squareFootage, completionDate }: ProjectOverviewProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-sm text-gray-800 break-words mt-1">{status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Budget</p>
            <p className="text-sm text-gray-800 mt-1">
              ${budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Square Footage</p>
            <p className="text-sm text-gray-800 mt-1">
              {squareFootage} sq ft
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Planned Completion</p>
            <p className="text-sm text-gray-800 mt-1">
              {completionDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}