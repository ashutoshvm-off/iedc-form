import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink } from "lucide-react"

export function SetupInstructions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Google Sheets & Drive Setup Guide
          </CardTitle>
          <CardDescription>Follow these steps to connect your form to Google Sheets and Drive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                1
              </Badge>
              <div>
                <h4 className="font-medium">Create Google Sheet</h4>
                <p className="text-sm text-muted-foreground">
                  Go to{" "}
                  <a
                    href="https://sheets.google.com"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Google Sheets <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and create a new spreadsheet named "IEDC Execom Applications"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                2
              </Badge>
              <div>
                <h4 className="font-medium">Copy Sheet ID</h4>
                <p className="text-sm text-muted-foreground">
                  From the URL: https://docs.google.com/spreadsheets/d/
                  <code className="bg-gray-100 px-1 rounded">SHEET_ID</code>/edit
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                3
              </Badge>
              <div>
                <h4 className="font-medium">Create Google Apps Script</h4>
                <p className="text-sm text-muted-foreground">
                  Go to{" "}
                  <a
                    href="https://script.google.com"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Google Apps Script <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and create a new project
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                4
              </Badge>
              <div>
                <h4 className="font-medium">Paste the Script Code</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the code from <code>scripts/google-apps-script.js</code> and replace YOUR_SPREADSHEET_ID with
                  your actual Sheet ID
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                5
              </Badge>
              <div>
                <h4 className="font-medium">Deploy as Web App</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Deploy" → "New Deployment" → Choose "Web app" → Set execute as "Me" and access to "Anyone" →
                  Deploy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                6
              </Badge>
              <div>
                <h4 className="font-medium">Copy Web App URL</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the deployment URL and set it as <code>NEXT_PUBLIC_GOOGLE_SCRIPT_URL</code> in your environment
                  variables
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variable</CardTitle>
          <CardDescription>Add this to your .env.local file</CardDescription>
        </CardHeader>
        <CardContent>
          <code className="block bg-gray-100 p-3 rounded text-sm">
            NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
          </code>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What This Setup Does</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Automatically saves all form data to Google Sheets
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Uploads Design Lead project files to Google Drive
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Creates organized folder: "IEDC Applications - Design Lead Projects"
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Files are named with applicant name for easy identification
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Stores Google Drive file URLs in the spreadsheet
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No complex API setup required
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
