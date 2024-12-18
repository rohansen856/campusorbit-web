"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, File, CheckCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function FileUploadModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    const handleUpload = async () => {
        setUploading(true)
        // Simulating upload process
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setUploading(false)
        setUploadComplete(true)
    }

    const resetUpload = () => {
        setFiles([])
        setUploadComplete(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size={"icon"}
                    variant={"outline"}
                    className="absolute bottom-1 right-1 p-1 rounded-full"
                >
                    <Edit className="size-8 cursor-pointer bg-secondary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Drag and drop files here or click to select files
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive
                                ? "border-primary bg-primary/10"
                                : "border-gray-300"
                        }`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p className="text-primary">
                                Drop the files here ...
                            </p>
                        ) : (
                            <div>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">
                                    Drag 'n' drop some files here, or click to
                                    select files
                                </p>
                            </div>
                        )}
                    </div>
                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-4 space-y-2"
                            >
                                {files.map((file) => (
                                    <motion.li
                                        key={file.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <File className="h-5 w-5 text-primary" />
                                            <span className="text-sm">
                                                {file.name}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setFiles(
                                                    files.filter(
                                                        (f) => f !== file
                                                    )
                                                )
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                    {files.length > 0 && !uploadComplete && (
                        <Button
                            className="mt-4 w-full"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    )}
                    {uploadComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center"
                        >
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <p className="mt-2 text-lg font-semibold text-green-600">
                                Upload Complete!
                            </p>
                            <Button className="mt-4" onClick={resetUpload}>
                                Upload More Files
                            </Button>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
