"use client"

import React, { useEffect, useState } from "react"
import { CameraIcon, UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import Camera from "@/components/ui/camera"
import { CameraProvider } from "@/components/ui/camera-provider"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

function Inventory() {
  const [showDialog, setShowDialog] = useState(false)
  const [capturedImages, setCapturedImages] = useState<any[]>([])

  useEffect(() => {
    console.log(capturedImages)
  }, [capturedImages])

  return (
    <CameraProvider>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">Add product image</h3>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Dialog
                open={showDialog}
                onOpenChange={(open) => setShowDialog(open)}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-5 w-5" />
                    Capture Photo
                    <span className="sr-only">Capture</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-svh w-svw max-w-full p-0">
                  <Camera
                    onClosed={() => {
                      setShowDialog(false)
                    }}
                    onCapturedImages={(images: any) => {
                      setCapturedImages(images)
                      setShowDialog(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {/* Display captured images */}
          </div>
        </div>
      </main>
    </CameraProvider>
  )
}

export default Inventory
