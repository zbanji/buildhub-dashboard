import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";
import { Client } from "./types";

interface ClientCardProps {
  client: Client;
  onUpdateClient: (id: string, name: string) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  editName: string;
  setEditName: (name: string) => void;
  setSelectedClient: (client: Client) => void;
}

export function ClientCard({
  client,
  onUpdateClient,
  onDeleteProject,
  editName,
  setEditName,
  setSelectedClient,
}: ClientCardProps) {
  return (
    <Card key={client.id} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {client.name || "Unnamed Client"}
          </h3>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedClient(client);
                setEditName(client.name || "");
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <Button onClick={() => onUpdateClient(client.id, editName)} className="w-full">
                Update Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Projects</h4>
        {client.projects.length > 0 ? (
          <div className="space-y-2">
            {client.projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <span className="text-sm">{project.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No projects</p>
        )}
      </div>
    </Card>
  );
}