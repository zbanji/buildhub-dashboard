import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  title: string;
  error?: string;
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"sign_in" | "otp_verify" | "update_password">("sign_in");
  const { message, error, setError, setMessage } = useAuthMessages(propError);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const baseUrl = "https://buildhub-dashboard.lovable.app";
  const redirectTo = `${baseUrl}/client`;

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("otp_verify");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("update_password");
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams, setError]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // This ensures we only send OTP to existing users
          data: {
            type: 'recovery' // This indicates this is for password recovery
          }
        }
      });
      
      if (error) throw error;
      
      setMessage("Check your email for the OTP code.");
      setView("otp_verify");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      });
      
      if (error) throw error;
      
      setView("update_password");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setMessage("Password updated successfully!");
      setView("sign_in");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (view === "otp_verify") {
    return (
      <AuthContainer title="Verify OTP">
        {error && <AuthMessage message={error} variant="destructive" />}
        {message && <AuthMessage message={message} />}
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
      </AuthContainer>
    );
  }

  if (view === "update_password") {
    return (
      <AuthContainer title="Set New Password">
        {error && <AuthMessage message={error} variant="destructive" />}
        {message && <AuthMessage message={message} />}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Update Password</Button>
        </form>
      </AuthContainer>
    );
  }

  if (view === "sign_in") {
    return (
      <AuthContainer title={title}>
        {error && <AuthMessage message={error} variant="destructive" />}
        {message && <AuthMessage message={message} />}
        <div className="space-y-4">
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={redirectTo}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign In',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: "Already have an account? Sign in",
                },
              },
            }}
          />
          <div className="text-center">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="outline" className="w-full">
                Reset Password with OTP
              </Button>
            </form>
          </div>
        </div>
      </AuthContainer>
    );
  }

  return null;
}