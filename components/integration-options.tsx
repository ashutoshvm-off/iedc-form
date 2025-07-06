import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function IntegrationOptions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Google Forms
            <Badge variant="secondary">Recommended</Badge>
          </CardTitle>
          <CardDescription>Create a Google Form and redirect users to it</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            <li>• No coding required</li>
            <li>• Automatic Google Sheets integration</li>
            <li>• Built-in file uploads</li>
            <li>• Free and reliable</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Services</CardTitle>
          <CardDescription>Use Zapier, Make.com, or similar services</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            <li>• Easy setup with visual interface</li>
            <li>• Connect to multiple services</li>
            <li>• Automated workflows</li>
            <li>• No server management</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Integration</CardTitle>
          <CardDescription>Send form data via email using EmailJS</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            <li>• Simple email notifications</li>
            <li>• No backend required</li>
            <li>• Quick setup</li>
            <li>• Good for small volumes</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Storage</CardTitle>
          <CardDescription>Use Supabase, Firebase, or similar services</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            <li>• Full database functionality</li>
            <li>• Real-time updates</li>
            <li>• User authentication</li>
            <li>• Scalable solution</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
