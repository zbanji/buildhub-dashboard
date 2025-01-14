import { NewProjectDialog } from "@/components/admin/NewProjectDialog";

export function ProjectHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">Project Management</h1>
      <div className="flex flex-wrap items-center gap-4">
        <NewProjectDialog />
      </div>
    </div>
  );
}