"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebaseConfig";
import AddDataModal from "../components/AddDataModal";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState("notes");

  const [showModal, setShowModal] = useState(false);

  const providerRef = useRef(new GoogleAuthProvider());
  const loadingRef = useRef(false);
  const authInitializedRef = useRef(false);

  const getAuthHeaders = async () => {
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const login = async () => {
    await signInWithPopup(auth, providerRef.current);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // ✅ prevents duplicate fetch calls
  const loadFiles = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    try {
      const headers = await getAuthHeaders();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/listFiles`;

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Request failed");

      setFiles(data);
    } catch (e) {
      console.error(e);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // ❌ OLD: refetching entire DB after delete
  // ✅ NEW: update local state only
  const deleteFile = async (collection, docId) => {
    try {
      const headers = await getAuthHeaders();

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/deleteFile?collection=${collection}&id=${docId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      setFiles((prev) => ({
        ...prev,
        [collection]: prev[collection].filter((f) => f.id !== docId),
      }));
      alert("File deleted successfully...");
    } catch (e) {
      console.error(e);
      alert("Error :" + e.message);
    }
  };

  // ✅ FIX: prevent double auth initialization
  useEffect(() => {
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        await loadFiles();
      }
    });

    return unsub;
  }, [loadFiles]);

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "assignments", label: "Assignments" },
    { key: "solvedPapers", label: "Solved Papers" },
  ];

  const currentFiles = files[activeTab] || [];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-900">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="bg-white shadow-lg rounded-xl p-8 w-[400px] text-center">
          <h1 className="text-3xl font-bold">Sharma Education</h1>
          <p className="text-gray-600 mt-2">IGNOU Admin Panel</p>

          <button
            onClick={login}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 w-full"
          >
            Sign In With Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* HEADER */}
        <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sharma Education</h1>
            <p className="text-gray-600">IGNOU Admin Panel</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Metadata
            </button>

            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto mt-6 px-6">
          <div className="flex gap-3 border-b pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === tab.key
                    ? "bg-white shadow text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FILE LIST */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid gap-4">
            {currentFiles.length === 0 && (
              <div className="bg-white rounded-lg shadow p-4 text-gray-700">
                No files found
              </div>
            )}

            {currentFiles.map((file, index) => (
              <div
                key={file.id || `${file.storagePath}-${index}`}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{file.name}</h3>

                  <p className="text-sm text-gray-800">
                    {(file.pdfSize / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <p className="text-sm text-gray-800">
                    Type:{" "}
                    {file.type === 1
                      ? "Notes"
                      : file.type === 2
                      ? "Assignments"
                      : "Solved Papers"}
                  </p>

                  <p className="text-sm text-gray-700">
                    {file.storagePath}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this file?")) {
                      deleteFile(activeTab, file.id);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddDataModal
        open={showModal}
        onClose={() => setShowModal(false)}
        files={[
          ...(files.notes || []),
          ...(files.assignments || []),
          ...(files.solvedPapers || []),
        ]}
        onSuccess={loadFiles}
      />
    </>
  );
}