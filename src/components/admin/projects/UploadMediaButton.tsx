import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectMilestones } from "@/hooks/use-project-data";

interface UploadMediaButtonProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function UploadMediaButton({ projectId, onUploadComplete }: UploadMediaButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");
  const { data: milestones } = useProjectMilestones(projectId);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedMilestone) {
      toast({
        title: "Error",
        description: "Please select a milestone before uploading media",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('project_media')
        .insert({
          project_id: projectId,
          milestone_id: selectedMilestone,
          file_path: filePath,
          file_type: file.type.startsWith('image/') ? 'image' : 'video'
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
        <SelectTrigger>
          <SelectValue placeholder="Select a milestone" />
        </SelectTrigger>
        <SelectContent>
          {milestones?.map((milestone) => (
            <SelectItem key={milestone.id} value={milestone.id}>
              {milestone.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        className="w-full"
        disabled={isUploading || !selectedMilestone}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Media"}
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </Button>
    </div>
  );
}