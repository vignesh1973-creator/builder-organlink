import express from "express";
import { blockchainService } from "../services/blockchain.js";

const router = express.Router();

// Get blockchain status and authorization info
router.get("/status", async (req, res) => {
  try {
    const walletAddress = blockchainService.getWalletAddress();
    const balance = await blockchainService.getBalance();
    const isConnected = await blockchainService.testConnection();
    const isAuthorized = await blockchainService.checkAuthorization();
    const contractOwner = await blockchainService.getOwner();

    res.json({
      success: true,
      status: {
        walletAddress,
        balance,
        isConnected,
        isAuthorized,
        contractOwner,
        isOwner: walletAddress.toLowerCase() === contractOwner.toLowerCase()
      }
    });
  } catch (error) {
    console.error("Blockchain status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get blockchain status"
    });
  }
});

// Authorize admin wallet
router.post("/authorize", async (req, res) => {
  try {
    const txHash = await blockchainService.authorizeAdminWallet();
    
    res.json({
      success: true,
      message: txHash ? "Admin wallet authorized successfully" : "Admin wallet was already authorized",
      txHash
    });
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to authorize admin wallet"
    });
  }
});

// Get blockchain stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await blockchainService.getStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get blockchain stats"
    });
  }
});

export default router;
