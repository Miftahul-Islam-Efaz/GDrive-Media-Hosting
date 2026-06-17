"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Folder, Image as ImageIcon, Video as VideoIcon, Settings, Search, 
  LogOut, UploadCloud, X, Copy, Trash2, Eye, Check, ExternalLink, 
  FileText, ChevronRight, Plus, Grid, ArrowUpDown, CheckCircle2, 
  Loader2, HelpCircle, RefreshCw, AlertCircle, FileAudio, File, 
  ShieldAlert, Info, Menu, Github, Edit2
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  // --- STATE FOR CREDENTIALS & AUTH ---
  // Default to the developer's Client ID so the app works out of the box for public users!
  const [clientId, setClientId] = useState("701910325684-bld20qoqo3t40frkisckvb6gtpl9k4st.apps.googleusercontent.com");
  const [isCustomClient, setIsCustomClient] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(0);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // --- STATE FOR DRIVE DATA ---
  const [files, setFiles] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- STATE FOR MAIN DASHBOARD INTERFACE ---
  const [currentTab, setCurrentTab] = useState("all"); // all, images, videos, settings
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name
  const [dragActive, setDragActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // --- STATE FOR LIGHTBOX & PREVIEWS ---
  const [previewItem, setPreviewItem] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState("");
  const [loadingLightbox, setLoadingLightbox] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState({});
  const loadedThumbnailsRef = useRef(new Set());
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [renamingFile, setRenamingFile] = useState(null);
  const [newName, setNewName] = useState("");
  const [showStarPopup, setShowStarPopup] = useState(false);

  // --- STATE FOR FLOATING UPLOAD DRAWER ---
  const [uploadQueue, setUploadQueue] = useState([]);

  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [uploadDrawerCollapsed, setUploadDrawerCollapsed] = useState(false);

  // --- STATE FOR TOAST NOTIFICATIONS ---
  const [toasts, setToasts] = useState([]);

  // Load configuration and session from localStorage/sessionStorage
  useEffect(() => {
    const savedClientId = localStorage.getItem("gdrive_custom_client_id") || "";
    const savedFolderId = localStorage.getItem("gdrive_active_folder_id") || "";
    
    if (savedClientId) {
      setClientId(savedClientId);
      setIsCustomClient(true);
    }
    setActiveFolderId(savedFolderId);

    const cachedToken = sessionStorage.getItem("gdrive_access_token") || "";
    const cachedExpiry = parseInt(sessionStorage.getItem("gdrive_token_expiry") || "0", 10);
    const cachedUser = sessionStorage.getItem("gdrive_user_info");

    if (cachedToken && cachedExpiry > Date.now()) {
      setAccessToken(cachedToken);
      setTokenExpiry(cachedExpiry);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    }

    const hasSeen = localStorage.getItem("gdrive_has_seen_guidelines");
    if (!hasSeen) {
      setShowGuidelines(true);
    }
  }, []);

  const handleCloseGuidelines = () => {
    if (dontShowAgain) {
      localStorage.setItem("gdrive_has_seen_guidelines", "true");
    }
    setShowGuidelines(false);
    
    // Show the GitHub star reminder popup if they haven't starred the repo yet
    const hasStarred = localStorage.getItem("gdrive_has_starred_repo");
    if (!hasStarred) {
      setShowStarPopup(true);
    }
  };

  const handleCloseStarPopup = () => {
    setShowStarPopup(false);
  };

  const handleStarOnGitHub = () => {
    window.open("https://github.com/Miftahul-Islam-Efaz/GDrive-Media-Hosting", "_blank", "noopener,noreferrer");
    localStorage.setItem("gdrive_has_starred_repo", "true");
    setShowStarPopup(false);
    showToast("Thank you for starring the repository!");
    
    // Premium confetti blast!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleSelectFile = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete these ${selectedIds.length} selected files?`)) {
      return;
    }

    let deletedCount = 0;
    let failedCount = 0;

    showToast(`Deleting ${selectedIds.length} files...`, "info");

    for (const id of selectedIds) {
      try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.ok) {
          deletedCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        failedCount++;
      }
    }

    if (deletedCount > 0) {
      showToast(`Successfully deleted ${deletedCount} files.`);
      setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
    }
    if (failedCount > 0) {
      showToast(`Failed to delete ${failedCount} files.`, "error");
    }

    setSelectedIds([]);
  };

  const handleRenameSubmit = async () => {
    if (!newName.trim() || newName.trim() === renamingFile.name) {
      setRenamingFile(null);
      return;
    }

    try {
      showToast("Renaming file...", "info");
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${renamingFile.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newName.trim()
        })
      });

      if (response.ok) {
        showToast("File renamed successfully!");
        setFiles((prev) =>
          prev.map((f) => (f.id === renamingFile.id ? { ...f, name: newName.trim() } : f))
        );
      } else {
        showToast("Failed to rename file.", "error");
      }
    } catch (err) {
      showToast("Error renaming file.", "error");
    } finally {
      setRenamingFile(null);
    }
  };

  // Fetch files automatically when authenticated and folder is resolved
  useEffect(() => {
    if (accessToken && activeFolderId) {
      fetchFiles(activeFolderId, accessToken);
    }
  }, [accessToken, activeFolderId]);

  // Check token validity periodically
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      if (Date.now() >= tokenExpiry) {
        showToast("Session expired. Please reconnect.", "error");
        handleDisconnect();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [accessToken, tokenExpiry]);

  // Load thumbnail Blobs for authenticated rendering in the gallery cards
  useEffect(() => {
    if (!accessToken || files.length === 0) return;

    files.forEach(async (file) => {
      if (loadedThumbnailsRef.current.has(file.id)) return;
      
      const isImg = file.mimeType.startsWith("image/");
      const isVid = file.mimeType.startsWith("video/");

      if ((isImg || isVid) && file.thumbnailLink) {
        loadedThumbnailsRef.current.add(file.id);
        try {
          const url = file.thumbnailLink.includes("=s") 
            ? file.thumbnailLink.replace(/=s\d+/, "=s400") 
            : file.thumbnailLink;

          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (res.ok) {
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            setThumbnailUrls((prev) => ({ ...prev, [file.id]: objectUrl }));
          } else {
            loadedThumbnailsRef.current.delete(file.id);
          }
        } catch (err) {
          loadedThumbnailsRef.current.delete(file.id);
          console.error(`Failed to load thumbnail blob for ${file.name}:`, err);
        }
      }
    });
  }, [files, accessToken]);

  // Load high-resolution lightbox content securely as a Blob URL
  useEffect(() => {
    if (!previewItem || !accessToken) {
      setLightboxUrl("");
      return;
    }

    let active = true;
    setLoadingLightbox(true);

    const loadLightboxContent = async () => {
      try {
        const isImg = previewItem.mimeType.startsWith("image/");
        const isVid = previewItem.mimeType.startsWith("video/");

        if (isImg) {
          const res = await fetch(`https://www.googleapis.com/drive/v3/files/${previewItem.id}?alt=media`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (res.ok && active) {
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            setLightboxUrl(objectUrl);
          } else if (active) {
            // Fallback to high-res thumbnail if media content is blocked
            setLightboxUrl(`https://drive.google.com/thumbnail?id=${previewItem.id}&sz=w1000`);
          }
        } else if (isVid) {
          // Videos are streamed via their direct public stream URL
          setLightboxUrl(`https://drive.google.com/uc?export=download&id=${previewItem.id}`);
        }
      } catch (err) {
        console.error("Error loading lightbox content:", err);
      } finally {
        if (active) setLoadingLightbox(false);
      }
    };

    loadLightboxContent();

    return () => {
      active = false;
      if (lightboxUrl && lightboxUrl.startsWith("blob:")) {
        URL.revokeObjectURL(lightboxUrl);
      }
    };
  }, [previewItem, accessToken]);

  // --- TOAST MANAGER ---
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- SAVE CUSTOM CLIENT ID IN SETTINGS ---
  const handleSaveCustomClient = (e) => {
    e.preventDefault();
    if (!clientId.trim()) {
      showToast("Please enter a Client ID.", "error");
      return;
    }
    localStorage.setItem("gdrive_custom_client_id", clientId.trim());
    setIsCustomClient(true);
    showToast("Custom Client ID saved. Connect again to apply.");
    handleDisconnect(); // Force reconnect with new client
  };

  const handleResetClient = () => {
    const defaultId = "701910325684-bld20qoqo3t40frkisckvb6gtpl9k4st.apps.googleusercontent.com";
    localStorage.removeItem("gdrive_custom_client_id");
    setClientId(defaultId);
    setIsCustomClient(false);
    showToast("Reset to default Client ID. Connect again to apply.");
    handleDisconnect();
  };

  // --- AUTHENTICATION FLOW (OAUTH 2.0 TOKEN FLOW) ---
  const handleConnect = () => {
    if (!window.google) {
      showToast("Google OAuth library is still loading. Please try again.", "error");
      return;
    }

    setAuthLoading(true);
    setErrorMsg("");

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        callback: async (tokenResponse) => {
          setAuthLoading(false);
          if (tokenResponse.error) {
            console.error(tokenResponse);
            showToast("Connection failed: " + tokenResponse.error_description, "error");
            return;
          }

          if (tokenResponse.access_token) {
            const token = tokenResponse.access_token;
            const expiry = Date.now() + tokenResponse.expires_in * 1000;
            
            setAccessToken(token);
            setTokenExpiry(expiry);
            sessionStorage.setItem("gdrive_access_token", token);
            sessionStorage.setItem("gdrive_token_expiry", expiry);
            
            showToast("Connected to Google!");
            await fetchUserInfo(token);
            await initializeDriveFolder(token);
          }
        },
        error_callback: (err) => {
          setAuthLoading(false);
          showToast("OAuth initialization error.", "error");
          console.error(err);
        }
      });

      client.requestAccessToken({ prompt: "consent" });
    } catch (err) {
      setAuthLoading(false);
      showToast("Failed to initialize Google Auth client.", "error");
      console.error(err);
    }
  };

  const handleDisconnect = () => {
    setAccessToken("");
    setTokenExpiry(0);
    setUser(null);
    setFiles([]);
    sessionStorage.removeItem("gdrive_access_token");
    sessionStorage.removeItem("gdrive_token_expiry");
    sessionStorage.removeItem("gdrive_user_info");
    showToast("Disconnected successfully.");
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const userInfo = {
          name: data.name,
          email: data.email,
          avatar: data.picture
        };
        setUser(userInfo);
        sessionStorage.setItem("gdrive_user_info", JSON.stringify(userInfo));
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // --- DRIVE FOLDER RESOLVER & LISTER ---
  const initializeDriveFolder = async (token) => {
    setLoadingFiles(true);
    try {
      // 1. Search for existing GDrive Media Host folder
      const query = encodeURIComponent("name='GDrive Media Host' and mimeType='application/vnd.google-apps.folder' and trashed=false");
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
      
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!searchRes.ok) {
        const error = await searchRes.json();
        throw new Error(error.error.message || "Failed to search folder");
      }

      const searchData = await searchRes.json();
      let folderId = "";

      if (searchData.files && searchData.files.length > 0) {
        // Use existing folder
        folderId = searchData.files[0].id;
        showToast("Found existing 'GDrive Media Host' folder.");
      } else {
        // 2. Create the folder if it doesn't exist
        const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: "GDrive Media Host",
            mimeType: "application/vnd.google-apps.folder"
          })
        });

        if (!createRes.ok) {
          const error = await createRes.json();
          throw new Error(error.error.message || "Failed to create folder");
        }

        const newFolder = await createRes.json();
        folderId = newFolder.id;
        showToast("Created new 'GDrive Media Host' folder!");
      }

      // Ensure the folder is public so that nested uploads inherit public accessibility
      await makeFilePublic(folderId, token);

      setActiveFolderId(folderId);
      localStorage.setItem("gdrive_active_folder_id", folderId);
      await fetchFiles(folderId, token);
    } catch (err) {
      setErrorMsg(err.message || "Drive initialization failed.");
      showToast(err.message || "Failed to sync folder.", "error");
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchFiles = async (folderId, token) => {
    if (!folderId || !token) return;
    setLoadingFiles(true);
    setErrorMsg("");
    try {
      const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
      const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,createdTime,thumbnailLink,webViewLink)&orderBy=createdTime desc&pageSize=1000`;
      
      const response = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || "Failed to list files");
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to retrieve files.");
      showToast("Error loading file list.", "error");
    } finally {
      setLoadingFiles(false);
    }
  };

  // --- MULTIPART FILE UPLOAD WITH PROGRESS TRACKING ---
  const uploadFile = (file) => {
    if (!accessToken || !activeFolderId) {
      showToast("Please connect to G Drive first.", "error");
      return;
    }

    const queueId = Date.now() + Math.random().toString(36).substring(2, 9);
    
    // Add to upload queue UI state
    setUploadQueue((prev) => [
      {
        id: queueId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading"
      },
      ...prev
    ]);
    setUploadDrawerOpen(true);
    setUploadDrawerCollapsed(false);

    // Set up Google Drive Multipart parameters
    const metadata = {
      name: file.name,
      parents: [activeFolderId]
    };

    const boundary = "gdrive_upload_boundary_delimiter";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target.result;
      const metadataPart = JSON.stringify(metadata);

      // Create multipart binary body
      const multipartBody = new Blob([
        delimiter,
        "Content-Type: application/json; charset=UTF-8\r\n\r\n",
        metadataPart,
        delimiter,
        `Content-Type: ${file.type || "application/octet-stream"}\r\n\r\n`,
        new Uint8Array(fileContent),
        closeDelimiter
      ], { type: `multipart/related; boundary=${boundary}` });

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      xhr.setRequestHeader("Content-Type", `multipart/related; boundary=${boundary}`);

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === queueId ? { ...item, progress: pct } : item))
          );
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const driveFile = JSON.parse(xhr.response);
            
            // Set permissions to public
            const makePublic = await makeFilePublic(driveFile.id, accessToken);
            
            if (makePublic) {
              setUploadQueue((prev) =>
                prev.map((item) => (item.id === queueId ? { ...item, progress: 100, status: "success" } : item))
              );
              showToast(`Uploaded: ${file.name}`);
              fetchFiles(activeFolderId, accessToken);
            } else {
              setUploadQueue((prev) =>
                prev.map((item) => (item.id === queueId ? { ...item, status: "error" } : item))
              );
              showToast(`Upload failed on public permissions for ${file.name}`, "error");
            }
          } catch (err) {
            setUploadQueue((prev) =>
              prev.map((item) => (item.id === queueId ? { ...item, status: "error" } : item))
            );
          }
        } else {
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === queueId ? { ...item, status: "error" } : item))
          );
          showToast(`Drive API error: ${xhr.statusText}`, "error");
        }
      };

      xhr.onerror = () => {
        setUploadQueue((prev) =>
          prev.map((item) => (item.id === queueId ? { ...item, status: "error" } : item))
        );
        showToast(`Network error uploading ${file.name}`, "error");
      };

      xhr.send(multipartBody);
    };

    reader.readAsArrayBuffer(file);
  };

  const makeFilePublic = async (fileId, token) => {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone"
        })
      });
      return response.ok;
    } catch (err) {
      console.error("Error updating permissions:", err);
      return false;
    }
  };

  // --- DELETE FILE ---
  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        showToast(`Deleted "${fileName}"`);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        if (previewItem && previewItem.id === fileId) {
          setPreviewItem(null);
        }
      } else {
        showToast("Failed to delete file from Drive.", "error");
      }
    } catch (err) {
      showToast("Error deleting file.", "error");
    }
  };

  // --- COPY DIRECT SHARING LINKS & TRIGGER CONFETTI ---
  const handleCopyLink = (fileId, mimeType) => {
    let url = "";
    if (mimeType.startsWith("image/")) {
      url = `https://lh3.googleusercontent.com/d/${fileId}`;
    } else {
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    navigator.clipboard.writeText(url).then(
      () => {
        showToast("Direct link copied to clipboard!");
        
        // Premium touch: confetti burst!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#4899ff", "#d3e3fd", "#e9eef6", "#ffffff"]
        });
      },
      () => {
        showToast("Failed to copy link.", "error");
      }
    );
  };

  // --- DRAG AND DROP HANDLING ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        uploadFile(file);
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        uploadFile(file);
      });
    }
  };

  // --- FILTER & SORT LOGIC ---
  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Tab filtering
    if (currentTab === "images") {
      result = result.filter((f) => f.mimeType.startsWith("image/"));
    } else if (currentTab === "videos") {
      result = result.filter((f) => f.mimeType.startsWith("video/"));
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(query));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdTime) - new Date(a.createdTime);
      } else if (sortBy === "oldest") {
        return new Date(a.createdTime) - new Date(b.createdTime);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [files, currentTab, searchQuery, sortBy]);

  // Format File Size
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === "0" || parseFloat(bytes) === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(parseFloat(bytes)) / Math.log(k));
    return parseFloat((parseFloat(bytes) / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Check if file is image/video
  const isImage = (mimeType) => mimeType.startsWith("image/");
  const isVideo = (mimeType) => mimeType.startsWith("video/");

  // Render file icon if thumbnail is unavailable
  const renderFileIcon = (mimeType) => {
    if (isImage(mimeType)) return <ImageIcon className="icon" style={{ strokeWidth: 1.5 }} />;
    if (isVideo(mimeType)) return <VideoIcon className="icon" style={{ strokeWidth: 1.5 }} />;
    if (mimeType.includes("audio")) return <FileAudio className="icon" style={{ strokeWidth: 1.5 }} />;
    return <FileText className="icon" style={{ strokeWidth: 1.5 }} />;
  };

  // --- MAIN RENDER ---
  return (
    <div className="app-container">
      {/* Hidden SEO Keywords Block for Search Engines (Invisible to human users) */}
      <div style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: "0"
      }}>
        <h2>Google Drive Image Upload, Google Drive Hosting, and Free GDrive CDN</h2>
        <p>
          Easily generate public direct image URLs from Google Drive. Host images, videos, and media files for free using your personal Google Drive as a public CDN storage server. Convert Google Drive share links into hotlinks and direct embedding URLs.
        </p>
      </div>
      
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="brand-section">
          <Folder className="icon" style={{ color: "#4899ff", width: 28, height: 28 }} />
          <h1 className="brand-title">GDrive Host</h1>
        </div>

        <nav style={{ flexGrow: 1 }}>
          <ul className="nav-list">
            <li>
              <button 
                onClick={() => { setCurrentTab("all"); }} 
                className={`nav-item ${currentTab === "all" ? "active" : ""}`}
                style={{ width: "100%", border: "none", background: "transparent" }}
              >
                <Grid className="icon" />
                All Files
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentTab("images"); }} 
                className={`nav-item ${currentTab === "images" ? "active" : ""}`}
                style={{ width: "100%", border: "none", background: "transparent" }}
              >
                <ImageIcon className="icon" />
                Images
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentTab("videos"); }} 
                className={`nav-item ${currentTab === "videos" ? "active" : ""}`}
                style={{ width: "100%", border: "none", background: "transparent" }}
              >
                <VideoIcon className="icon" />
                Videos
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentTab("settings"); }} 
                className={`nav-item ${currentTab === "settings" ? "active" : ""}`}
                style={{ width: "100%", border: "none", background: "transparent" }}
              >
                <Settings className="icon" />
                Settings
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setShowGuidelines(true); }} 
                className="nav-item"
                style={{ width: "100%", border: "none", background: "transparent" }}
              >
                <HelpCircle className="icon" />
                Guidelines
              </button>
            </li>
            <li>
              <a 
                href="/about" 
                className="nav-item"
                style={{ width: "100%", textDecoration: "none", display: "flex", alignItems: "center" }}
              >
                <Info className="icon" />
                About Host
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          {accessToken ? (
            <button onClick={handleDisconnect} className="btn btn-secondary" style={{ width: "100%", gap: 10, borderRadius: "24px" }}>
              <LogOut className="icon" style={{ width: 18, height: 18 }} />
              Disconnect
            </button>
          ) : (
            <button onClick={handleConnect} className="btn btn-primary" style={{ width: "100%", gap: 10, borderRadius: "24px" }}>
              <RefreshCw className="icon" style={{ width: 18, height: 18, color: "white" }} />
              Connect Drive
            </button>
          )}
        </div>
      </aside>

      {/* Main Container Layout */}
      <main className="main-layout">
        
        {/* Top Header */}
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="icon" />
            </button>
            <div className="search-bar-container">
              <Search className="search-icon icon" />
              <input
                type="text"
                placeholder="Search hosted files..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab === "settings") {
                    setCurrentTab("all");
                  }
                }}
              />
            </div>
          </div>

          <div className="header-actions">
            {user && (
              <div className="user-profile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Body Area */}
        <div className="content-body">
          
          {currentTab === "settings" ? (
            // --- SETTINGS TAB ---
            <div style={{ maxWidth: 650 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: 8 }}>Account Settings</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>
                Manage your connected Google Account session.
              </p>

              <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                {accessToken ? (
                  <>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      You are currently connected to G Drive. To disconnect your account and clear the session tokens from this browser, click the button below.
                    </p>
                    <button 
                      onClick={handleDisconnect} 
                      className="btn btn-secondary" 
                      style={{ gap: 10, borderRadius: "24px", color: "#d93025", borderColor: "#f8d7da", backgroundColor: "#ffe8ec" }}
                    >
                      <LogOut className="icon" style={{ width: 18, height: 18, color: "#d93025" }} />
                      Disconnect Account
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                      No G Drive account is currently connected.
                    </p>
                    <button 
                      onClick={handleConnect} 
                      className="btn btn-primary" 
                      style={{ gap: 10, borderRadius: "24px" }}
                    >
                      <RefreshCw className="icon" style={{ width: 18, height: 18, color: "white" }} />
                      Connect Drive
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            // --- ALL / IMAGES / VIDEOS FILE MANAGER ---
            <>
              {/* Top Folder Path bar */}
              <div className="path-bar">
                <div className="path-title">
                  <Folder className="icon" style={{ color: "#4899ff", width: 24, height: 24 }} />
                  <span>GDrive Media Host</span>
                  {activeFolderId && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 12, fontWeight: 400 }}>
                      Folder ID: {activeFolderId}
                    </span>
                  )}
                </div>
                
                {accessToken && (
                  <button 
                    onClick={() => fetchFiles(activeFolderId, accessToken)} 
                    className={`btn btn-secondary ${loadingFiles ? "disabled" : ""}`}
                    style={{ padding: "8px 16px", borderRadius: "16px", fontSize: "0.85rem" }}
                    disabled={loadingFiles}
                  >
                    <RefreshCw className={`icon ${loadingFiles ? "animate-spin" : ""}`} style={{ width: 16, height: 16 }} />
                    Sync Files
                  </button>
                )}
              </div>

              {/* Connecting prompt if not logged in */}
              {!accessToken ? (
                <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 32px", textAlign: "center", gap: 20 }}>
                  <ShieldAlert className="icon" style={{ width: 64, height: 64, color: "#4899ff" }} />
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: 8 }}>Connect to G Drive</h3>
                    <p style={{ color: "var(--text-secondary)", maxWidth: 450, fontSize: "0.9rem" }}>
                      Log in to your Google Account to authorize this app. We will create a secure, isolated folder <strong>"GDrive Media Host"</strong> in your account to host public images and videos.
                    </p>
                  </div>
                  <button onClick={handleConnect} disabled={authLoading} className="btn btn-primary" style={{ gap: 10, padding: "12px 28px" }}>
                    {authLoading ? (
                      <>
                        <Loader2 className="icon animate-spin" style={{ color: "white" }} />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="icon" style={{ color: "white" }} />
                        Connect to G Drive
                      </>
                    )}
                  </button>
                </div>
              ) : (
                // --- CONNECTED DASHBOARD CONTENT ---
                <>
                  {/* File Upload Zone */}
                  <div 
                    className={`dropzone ${dragActive ? "dragover" : ""}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-select-input").click()}
                  >
                    <input 
                      type="file" 
                      id="file-select-input" 
                      multiple 
                      onChange={handleFileSelect} 
                      style={{ display: "none" }} 
                    />
                    <UploadCloud className="dropzone-icon" />
                    <div className="dropzone-title">Drag & drop files here, or click to browse</div>
                    <div className="dropzone-desc">Supports images (JPG, PNG, GIF) and videos (MP4, WEBM)</div>
                  </div>

                  {/* Filter / Sort toolbar */}
                  <div className="toolbar">
                    <div className="filter-tabs">
                      <button 
                        onClick={() => setCurrentTab("all")} 
                        className={`filter-tab ${currentTab === "all" ? "active" : ""}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setCurrentTab("images")} 
                        className={`filter-tab ${currentTab === "images" ? "active" : ""}`}
                      >
                        Images
                      </button>
                      <button 
                        onClick={() => setCurrentTab("videos")} 
                        className={`filter-tab ${currentTab === "videos" ? "active" : ""}`}
                      >
                        Videos
                      </button>
                    </div>

                    <div className="toolbar-right">
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <ArrowUpDown className="icon" style={{ width: 16, height: 16 }} />
                        Sort by
                      </span>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        className="sort-select"
                      >
                        <option value="newest">Upload Date (Newest)</option>
                        <option value="oldest">Upload Date (Oldest)</option>
                        <option value="name">File Name</option>
                      </select>
                    </div>
                  </div>

                  {/* Empty States / Loading / File Grid */}
                  {loadingFiles && files.length === 0 ? (
                    <div className="empty-state">
                       <Loader2 className="empty-icon animate-spin" style={{ color: "#4899ff" }} />
                       <div className="empty-title">Loading files...</div>
                       <div className="empty-desc">Querying your G Drive media repository</div>
                    </div>
                  ) : errorMsg ? (
                    <div className="empty-state" style={{ color: "#ef4444" }}>
                      <AlertCircle className="empty-icon" style={{ color: "#ef4444" }} />
                      <div className="empty-title">G Drive Sync Error</div>
                      <div className="empty-desc">{errorMsg}</div>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="empty-state card">
                      <ImageIcon className="empty-icon" />
                      <div className="empty-title">No files found</div>
                      <div className="empty-desc">
                        {searchQuery ? "No matches for your search query." : "Drag and drop some images or videos to host them publically."}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Bulk actions toolbar */}
                      {selectedIds.length > 0 && (
                        <div className="bulk-toolbar" style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 16px",
                          backgroundColor: "var(--bg-active)",
                          border: "1px solid #b4d1fd",
                          borderRadius: "var(--border-radius-md)",
                          marginBottom: 16
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => setSelectedIds([])}
                              title="Clear selection"
                              style={{ padding: 6 }}
                            >
                              <X className="icon" style={{ color: "#0b57d0", width: 18, height: 18 }} />
                            </button>
                            <span style={{ fontWeight: 500, color: "#0b57d0", fontSize: "0.9rem" }}>
                              {selectedIds.length} file{selectedIds.length > 1 ? "s" : ""} selected
                            </span>
                          </div>
                          
                          <button 
                            onClick={handleBulkDelete}
                            className="btn"
                            style={{
                              backgroundColor: "#ffe8ec",
                              color: "#d93025",
                              border: "1px solid #f8d7da",
                              padding: "6px 14px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              borderRadius: "20px",
                              gap: 6
                            }}
                          >
                            <Trash2 className="icon" style={{ width: 14, height: 14, color: "#d93025" }} />
                            Delete Selected
                          </button>
                        </div>
                      )}

                      // --- MEDIA CARDS GRID ---
                      <div className="media-grid">
                      {filteredFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className={`media-card ${selectedIds.includes(file.id) ? "selected" : ""}`}
                          onClick={() => {
                            if (selectedIds.length > 0) {
                              toggleSelectFile(file.id);
                            }
                          }}
                          style={{ cursor: selectedIds.length > 0 ? "pointer" : "default" }}
                        >
                          
                          {/* Selection Checkbox */}
                          <div 
                            className="card-checkbox"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectFile(file.id);
                            }}
                          >
                            {selectedIds.includes(file.id) && (
                              <Check style={{ color: "white", width: 12, height: 12, strokeWidth: 4 }} />
                            )}
                          </div>

                          {/* Thumbnail preview container */}
                          <div className="thumbnail-container">
                            {isImage(file.mimeType) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={thumbnailUrls[file.id] || `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`} 
                                alt={file.name} 
                                className="thumbnail-img" 
                                loading="lazy"
                                onError={(e) => {
                                  // Fallback to direct download view if thumbnail fails
                                  if (e.target.src !== `https://drive.google.com/uc?export=view&id=${file.id}`) {
                                    e.target.src = `https://drive.google.com/uc?export=view&id=${file.id}`;
                                  }
                                }}
                              />
                            ) : file.thumbnailLink && isVideo(file.mimeType) ? (
                              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={thumbnailUrls[file.id] || (file.thumbnailLink.includes("=s") ? file.thumbnailLink.replace(/=s\d+/, "=s400") : file.thumbnailLink)} 
                                  alt={file.name} 
                                  className="thumbnail-img" 
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyOrigin: "center", backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "center" }}>
                                  <VideoIcon style={{ width: 32, height: 32, color: "white", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
                                </div>
                              </div>
                            ) : (
                              <div className="file-icon-placeholder">
                                {renderFileIcon(file.mimeType)}
                                <span style={{ fontSize: "0.75rem" }}>{file.mimeType.split("/")[1]?.toUpperCase()}</span>
                              </div>
                            )}

                            {/* Card Hover Action Overlay */}
                            <div className="card-overlay">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyLink(file.id, file.mimeType);
                                }} 
                                className="overlay-btn" 
                                title="Copy Public CDN URL"
                              >
                                <Copy className="icon" style={{ width: 16, height: 16, color: "#4899ff" }} />
                              </button>
                              
                              {(isImage(file.mimeType) || isVideo(file.mimeType)) && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewItem(file);
                                  }} 
                                  className="overlay-btn" 
                                  title="Preview File"
                                >
                                  <Eye className="icon" style={{ width: 16, height: 16 }} />
                                </button>
                              )}

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingFile(file);
                                  setNewName(file.name);
                                }} 
                                className="overlay-btn" 
                                title="Rename File"
                              >
                                <Edit2 className="icon" style={{ width: 16, height: 16, color: "#e37400" }} />
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file.id, file.name);
                                }} 
                                className="overlay-btn btn-delete" 
                                title="Delete File"
                              >
                                <Trash2 className="icon" style={{ width: 16, height: 16 }} />
                              </button>
                            </div>
                          </div>

                          {/* Footer card descriptions */}
                          <div className="card-info">
                            <div className="file-icon-sm">
                              {isImage(file.mimeType) ? (
                                <ImageIcon className="icon" style={{ width: 16, height: 16, color: "#4899ff" }} />
                              ) : isVideo(file.mimeType) ? (
                                <VideoIcon className="icon" style={{ width: 16, height: 16, color: "#34a853" }} />
                              ) : (
                                <FileText className="icon" style={{ width: 16, height: 16 }} />
                              )}
                            </div>
                            <div className="file-details">
                              <div className="file-name" title={file.name}>{file.name}</div>
                              <div className="file-size">{formatBytes(file.size)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- LIGHTBOX / PREVIEW MODAL --- */}
      {previewItem && (
        <div className="modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{previewItem.name}</span>
              <button className="btn-icon" onClick={() => setPreviewItem(null)}>
                <X className="icon" />
              </button>
            </div>
            
            <div className="modal-body">
              {loadingLightbox ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 0" }}>
                  <Loader2 className="icon animate-spin" style={{ width: 36, height: 36, color: "#4899ff" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Loading high-res preview...</span>
                </div>
              ) : isImage(previewItem.mimeType) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={lightboxUrl || `https://drive.google.com/thumbnail?id=${previewItem.id}&sz=w1000`} 
                  alt={previewItem.name} 
                  className="lightbox-img" 
                  onError={(e) => {
                    // Fallback to direct view link
                    if (e.target.src !== `https://drive.google.com/uc?export=view&id=${previewItem.id}`) {
                      e.target.src = `https://drive.google.com/uc?export=view&id=${previewItem.id}`;
                    }
                  }}
                />
              ) : isVideo(previewItem.mimeType) ? (
                <iframe 
                  src={`https://drive.google.com/file/d/${previewItem.id}/preview`} 
                  className="lightbox-video"
                  style={{ width: "100%", height: "450px", border: "none", borderRadius: "8px" }}
                  allow="autoplay"
                />
              ) : null}
            </div>

            <div className="modal-footer">
              <span style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Info className="icon" style={{ width: 16, height: 16 }} />
                Public direct hosting link is active.
              </span>
              <button 
                onClick={() => {
                  handleCopyLink(previewItem.id, previewItem.mimeType);
                }} 
                className="btn btn-primary"
                style={{ borderRadius: "8px" }}
              >
                <Copy className="icon" style={{ width: 16, height: 16, color: "white" }} />
                Copy CDN URL
              </button>
              <button 
                onClick={() => setPreviewItem(null)} 
                className="btn btn-secondary"
                style={{ borderRadius: "8px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING UPLOAD DRAWER (GDrive Style) --- */}
      {uploadQueue.length > 0 && uploadDrawerOpen && (
        <div className={`upload-drawer ${uploadDrawerCollapsed ? "collapsed" : ""}`}>
          <div 
            className="drawer-header" 
            onClick={() => setUploadDrawerCollapsed(!uploadDrawerCollapsed)}
          >
            <span className="drawer-title">
              Uploading {uploadQueue.filter((i) => i.status === "uploading").length} items
            </span>
            <div className="drawer-header-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                className="drawer-header-btn" 
                onClick={() => setUploadDrawerCollapsed(!uploadDrawerCollapsed)}
              >
                <ChevronRight className="icon" style={{ transform: uploadDrawerCollapsed ? "rotate(-90deg)" : "rotate(90deg)", color: "white" }} />
              </button>
              <button 
                className="drawer-header-btn" 
                onClick={() => {
                  setUploadDrawerOpen(false);
                  setUploadQueue([]);
                }}
              >
                <X className="icon" style={{ color: "white" }} />
              </button>
            </div>
          </div>

          <div className="drawer-body">
            {uploadQueue.map((item) => (
              <div key={item.id} className="upload-item">
                <div className="upload-item-info">
                  <div className="upload-item-name" title={item.name}>{item.name}</div>
                  {item.status === "uploading" && (
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  )}
                </div>
                <div className="upload-status-icon">
                  {item.status === "uploading" ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {item.progress}%
                    </span>
                  ) : item.status === "success" ? (
                    <CheckCircle2 className="icon" style={{ color: "#34a853" }} />
                  ) : (
                    <AlertCircle className="icon" style={{ color: "#ea4335" }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- GUIDELINES & GITHUB STAR MODAL --- */}
      {showGuidelines && (
        <div className="modal-overlay" onClick={handleCloseGuidelines}>
          <div className="guidelines-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <HelpCircle className="icon" style={{ color: "var(--brand-primary)", width: 24, height: 24 }} />
                <span className="modal-title" style={{ fontSize: "1.2rem", fontWeight: "600" }}>Hosting Rules & Guidelines</span>
              </div>
              <button className="btn-icon" onClick={handleCloseGuidelines}>
                <X className="icon" />
              </button>
            </div>
            
            <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(80vh - 120px)" }}>
              <div className="guidelines-grid">
                
                <div className="guidelines-item">
                  <div className="guidelines-item-icon">
                    <ImageIcon style={{ width: 18, height: 18, color: "#0b57d0" }} />
                  </div>
                  <div className="guidelines-item-content">
                    <span className="guidelines-item-title">Only Images are Fully Flexible</span>
                    <span className="guidelines-item-desc">
                      Only images support direct hotlinking URLs (`lh3.googleusercontent.com/d/FILE_ID`).
                    </span>
                  </div>
                </div>

                <div className="guidelines-item">
                  <div className="guidelines-item-icon">
                    <Info style={{ width: 18, height: 18, color: "#0b57d0" }} />
                  </div>
                  <div className="guidelines-item-content">
                    <span className="guidelines-item-title">Public Sharing</span>
                    <span className="guidelines-item-desc">
                      All files hosted through this system are shared publicly.
                    </span>
                  </div>
                </div>

                <div className="guidelines-item">
                  <div className="guidelines-item-icon warning">
                    <VideoIcon style={{ width: 18, height: 18, color: "#d93025" }} />
                  </div>
                  <div className="guidelines-item-content">
                    <span className="guidelines-item-title">Videos via iframe only</span>
                    <span className="guidelines-item-desc">
                      Videos must be embedded using the iframe preview player (`drive.google.com/file/d/FILE_ID/preview`).
                    </span>
                  </div>
                </div>

                <div className="guidelines-item">
                  <div className="guidelines-item-icon warning">
                    <ShieldAlert style={{ width: 18, height: 18, color: "#d93025" }} />
                  </div>
                  <div className="guidelines-item-content">
                    <span className="guidelines-item-title">No Custom Player UIs</span>
                    <span className="guidelines-item-desc">
                      You cannot stream files in custom HTML5 video or audio players due to CORS.
                    </span>
                  </div>
                </div>

                <div className="guidelines-item">
                  <div className="guidelines-item-icon" style={{ backgroundColor: "#e6f4ea", color: "#137333" }}>
                    <Check style={{ width: 18, height: 18, color: "#137333" }} />
                  </div>
                  <div className="guidelines-item-content">
                    <span className="guidelines-item-title">100% Free Hosting</span>
                    <span className="guidelines-item-desc">
                      Free hosting for images, videos, audio, or any files.
                    </span>
                  </div>
                </div>

              </div>

              {/* GitHub Star CTA Banner */}
              <div className="github-banner">
                <div className="github-banner-info">
                  <Github style={{ width: 28, height: 28, color: "white" }} />
                  <div className="github-banner-text">
                    <span className="github-banner-title">Star GDrive-Media-Hosting!</span>
                    <span className="github-banner-desc">
                      Please star our project on GitHub to support this free service.
                    </span>
                  </div>
                </div>
                <a 
                  href="https://github.com/Miftahul-Islam-Efaz/GDrive-Media-Hosting" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="github-star-btn"
                >
                  ⭐ Star on GitHub
                </a>
              </div>

            </div>
            
            <div className="guidelines-footer">
              <label className="dont-show-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                Don't show this again
              </label>
              <button 
                onClick={handleCloseGuidelines} 
                className="btn btn-primary"
                style={{ padding: "8px 24px", borderRadius: "20px" }}
              >
                Acknowledge & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RENAME FILE MODAL --- */}
      {renamingFile && (
        <div className="modal-overlay" onClick={() => setRenamingFile(null)}>
          <div className="modal-card" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Rename File</span>
              <button className="btn-icon" onClick={() => setRenamingFile(null)}>
                <X className="icon" />
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: "20px 24px", backgroundColor: "white", display: "block", minHeight: "auto" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New File Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                  }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "12px 24px" }}>
              <button 
                onClick={() => setRenamingFile(null)} 
                className="btn btn-secondary"
                style={{ borderRadius: "8px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleRenameSubmit} 
                className="btn btn-primary"
                style={{ borderRadius: "8px", fontSize: "0.85rem" }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GITHUB STAR REMINDER POPUP (WITH GHOST CLOSE BUTTON) --- */}
      {showStarPopup && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="star-popup-card" onClick={(e) => e.stopPropagation()}>
            {/* Very less visible close button */}
            <button 
              className="ghost-close-btn" 
              onClick={handleCloseStarPopup}
              title="Dismiss"
            >
              <X />
            </button>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-secondary)", borderRadius: "50%", padding: 16, width: 64, height: 64 }}>
              <Github style={{ width: 32, height: 32, color: "var(--brand-primary)" }} />
            </div>
            
            <h3 className="star-popup-title">Support Free Hosting!</h3>
            
            <p className="star-popup-desc">
              GDrive Media Hosting is <strong>100% Free</strong>. Support us by giving our repository a star on GitHub!
            </p>
            
            <button 
              onClick={handleStarOnGitHub} 
              className="star-popup-btn"
            >
              ⭐ Star on GitHub
            </button>
          </div>
        </div>
      )}

      {/* --- GLOBAL TOAST ALERTS --- */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast" style={{ borderLeft: t.type === "error" ? "4px solid #ef4444" : "4px solid #4899ff" }}>
            <span>{t.message}</span>
            <X 
              className="icon" 
              style={{ cursor: "pointer", color: "white", width: 16, height: 16 }} 
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))} 
            />
          </div>
        ))}
      </div>

    </div>
  );
}
