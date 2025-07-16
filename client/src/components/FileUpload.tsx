"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";
import axios, { type AxiosError, type AxiosProgressEvent } from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, File, Trash2, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100 MB threshold for multipart upload
const LESS_THAN_1GB = 1024 * 1024 * 1024;
const CHUNKS_10MB = 10 * 1024 * 1024;
const BETWEEN_1GB_AND_10GB = 10 * 1024 * 1024 * 1024;
const CHUNKS_50MB = 50 * 1024 * 1024;
const CHUNKS_100MB = 100 * 1024 * 1024;

const FileUpload: React.FC<{ OnUploadComplete: () => void }> = ({
  OnUploadComplete,
}) => {
  const { getAuthToken } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      setUploadProgress({});
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getChunkSize = (fileSize: number): number => {
    if (fileSize < LESS_THAN_1GB) {
      // Less than 1 GB
      return CHUNKS_10MB; // 10 MB chunks
    } else if (fileSize < BETWEEN_1GB_AND_10GB) {
      return CHUNKS_50MB;
    } else {
      return CHUNKS_100MB;
    }
  };

  const updateProgress = useCallback((fileName: string, progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [fileName]: Math.min(progress, 100), // Ensure progress doesn't exceed 100
    }));
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const token = await getAuthToken();

      if (!token) {
        setError("Failed to get auth token. Please try logging in again.");
        return;
      }

      for (const file of selectedFiles) {
        if (file.size < MULTIPART_THRESHOLD) {
          await handleSinglePartUpload(file, token);
        } else {
          await handleMultipartUpload(file, token);
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      OnUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        setError(`Upload failed: ${axiosError.message}`);
      } else {
        setError("Upload failed: An unexpected error occurred");
      }
    }
  };

  const handleSinglePartUpload = async (file: File, token: string) => {
    // Get pre signed url
    const response = await axios.post(
      "https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/upload-url",
      {
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { uploadUrl } = response.data;

    // upload file to s3
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: percentCompleted,
        }));
      },
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    OnUploadComplete();
  };

  const handleMultipartUpload = async (file: File, token: string) => {
    const chunkSize = getChunkSize(file.size);
    let uploadedChunks = 0;

    const response = await axios.post(
      "https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/upload-url",
      {
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        chunkSize: chunkSize,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { uploadId, partUrls, fileID } = response.data;

    const chunks = Math.ceil(file.size / chunkSize);
    const uploadPromises = [];

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const uploadPromise = axios.put(partUrls[i], chunk, {
        headers: { "Content-Type": "application/octet-stream" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const chunkProgress = progressEvent.total
            ? (progressEvent.loaded / progressEvent.total) * (100 / chunks)
            : 0;
          uploadedChunks++;
          const totalProgress =
            (uploadedChunks - 1) * (100 / chunks) + chunkProgress;
          updateProgress(file.name, totalProgress);
        },
      });

      uploadPromises.push(uploadPromise);
    }

    const uploadResults = await Promise.all(uploadPromises);

    await axios.post(
      "https://4j1h7lzpf5.execute-api.us-east-2.amazonaws.com/dev/complete-upload",
      {
        fileID,
        uploadId,
        parts: uploadResults.map((result, index) => ({
          ETag: result.headers.etag,
          PartNumber: index + 1,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    updateProgress(file.name, 100);
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleViewFile = () => {
    navigate("/files");
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

  return (
    <div className="space-y-4">
      {selectedFiles.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gradient-to-br from-blue-50/30 to-slate-50/30 dark:from-blue-950/20 dark:to-slate-900/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 border-2 border-blue-300 dark:border-blue-700">
                <Upload className="h-8 w-8 text-blue-800 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Drop your rich files here
                </h3>
                <p className="text-stone-600 dark:text-stone-300">
                  Select or drag & drop your files for upload
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  File size limit: <span className="font-medium">1 TB</span> •
                  All file types supported
                </p>
              </div>
              <div className="pt-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <Button
                  variant="outline"
                  onClick={handleBrowseClick}
                  className="border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-white dark:bg-slate-900"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <Button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white shadow-lg"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Start Upload
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedFiles.map((file) => (
                    <div key={file.name} className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-lg border border-blue-300 dark:border-blue-700">
                            <File className="h-4 w-4 text-blue-800 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-300">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {uploadProgress[file.name] === 100 ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleViewFile}
                                className="h-8 w-8 p-0 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.name)}
                              className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {uploadProgress[file.name] !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-600 dark:text-stone-300">
                              {uploadProgress[file.name] === 100
                                ? "Upload complete"
                                : "Uploading..."}
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {uploadProgress[file.name]}%
                            </span>
                          </div>
                          <Progress
                            value={uploadProgress[file.name] || 0}
                            className="h-2 bg-slate-200 dark:bg-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
