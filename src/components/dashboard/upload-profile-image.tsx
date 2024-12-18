"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, Edit, File, Upload, X } from "lucide-react"

import { UploadDropzone } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FileUploadModalProps extends React.HTMLProps<typeof Button> {
  imageFor: "profile" | "banner"
}

export function FileUploadModal({ imageFor, ...props }: FileUploadModalProps) {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadComplete, setUploadComplete] = useState(false)

  async function handleUpload(imageUrl: string) {
    try {
      const res = await axios.post("/api/student/image", { imageUrl, imageFor })
      setUploadComplete(true)
      if (res.status === 201) router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed!",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          variant={"outline"}
          className={cn(
            "absolute bottom-1 right-1 p-1 rounded-full",
            props.className
          )}
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
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors`}
          >
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                toast({
                  title: "Image uploaded!",
                })
                handleUpload(res[0].url)
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
            />
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
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFiles(files.filter((f) => f !== file))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
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
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
