"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GoogleSetupSimple() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Get Google Sheet ID</CardTitle>
          <CardDescription>Create a Google Sheet and copy its ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            <span className="text-sm">
              Go to{" "}
              <a href="https://sheets.google.com" className="text-blue-600 hover:underline">
                Google Sheets
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            <span className="text-sm">Create a new sheet named "IEDC Execom Applications"</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            <span className="text-sm">Copy the ID from the URL:</span>
          </div>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
            https://docs.google.com/spreadsheets/d/<span className="bg-yellow-200">SHEET_ID_HERE</span>/edit
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Get Google Drive Folder ID</CardTitle>
          <CardDescription>Create a folder in Google Drive for file uploads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            <span className="text-sm">
              Go to{" "}
              <a href="https://drive.google.com" className="text-blue-600 hover:underline">
                Google Drive
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            <span className="text-sm">Create a new folder named "IEDC Design Files"</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            <span className="text-sm">Copy the ID from the URL:</span>
          </div>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
            https://drive.google.com/drive/folders/<span className="bg-yellow-200">FOLDER_ID_HERE</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Add Environment Variables</CardTitle>
          <CardDescription>Add these to your .env.local file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm">NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm">NEXT_PUBLIC_GOOGLE_DRIVE_ID=your_drive_folder_id_here</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("NEXT_PUBLIC_GOOGLE_DRIVE_ID=your_drive_folder_id_here")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>That's It! 🎉</CardTitle>
          <CardDescription>Your form will now save data to your Google Sheet and Drive folder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            The form will automatically organize your data and store uploaded files in the specified locations.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
