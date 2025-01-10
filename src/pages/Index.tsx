import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

const projectStats = [
  {
    title: "Project Status",
    value: "In Progress",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    title: "Completed Tasks",
    value: "12/20",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    title: "Budget Used",
    value: "$45,000",
    icon: DollarSign,
    color: "text-yellow-500",
  },
  {
    title: "Open Issues",
    value: "3",
    icon: AlertCircle,
    color: "text-red-500",
  },
];

const recentUpdates = [
  {
    date: "2024-02-20",
    title: "Foundation Work Complete",
    description: "The foundation has been laid and inspected.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    date: "2024-02-19",
    title: "Electrical Installation Started",
    description: "Began installing electrical systems on the first floor.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Project Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's the latest on your construction project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projectStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center space-x-4 p-6">
                <div
                  className={cn(
                    "rounded-full p-2",
                    "bg-gray-100",
                    stat.color
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest progress and milestones from your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentUpdates.map((update) => (
                <div
                  key={update.date}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={update.image}
                      alt={update.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{update.title}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}