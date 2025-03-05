// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
serve(async (req)=>{
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({
        error: "Method not allowed"
      }), {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Parse the form data
    const formData = await req.formData();
    const html = formData.get("html");
    const filename = formData.get("filename") || "document.pdf";
    const format = formData.get("format") || "A4";
    const landscape = formData.get("landscape") === "true";
    // Validate the HTML content
    if (!html || typeof html !== "string") {
      return new Response(JSON.stringify({
        error: "HTML content is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });
    try {
      // Create a new page
      const page = await browser.newPage();
      // Set the content of the page
      await page.setContent(html, {
        waitUntil: "networkidle0"
      });
      // Generate the PDF
      const pdfBuffer = await page.pdf({
        format: format,
        landscape,
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm"
        },
        preferCSSPageSize: true
      });
      // Close the browser
      await browser.close();
      // Return the PDF as a response
      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`
        }
      });
    } finally{
      // Ensure the browser is closed even if an error occurs
      if (browser) {
        await browser.close();
      }
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate PDF"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
