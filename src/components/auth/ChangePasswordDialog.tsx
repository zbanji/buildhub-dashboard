import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return true;
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      // Validate password length
      const passwordValidation = validatePassword(data.password);
      if (passwordValidation !== true) {
        toast({
          title: "Error",
          description: passwordValidation,
          variant: "destructive",
        });
        return;
      }

      // Validate password match
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: data.currentPassword,
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Then update to the new password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        if (error.message.includes("same_password")) {
          toast({
            title: "Error",
            description: "New password must be different from your current password",
            variant: "destructive",
          });
        } else if (error.message.includes("refresh_token_not_found")) {
          toast({
            title: "Session Expired",
            description: "Please sign in again to change your password",
          });
          await supabase.auth.signOut();
          navigate("/login");
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error("Password change error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password. Password must be at least 6 characters long.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}