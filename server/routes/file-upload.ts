import express from "express";
import multer from "multer";
import path from "path";
import { authenticateHospital } from "../middleware/auth.js";
import { ipfsService } from "../services/ipfs.js";
import { ocrService } from "../services/ocr.js";
import { blockchainService } from "../services/blockchain.js";
import { pool } from "../config/database.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) and PDF files are allowed"));
    }
  },
});

// Upload and process signature document
router.post(
  "/signature",
  authenticateHospital,
  upload.single("signature"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const hospital_id = req.hospital?.hospital_id;
      const { record_type, record_id, patient_name } = req.body;

      if (!record_type || !record_id) {
        return res.status(400).json({
          success: false,
          error: "Record type and ID are required",
        });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${record_type}_${record_id}_${timestamp}_signature.${req.file.originalname.split(".").pop()}`;

      // Upload to IPFS
      const ipfsHash = await ipfsService.pinFile(req.file.buffer, fileName, {
        hospital_id,
        record_type,
        record_id,
        upload_time: new Date().toISOString(),
      });

      // Perform OCR verification
      let ocrResult = null;
      if (req.file.mimetype.startsWith("image/")) {
        try {
          ocrResult = await ocrService.advancedSignatureVerification(
            req.file.buffer,
            patient_name,
          );
        } catch (ocrError) {
          console.error("OCR verification failed:", ocrError);
          // Continue without OCR if it fails
        }
      }

      // Return upload result
      res.json({
        success: true,
        ipfsHash,
        fileName,
        fileUrl: ipfsService.getFileUrl(ipfsHash),
        ocrVerification: ocrResult,
        message: "File uploaded and processed successfully",
      });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to upload file",
      });
    }
  },
);

// Register to blockchain after signature verification
router.post("/blockchain-register", authenticateHospital, async (req, res) => {
  try {
    const {
      record_type,
      record_id,
      full_name,
      blood_type,
      organ_needed,
      urgency_level,
      ipfs_hash,
    } = req.body;

    const hospital_id = req.hospital?.hospital_id;

    let blockchainTxHash;

    if (record_type === "patient") {
      blockchainTxHash = await blockchainService.registerPatient(
        record_id,
        full_name,
        blood_type,
        organ_needed || "",
        urgency_level || "Medium",
        ipfs_hash,
      );

      // Update patient record with blockchain hash
      await pool.query(
        `UPDATE patients
         SET blockchain_tx_hash = $1, signature_verified = true, updated_at = CURRENT_TIMESTAMP
         WHERE patient_id = $2 AND hospital_id = $3`,
        [blockchainTxHash, record_id, hospital_id]
      );
    } else if (record_type === "donor") {
      blockchainTxHash = await blockchainService.registerDonor(
        record_id,
        full_name,
        blood_type,
        ipfs_hash,
      );

      // Update donor record with blockchain hash
      await pool.query(
        `UPDATE donors
         SET blockchain_tx_hash = $1, signature_verified = true, updated_at = CURRENT_TIMESTAMP
         WHERE donor_id = $2 AND hospital_id = $3`,
        [blockchainTxHash, record_id, hospital_id]
      );
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid record type",
      });
    }

    res.json({
      success: true,
      blockchainTxHash,
      message: "Record registered on blockchain successfully",
    });
  } catch (error) {
    console.error("Blockchain registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to register on blockchain",
    });
  }
});

// Verify signature on blockchain
router.post("/verify-signature", authenticateHospital, async (req, res) => {
  try {
    const { record_type, record_id, verified } = req.body;

    let blockchainTxHash;

    if (record_type === "patient") {
      blockchainTxHash = await blockchainService.verifyPatientSignature(
        record_id,
        verified,
      );
    } else if (record_type === "donor") {
      blockchainTxHash = await blockchainService.verifyDonorSignature(
        record_id,
        verified,
      );
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid record type",
      });
    }

    res.json({
      success: true,
      blockchainTxHash,
      message: "Signature verification updated on blockchain",
    });
  } catch (error) {
    console.error("Signature verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to verify signature on blockchain",
    });
  }
});

// Get file from IPFS
router.get("/ipfs/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const fileBuffer = await ipfsService.getFile(hash);

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="signature_${hash}"`,
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error("IPFS file retrieval error:", error);
    res.status(404).json({
      success: false,
      error: "File not found",
    });
  }
});

export default router;
