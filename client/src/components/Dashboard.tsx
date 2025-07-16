import FileUpload from "./FileUpload";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Share2, Crown, Users, Download, Shield } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
      <Navbar />

      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full flex items-center justify-center border-2 border-blue-300 dark:border-blue-700">
              <span className="text-2xl">🍫</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100">
                Welcome to FudgeBox!
              </h1>
              <p className="text-stone-600 dark:text-stone-300">
                Your rich file sharing experience awaits
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-stone-700 dark:text-stone-200 text-lg leading-relaxed">
              Share your files with{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                FudgeBox
              </span>{" "}
              - as rich and delicious as chocolate! Upload unlimited data,
              download without speed limits, and share files with friends
              without additional costs. Your digital treats, delivered
              perfectly.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {/*<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Total Files
              </CardTitle>
              <Files className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                24
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                +3 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                1,234
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Shared Links
              </CardTitle>
              <Share2 className="h-4 w-4 text-stone-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                12
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                5 active links
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Storage Used
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-stone-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                2.4 GB
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                of unlimited storage
              </p>
            </CardContent>
          </Card>
        </div>/*}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Rich File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload OnUploadComplete={() => {}} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-stone-900 dark:text-stone-100">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white"
                  onClick={() => navigate("/files")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-300 dark:border-slate-600 text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
                  disabled={true}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Create Share Link
                </Button>
              </CardContent>
            </Card>

            {/* Features Highlight */}
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-900/20">
              <CardHeader>
                <CardTitle className="text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-blue-600" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-stone-700 dark:text-stone-200">
                    End-to-end encryption
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-stone-700 dark:text-stone-200">
                    Team collaboration
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Download className="h-4 w-4 text-blue-600" />
                  <span className="text-stone-700 dark:text-stone-200">
                    Unlimited downloads
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white"
                  disabled={true}
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-stone-900 dark:text-stone-100">
                  💡 Sweet Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-stone-700 dark:text-stone-200">
                  <p>
                    🍫 <strong>Pro tip:</strong> Drag and drop multiple files
                    for batch upload
                  </p>
                  <p>
                    🔗 <strong>Share easily:</strong> Generate secure links with
                    expiration dates
                  </p>
                  <p>
                    📱 <strong>Mobile friendly:</strong> Access your files from
                    any device
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
