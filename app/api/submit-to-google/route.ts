import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Get the Google Apps Script URL from environment variables
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

    if (!googleScriptUrl) {
      console.error("Google Apps Script URL not configured")
      return NextResponse.json(
        {
          success: false,
          message: "Google integration not configured. Please set NEXT_PUBLIC_GOOGLE_SCRIPT_URL environment variable.",
        },
        { status: 500 },
      )
    }

    // Ensure consistent field structure with all fields present
    const structuredData = {
      timestamp: data.timestamp || new Date().toISOString(),
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
      designProjectFile: data.designProjectFile || null,
    }

    // Log the form submission data for debugging
    console.log("IEDC Form Submission Received:", {
      timestamp: structuredData.timestamp,
      name: structuredData.name,
      department: structuredData.department,
      section: structuredData.section,
      phoneNumber: structuredData.phoneNumber,
      email: structuredData.email,
      position: structuredData.position,
      otherSocietyExecom: structuredData.otherSocietyExecom,
      whichSociety: structuredData.whichSociety,
      previousExperience: structuredData.previousExperience ? "Present" : "Missing",
      githubLink: structuredData.githubLink,
      hasDesignProjectFile: !!structuredData.designProjectFile,
      totalFields: Object.keys(structuredData).length,
    })

    // Send structured data to Google Apps Script
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(structuredData),
    })

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type");
    let result;
    if (contentType && contentType.includes("application/json")) {
        result = await response.json();
    } else {
        const text = await response.text();
        if (text.startsWith("<!DOCTYPE html>")) {
            // Extract error message from HTML response
            const errorMatch = text.match(/<div[^>]*>(.*?)<\/div>/g);
            const errorMessage = errorMatch ? 
                errorMatch[errorMatch.length - 1]?.replace(/<[^>]*>/g, '') : 
                'Unknown Google Apps Script error';
            
            console.error("Google Apps Script detailed error:", {
                status: response.status,
                errorMessage,
                fullResponse: text.substring(0, 500)
            });

            throw new Error(
                `Google Apps Script error: ${errorMessage}\n` +
                `Status: ${response.status}\n` +
                `Check Apps Script permissions and logs for more details.`
            );
        }
        throw new Error(`Unexpected response from Google Apps Script: ${text.substring(0, 100)}...`);
    }

    if (!result.success) {
      throw new Error(result.message || "Google Apps Script returned an error")
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully to Google Sheets and Drive",
      submissionId: `IEDC_${Date.now()}`,
      timestamp: structuredData.timestamp,
      fileUploaded: result.fileUploaded || false,
      fileUrl: result.fileUrl || null,
    })
  } catch (error) {
    console.error("Form submission error:", error)

    // Return error response with more details
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
