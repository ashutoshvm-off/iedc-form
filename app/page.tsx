"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Github, Palette, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface FormData {
  name: string
  department: string
  section: string
  semester: string
  phoneNumber: string
  email: string
  position: string
  previousExperience: string
  githubLink?: string
  designProjectFile?: File
  otherSocietyExecom: string
  whichSociety?: string
}

const departments = ["CSE", "AI", "DS", "EEE", "ECE", "EBE", "CE", "ME"]

// const sections = ["A", "B", "C"]

const semesters = [
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
]

const positions = [
  "IEDC Lead",
  "Event Lead and IPR",
  "Technology Lead",
  "Quality and Operations Lead",
  "Finance Lead",
  "Creative and Innovation Lead",
  "Design Lead",
  "Community Lead",
  "Branding and Marketing Lead",
  "Women Entrepreneurship Lead",
]

export default function IEDCExecomForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    department: "",
    section: "",
    semester: "",
    phoneNumber: "",
    email: "",
    position: "",
    previousExperience: "",
    otherSocietyExecom: "",
    whichSociety: "",
  })

  const [backgroundImage, setBackgroundImage] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.section) {
      newErrors.section = "Semester is required"
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email must contain @ symbol"
    }

    if (!formData.position) {
      newErrors.position = "Position is required"
    }

    if (!formData.otherSocietyExecom) {
      newErrors.otherSocietyExecom = "Please select if you are in any other society execom"
    }

    if (formData.otherSocietyExecom === "Yes" && !formData.whichSociety?.trim()) {
      newErrors.whichSociety = "Please specify which society you are part of"
    }

    if (!formData.previousExperience.trim()) {
      newErrors.previousExperience = "Previous experience is required"
    }

    if (formData.position === "Technology Lead" && !formData.githubLink?.trim()) {
      newErrors.githubLink = "GitHub link is required for Technology Lead position"
    }

    if (formData.position === "Design Lead" && !formData.designProjectFile) {
      newErrors.designProjectFile = "Recent project upload is required for Design Lead position"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (file: File, type: "background" | "designProject") => {
    if (type === "background") {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (type === "designProject") {
      setFormData((prev) => ({ ...prev, designProjectFile: file }))
      if (errors.designProjectFile) {
        setErrors((prev) => ({ ...prev, designProjectFile: "" }))
      }
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const submitToGoogle = async (data: FormData) => {
    // Convert design project file to base64 if present
    let designProjectFileData = null

    if (data.designProjectFile) {
      try {
        const base64 = await convertFileToBase64(data.designProjectFile)
        designProjectFileData = {
          name: data.designProjectFile.name,
          type: data.designProjectFile.type,
          data: base64.split(",")[1], // Remove data:image/jpeg;base64, prefix
        }
      } catch (fileError) {
        console.error("Design project file conversion error:", fileError)
        throw new Error("Failed to process uploaded design project file")
      }
    }

    // Ensure all fields are included with default values
    const payload = {
      name: data.name || "",
      department: data.department || "",
      section: data.section || "",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
      position: data.position || "",
      otherSocietyExecom: data.otherSocietyExecom || "",
      whichSociety: data.whichSociety || "",
      previousExperience: data.previousExperience || "",
      githubLink: data.githubLink || "",
      designProjectFile: designProjectFileData,
      timestamp: new Date().toISOString(),
      // Remove these environment variables from payload as they're not form data
      // sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      // driveId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ID,
    }

    console.log("Submitting payload:", {
      ...payload,
      designProjectFile: payload.designProjectFile ? "Project file attached" : "No project file",
    })

    // Call our API route which will handle the Google integration
    const response = await fetch("/api/submit-to-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorData: any = { message: "Network error" };
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json().catch(() => ({ message: "Network error" }));
      } else {
        errorData = { message: await response.text() };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || "Submission failed")
    }

    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitToGoogle(formData)
      console.log("Submission successful:", result)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)

      // More user-friendly error handling
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

      alert(
        `There was an error submitting your application: ${errorMessage}. Please check your internet connection and try again.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          {backgroundImage ? (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          ) : (
            <Image src="/images/iedc.png" alt="IEDC Background" fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md backdrop-blur-sm bg-white/95">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-700">Application Submitted!</h2>
                <p className="text-muted-foreground">
                  Thank you for applying to the IEDC ASIET Executive Committee.  We will review your application and
                  get back to you soon.
                </p>

                {/* WhatsApp Join Section */}
                {/* <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Join Our WhatsApp Group!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Stay updated with important announcements, interview schedules, and IEDC activities by joining our
                    official WhatsApp grou
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open("https://chat.whatsapp.com/your-group-link-here", "_blank")}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    Join WhatsApp Group
                  </Button>
                  <p className="text-xs text-green-600 mt-2">
                    Click the button above to join our official IEDC ASIET WhatsApp group
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        {backgroundImage ? (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <Image src="/images/iedc.png" alt="IEDC Background" fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-2xl mx-auto pt-4">
          <Card className="mb-6 backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-700">IEDC ASIET</CardTitle>
              <CardDescription className="text-lg">Executive Committee Application Form</CardDescription>
            </CardHeader>
          </Card>

          {/* Background Image Upload */}
          <Card className="mb-6 backdrop-blur-sm bg-white/95"></Card>

          <Card className="backdrop-blur-sm bg-white/95">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <Label htmlFor="section">Semester *</Label>
                  <Select value={formData.section} onValueChange={(value) => handleInputChange("section", value)}>
                    <SelectTrigger className={errors.section ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.section && <p className="text-sm text-red-500">{errors.section}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                      handleInputChange("phoneNumber", value)
                    }}
                    placeholder="Enter 10-digit phone number"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Position Applying For *</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select the position you're applying for" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                </div>

                {/* Other Society Execom */}
                <div className="space-y-2">
                  <Label htmlFor="otherSociety">Are you part of any other society execom? *</Label>
                  <Select
                    value={formData.otherSocietyExecom}
                    onValueChange={(value) => handleInputChange("otherSocietyExecom", value)}
                  >
                    <SelectTrigger className={errors.otherSocietyExecom ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Yes or No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.otherSocietyExecom && <p className="text-sm text-red-500">{errors.otherSocietyExecom}</p>}
                </div>

                {/* Which Society - Shows only if Yes is selected */}
                {formData.otherSocietyExecom === "Yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="whichSociety">Which society are you part of? *</Label>
                    <Input
                      id="whichSociety"
                      value={formData.whichSociety || ""}
                      onChange={(e) => handleInputChange("whichSociety", e.target.value)}
                      placeholder="Enter the name of the society (name all with a , if in multiple)"
                      className={errors.whichSociety ? "border-red-500" : ""}
                    />
                    {errors.whichSociety && <p className="text-sm text-red-500">{errors.whichSociety}</p>}
                  </div>
                )}

                {/* Previous Experience - Shows after position selection */}
                {formData.position && (
                  <div className="space-y-2">
                    <Label htmlFor="experience">Previous Experience *</Label>
                    <Textarea
                      id="experience"
                      value={formData.previousExperience}
                      onChange={(e) => handleInputChange("previousExperience", e.target.value)}
                      placeholder="Describe your previous experience relevant to this position..."
                      rows={4}
                      className={errors.previousExperience ? "border-red-500" : ""}
                    />
                    {errors.previousExperience && <p className="text-sm text-red-500">{errors.previousExperience}</p>}
                  </div>
                )}

                {/* GitHub Link for Technology Lead */}
                {formData.position === "Technology Lead" && (
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Profile Link *
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.githubLink || ""}
                      onChange={(e) => handleInputChange("githubLink", e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className={errors.githubLink ? "border-red-500" : ""}
                    />
                    {errors.githubLink && <p className="text-sm text-red-500">{errors.githubLink}</p>}
                  </div>
                )}

                {/* Design Project Upload for Design Lead */}
                {formData.position === "Design Lead" && (
                  <div className="space-y-2">
                    <Label htmlFor="design-project-upload" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Upload Recent Project *
                    </Label>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50/50">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <Input
                        id="design-project-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, "designProject")
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-blue-700 mt-2 font-medium">
                        Upload a recent design project you've completed
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Accepted formats: JPG, JPEG, PNG, PDF (Max 10MB)</p>
                      {formData.designProjectFile && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          Selected: {formData.designProjectFile.name}
                        </p>
                      )}
                    </div>
                    {errors.designProjectFile && <p className="text-sm text-red-500">{errors.designProjectFile}</p>}
                  </div>
                )}

                <Alert className="backdrop-blur-sm bg-blue-50/80">
                  <AlertDescription>
                    Make sure to fill all the required fields marked with an asterisk (*). If you have any
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
