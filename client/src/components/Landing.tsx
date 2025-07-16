import type React from "react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Upload, Share2, Shield, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";

const LandingPage: React.FC = () => {
  const { signIn, isAuth, isLoading, checkAuthState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthState();
      if (isAuth) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [checkAuthState, isAuth, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-stone-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full flex items-center justify-center border-2 border-blue-300 dark:border-blue-700">
            <Loader2 className="w-8 h-8 animate-spin text-blue-800 dark:text-blue-400" />
          </div>
          <p className="text-stone-800 dark:text-stone-200">
            Loading your file box...
          </p>
        </div>
      </div>
    );
  }

  if (isAuth) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-stone-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40 relative overflow-visible">
        {/* Logo Section */}
        <div className="flex items-center">
          <Logo variant="header" />
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white shadow-lg"
            onClick={signIn}
            disabled={isLoading}
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/30"></div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm text-blue-800 dark:text-blue-300 font-medium">
                    🍫 Sweet File Sharing Experience
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-stone-900 dark:text-stone-100">
                    Share Files as
                    <span className="text-blue-800 dark:text-blue-400">
                      {" "}
                      Rich{" "}
                    </span>
                    as Chocolate
                  </h1>
                  <p className="max-w-[600px] text-stone-700 dark:text-stone-200 md:text-xl">
                    FudgeBox makes file sharing deliciously simple. Upload,
                    share, and manage your files in our chocolate-inspired
                    platform that's rich with features.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>Fast</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-stone-700 rounded-sm"></div>
                    </div>
                    <span>Delicious</span>
                  </div>
                </div>
              </div>

              {/* Auth Card */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-stone-700 dark:from-blue-800 dark:to-stone-800 rounded-3xl blur-3xl opacity-20"></div>
                  <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md">
                    <CardHeader className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full mb-4 border-2 border-blue-300 dark:border-blue-700 mx-auto">
                        <Upload className="h-8 w-8 text-blue-800 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl text-stone-900 dark:text-stone-100">
                        Welcome to FudgeBox
                      </CardTitle>
                      <CardDescription className="text-stone-600 dark:text-stone-300">
                        Manage your files with ease and security. Rich, simple,
                        and delicious.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-6 text-sm text-stone-500 dark:text-stone-400 text-center">
                        Sign in to access your files, upload new ones, and
                        collaborate with others in your chocolate box.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white shadow-lg"
                        onClick={signIn}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <svg
                            className="w-4 h-4 mr-2"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="google"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                          >
                            <path
                              fill="currentColor"
                              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            ></path>
                          </svg>
                        )}
                        Sign In With Google
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-gradient-to-r from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 px-3 py-1 text-sm text-blue-800 dark:text-blue-300 font-medium border border-blue-300 dark:border-blue-700">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-stone-900 dark:text-stone-100">
                  Everything You Need, Rich & Simple
                </h2>
                <p className="max-w-[900px] text-stone-700 dark:text-stone-200 md:text-xl/relaxed">
                  FudgeBox provides all the tools you need for secure, fast, and
                  reliable file sharing.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-shadow bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                      <Upload className="h-6 w-6 text-blue-800 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                      Lightning Fast Uploads
                    </h3>
                  </div>
                  <p className="text-stone-700 dark:text-stone-200">
                    Upload files of any size with our optimized infrastructure.
                    From documents to videos, share instantly like melting
                    chocolate.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-shadow bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                      <Shield className="h-6 w-6 text-blue-800 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                      Premium Security
                    </h3>
                  </div>
                  <p className="text-stone-700 dark:text-stone-200">
                    Your files are protected with end-to-end encryption and
                    secure servers. As safe as chocolate in a vault.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-shadow bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                      <Share2 className="h-6 w-6 text-blue-800 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                      Rich Sharing
                    </h3>
                  </div>
                  <p className="text-stone-700 dark:text-stone-200">
                    Generate secure links, set expiration dates, and control who
                    can access your files with ease.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Logo variant="footer" />
          <p className="text-xs text-stone-700 dark:text-stone-300">
            © 2025 FudgeBox. Making file sharing deliciously simple.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            href="#"
            className="text-xs hover:underline underline-offset-4 text-stone-600 dark:text-stone-400"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-xs hover:underline underline-offset-4 text-stone-600 dark:text-stone-400"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs hover:underline underline-offset-4 text-stone-600 dark:text-stone-400"
          >
            Support
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
