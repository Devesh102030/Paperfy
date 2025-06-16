"use client";

import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfVeiwer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Handle window resize for responsive width
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    handleResize(); // Set initial width on client
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setIsLoading(false);
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    setIsLoading(false);
    setError(error.message);
  }

  return (
    <div className="flex flex-col h-screen ">
      <div className="bg-gray-100 p-2 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
            className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={scale <= 0.5}
          >
          -
        </button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.0))}
            className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={scale >= 2.0}
          >
            +
        </button>

        </div>
          {!isLoading && !error && (
            <div className="text-sm text-gray-600">
              {numPages} page{numPages !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse text-gray-500">Loading PDF...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-full">
              <div className="text-red-500">Error: {error}</div>
            </div>
          )}

          {!error && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse text-gray-500">Loading document...</div>
                </div>
              }
              className="mx-auto"
            >
              <div className="space-y-4">
                {Array.from({ length: numPages }, (_, i) => (
                  <div
                    key={`page_${i + 1}`}
                    className="shadow-sm border border-gray-200 bg-white"
                  >
                    <Page
                      pageNumber={i + 1}
                      width={Math.min(800 * scale, containerWidth - 40)}
                      renderTextLayer={true}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="flex justify-center items-center h-96">
                          <div className="animate-pulse text-gray-500">Loading page {i + 1}...</div>
                        </div>
                      }
                    />
                  </div>
                ))}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}