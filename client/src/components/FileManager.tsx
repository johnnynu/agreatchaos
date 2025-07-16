import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "./Navbar";
import {
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Info,
  FileIcon,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Calendar,
  HardDrive,
  Filter,
} from "lucide-react";

interface FileManagerFile {
  FileID: string;
  UserID: string;
  FileName: string;
  FileSize: number;
  FileType: string;
  CreatedAt: string;
  UpdatedAt: string;
}

const FileManager: React.FC = () => {
  const { getAuthToken } = useAuth();
  const [files, setFiles] = useState<FileManagerFile[]>([]);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(
        "https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/chaosfiles-list-files",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  }, [getAuthToken]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownload = async (fileID: string) => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(
        `https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/download-url?fileID=${fileID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { downloadUrl } = response.data;

      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Failed to download file: ", error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileID: string) => {
    try {
      const token = await getAuthToken();
      await axios.delete(
        `https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/chaosfiles-delete-file/${fileID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Success",
        description: "File deleted successfully.",
      });
      fetchFiles();
    } catch (error) {
      console.error("Failed to delete file: ", error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const type = fileType.toLowerCase();

    if (
      type.includes("image") ||
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    if (
      type.includes("video") ||
      ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension || "")
    ) {
      return <Video className="h-5 w-5 text-purple-500" />;
    }
    if (
      type.includes("audio") ||
      ["mp3", "wav", "flac", "aac", "ogg"].includes(extension || "")
    ) {
      return <Music className="h-5 w-5 text-pink-500" />;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
      return <Archive className="h-5 w-5 text-orange-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <FileIcon className="h-5 w-5 text-blue-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileTypeCategory = (fileName: string, fileType: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const type = fileType.toLowerCase();

    if (
      type.includes("image") ||
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return {
        label: "Image",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      };
    }
    if (
      type.includes("video") ||
      ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension || "")
    ) {
      return {
        label: "Video",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      };
    }
    if (
      type.includes("audio") ||
      ["mp3", "wav", "flac", "aac", "ogg"].includes(extension || "")
    ) {
      return {
        label: "Audio",
        color:
          "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
      return {
        label: "Archive",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      };
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
      return {
        label: "Document",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      };
    }
    return {
      label: "File",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
  };

  const FileActionsMenu = ({ fileID }: { fileID: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-700 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
      >
        <DropdownMenuItem className="text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
          <Info className="h-4 w-4 mr-2" />
          Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(fileID)}
          className="text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem
          onClick={() => handleDelete(fileID)}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
      <Navbar />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full flex items-center justify-center border-2 border-blue-300 dark:border-blue-700">
                <HardDrive className="h-5 w-5 text-blue-800 dark:text-blue-400" />
              </div>
              File Manager
            </h1>
            <p className="text-stone-600 dark:text-stone-300">
              Manage your rich collection of {files.length} files
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <Input
                className="pl-10 w-64 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-900"
                placeholder="Search files..."
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                  <FileIcon className="h-5 w-5 text-blue-800 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {files.length}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    Total Files
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                  <HardDrive className="h-5 w-5 text-blue-800 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {formatFileSize(
                      files.reduce((total, file) => total + file.FileSize, 0)
                    )}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    Total Size
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg border border-green-300 dark:border-green-700">
                  <Calendar className="h-5 w-5 text-green-800 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {files.length > 0
                      ? formatDate(
                          files.sort(
                            (a, b) =>
                              new Date(b.CreatedAt).getTime() -
                              new Date(a.CreatedAt).getTime()
                          )[0]?.CreatedAt
                        ).split(",")[0]
                      : "N/A"}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    Latest Upload
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files List */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              Your Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full flex items-center justify-center border-2 border-blue-300 dark:border-blue-700 mb-4">
                  <FileIcon className="h-8 w-8 text-blue-800 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  No files yet
                </h3>
                <p className="text-stone-600 dark:text-stone-300">
                  Upload your first file to get started with FudgeBox
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => {
                  const fileCategory = getFileTypeCategory(
                    file.FileName,
                    file.FileType
                  );
                  return (
                    <div
                      key={file.FileID}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.FileName, file.FileType)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-stone-900 dark:text-stone-100 truncate">
                            {file.FileName}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={fileCategory.color}
                          >
                            {fileCategory.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {formatFileSize(file.FileSize)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(file.CreatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(file.FileID)}
                          className="border-slate-300 dark:border-slate-600 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-transparent"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <FileActionsMenu fileID={file.FileID} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileManager;
