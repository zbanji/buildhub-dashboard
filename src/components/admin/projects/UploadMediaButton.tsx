import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadMediaButtonProps {
  projectId: string;
  milestoneId: string | null;
  onUploadComplete: () => void;
}

export function UploadMediaButton({ projectId, milestoneId, onUploadComplete }: UploadMediaButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
          milestone_id: milestoneId,
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
    <Button
      variant="outline"
      className="w-full"
      disabled={isUploading}
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
  );
}