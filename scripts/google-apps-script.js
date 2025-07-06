// This script should be deployed as a Google Apps Script
// Go to script.google.com and create a new project

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents)

    // Get or create the spreadsheet
    const spreadsheetId = "1_S0BRWc5E1tfKBuS7xrxKcZh2eFgPxkU3k6-ijYCZDI" // Replace with your Google Sheet ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet()

    // Set up headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      sheet
        .getRange(1, 1, 1, 12) // Ensure this matches the actual header count
        .setValues([
          [
            "Timestamp",
            "Name",
            "Department",
            "Section",
            "Phone",
            "Email",
            "Position",
            "Other Society Execom",
            "Which Society",
            "Experience",
            "GitHub Link",
            "Design Project File URL",
          ],
        ])
    }

    // Handle Design Lead file upload to Google Drive if present
    let designFileUrl = ""
    if (data.designProjectFile && data.position === "Design Lead") {
      designFileUrl = uploadDesignProjectToGoogleDrive(data.designProjectFile, data.name)
    }

    // Add the data to the sheet
    const rowData = [
      data.timestamp,
      data.name,
      data.department,
      data.section,
      data.phoneNumber,
      data.email,
      data.position,
      data.otherSocietyExecom,
      data.whichSociety || "",
      data.previousExperience,
      data.githubLink || "",
      designFileUrl,
    ]

    // Ensure the sheet always has 12 columns (header) before appending
    const headerColumns = 12; // Use fixed count instead of reading from sheet
    if (rowData.length !== headerColumns) {
      throw new Error("Row data does not match header column count: " + rowData.length + " vs " + headerColumns);
    }

    sheet.appendRow(rowData)

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Data saved successfully",
        fileUploaded: !!designFileUrl,
        fileUrl: designFileUrl,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function uploadDesignProjectToGoogleDrive(fileData, applicantName) {
  try {
    // Create the file from base64 data
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.data),
      fileData.type,
      `${applicantName}_DesignProject_${fileData.name}`,
    )

    // Get or create the folder for Design Lead uploads
    const folderName = "IEDC Applications - Design Lead Projects"
    let folder

    const folders = DriveApp.getFoldersByName(folderName)
    if (folders.hasNext()) {
      folder = folders.next()
    } else {
      folder = DriveApp.createFolder(folderName)
      // Make the folder viewable by anyone with the link
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    }

    // Upload the file to the folder
    const file = folder.createFile(blob)

    // Make the file viewable by anyone with the link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

    // Add description to the file
    file.setDescription(
      `Design project uploaded by ${applicantName} for IEDC Design Lead position on ${new Date().toISOString()}`,
    )

    // Return the file URL
    return file.getUrl()
  } catch (error) {
    console.error("Design project file upload error:", error)
    return "File upload failed: " + error.toString()
  }
}

// Test function to verify the script works
function testScript() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: "Test User",
    department: "CSE",
    section: "A",
    phoneNumber: "1234567890",
    email: "test@example.com",
    position: "Design Lead",
    otherSocietyExecom: "No",
    whichSociety: "",
    previousExperience: "Test experience",
    githubLink: "",
    designProjectFile: {
      name: "test-design.jpg",
      type: "image/jpeg",
      data: "base64-encoded-data-here",
    },
  }

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  }

  const result = doPost(mockEvent)
  console.log(result.getContent())
}

