"use client";

import { useState } from "react";

export default function AddDataModal({
  open,
  onClose,
  files,
  onSuccess,
}) {
  const [fileName, setFileName] = useState("");
  const [pdfSize, setPdfSize] = useState(0);

  const [desc, setDesc] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [type, setType] = useState("notes");
  const productType = {
    notes : 1 ,
    assignments : 2 ,
    solvedPapers : 3
  }
  const productIds = {
     notes : "notes_01" ,
     assignments : "assignments_01" ,
     solvedPapers : "solved_papers_01"
  }
  if (!open) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PDF check
    if (
      file.type !== "application/pdf" &&
      !file.name.endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed");
      return;
    }

    // duplicate check (frontend safety only)
    const duplicate = files.some(
      (item) => item.name === file.name
    );

    if (duplicate) {
      alert("File already exists");
      return;
    }

    setFileName(file.name);
    setPdfSize(file.size);

  };

  const saveMetadata = async () => {
    if (!fileName) {
      alert("Please select a PDF");
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/addFile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fileName,
            pdfSize,
            storagePath : `/${type}/${fileName}`,
            desc,
            type : productType[type],
            productId : isFree ? null : productIds[type],
            uploadDate: Date.now(),
            collection : type
          }),
        }
      );

      onSuccess();
      onClose();

      // reset
      setFileName("");
      setPdfSize(0);
      setDesc("");
      setType("notes");
      setIsFree(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-gray-900">
      
      <div className="bg-white rounded-xl p-6 w-[600px] shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Add Metadata
          </h2>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* FILE INPUT */}
        <input 
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="text-gray-800 bg-blue-200 m-2 p-2"
        />

        <div className="mt-4 text-gray-800">
          <p>Name: {fileName}</p>
          <p>
            Size:{" "}
            {(pdfSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        {/* DESCRIPTION */}
        <textarea
          className="w-full border rounded mt-4 p-2 text-gray-900"
          rows={4}
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* FREE / PAID */}
        <div className="mt-4 text-gray-900">
          <p className="font-medium">Free / Paid</p>

          <label className="mr-4">
            <input
              type="radio"
              checked={isFree}
              onChange={() => setIsFree(true)}
            />
            {" "}Free
          </label>

          <label>
            <input
              type="radio"
              checked={!isFree}
              onChange={() => setIsFree(false)}
            />
            {" "}Paid
          </label>
        </div>

        {/* TYPE */}
        <div className="mt-4 text-gray-900">
          <p className="font-medium">Type</p>

          <label className="mr-4">
            <input
              type="radio"
              checked={type === "notes"}
              onChange={() => setType("notes")}
            />
            {" "}Notes
          </label>

          <label className="mr-4">
            <input
              type="radio"
              checked={type === "assignments"}
              onChange={() => setType("assignments")}
            />
            {" "}Assignments
          </label>

          <label>
            <input
              type="radio"
              checked={type === "solvedPapers"}
              onChange={() => setType("solvedPapers")}
            />
            {" "}Solved Papers
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={saveMetadata}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}