import Tesseract from "tesseract.js";
import sharp from "sharp";

export class OCRService {
  // Process image and extract text
  async extractText(imageBuffer: Buffer): Promise<string> {
    try {
      // Preprocess image for better OCR results
      const processedImage = await this.preprocessImage(imageBuffer);

      // Perform OCR
      const result = await Tesseract.recognize(processedImage, "eng", {
        logger: (m) => console.log(m),
      });

      return result.data.text.trim();
    } catch (error) {
      console.error("OCR text extraction error:", error);
      throw new Error("Failed to extract text from image");
    }
  }

  // Preprocess image for better OCR accuracy
  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(imageBuffer)
        .greyscale()
        .normalize()
        .sharpen()
        .threshold(128)
        .toBuffer();
    } catch (error) {
      console.error("Image preprocessing error:", error);
      return imageBuffer; // Return original if preprocessing fails
    }
  }

  // Verify signature document
  async verifySignatureDocument(imageBuffer: Buffer): Promise<{
    isValid: boolean;
    extractedText: string;
    confidence: number;
    keywords: string[];
  }> {
    try {
      // Extract text from the signature document
      const result = await Tesseract.recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text.trim().toLowerCase();
      const confidence = result.data.confidence;

      // Keywords that might indicate a valid signature document
      const validKeywords = [
        "signature",
        "consent",
        "agreement",
        "donor",
        "patient",
        "organ",
        "authorization",
        "medical",
        "hospital",
        "date",
        "name",
        "signed",
      ];

      // Check for presence of keywords
      const foundKeywords = validKeywords.filter((keyword) =>
        extractedText.includes(keyword),
      );

      // Basic validation criteria
      const hasMinimumLength = extractedText.length > 10;
      const hasKeywords = foundKeywords.length >= 2;
      const hasGoodConfidence = confidence > 50;

      const isValid = hasMinimumLength && hasKeywords && hasGoodConfidence;

      return {
        isValid,
        extractedText: result.data.text.trim(),
        confidence,
        keywords: foundKeywords,
      };
    } catch (error) {
      console.error("Signature verification error:", error);
      return {
        isValid: false,
        extractedText: "",
        confidence: 0,
        keywords: [],
      };
    }
  }

  // Advanced signature verification with pattern matching
  async advancedSignatureVerification(
    imageBuffer: Buffer,
    expectedPatientName?: string,
  ): Promise<{
    isValid: boolean;
    extractedText: string;
    confidence: number;
    matchedPatterns: string[];
    nameMatch: boolean;
  }> {
    try {
      const result = await Tesseract.recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text.trim();
      const normalizedText = extractedText.toLowerCase();

      // Signature document patterns
      const patterns = [
        /consent.*organ.*donation/i,
        /authorization.*medical.*treatment/i,
        /patient.*signature/i,
        /donor.*agreement/i,
        /medical.*consent/i,
        /organ.*transplant.*consent/i,
        /signature.*date/i,
        /\d{1,2}\/\d{1,2}\/\d{2,4}/i, // Date patterns
        /signed.*by/i,
      ];

      const matchedPatterns = patterns
        .filter((pattern) => pattern.test(extractedText))
        .map((pattern) => pattern.toString());

      // Check if expected patient name is found
      let nameMatch = false;
      if (expectedPatientName) {
        const nameParts = expectedPatientName.toLowerCase().split(" ");
        nameMatch = nameParts.some(
          (part) => part.length > 2 && normalizedText.includes(part),
        );
      }

      // Advanced validation criteria
      const hasPatterns = matchedPatterns.length >= 1;
      const hasMinimumLength = extractedText.length > 20;
      const hasGoodConfidence = result.data.confidence > 60;

      const isValid = hasPatterns && hasMinimumLength && hasGoodConfidence;

      return {
        isValid,
        extractedText,
        confidence: result.data.confidence,
        matchedPatterns,
        nameMatch,
      };
    } catch (error) {
      console.error("Advanced signature verification error:", error);
      return {
        isValid: false,
        extractedText: "",
        confidence: 0,
        matchedPatterns: [],
        nameMatch: false,
      };
    }
  }

  // Extract specific fields from medical documents
  async extractMedicalFields(imageBuffer: Buffer): Promise<{
    patientName?: string;
    date?: string;
    hospitalName?: string;
    signature?: boolean;
    organType?: string;
  }> {
    try {
      const result = await Tesseract.recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;

      // Extract potential fields using regex patterns
      const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
      const namePattern = /name[:\s]*([a-z\s]+)/i;
      const hospitalPattern = /hospital[:\s]*([a-z\s]+)/i;
      const organPattern = /(kidney|liver|heart|lung|pancreas|cornea)/i;

      const dateMatch = text.match(datePattern);
      const nameMatch = text.match(namePattern);
      const hospitalMatch = text.match(hospitalPattern);
      const organMatch = text.match(organPattern);

      return {
        patientName: nameMatch ? nameMatch[1].trim() : undefined,
        date: dateMatch ? dateMatch[1] : undefined,
        hospitalName: hospitalMatch ? hospitalMatch[1].trim() : undefined,
        signature:
          text.toLowerCase().includes("signature") ||
          text.toLowerCase().includes("signed"),
        organType: organMatch ? organMatch[1].toLowerCase() : undefined,
      };
    } catch (error) {
      console.error("Medical field extraction error:", error);
      return {};
    }
  }
}

export const ocrService = new OCRService();
