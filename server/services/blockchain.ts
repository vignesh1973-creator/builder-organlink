import { ethers } from "ethers";

// Smart contract ABI - OrganLink Registry
const CONTRACT_ABI = [
  "function registerPatient(string _patientId, string _fullName, string _bloodType, string _organNeeded, string _urgencyLevel, string _signatureIpfsHash) external",
  "function registerDonor(string _donorId, string _fullName, string _bloodType, string _signatureIpfsHash) external",
  "function verifyPatientSignature(string _patientId, bool _verified) external",
  "function verifyDonorSignature(string _donorId, bool _verified) external",
  "function getPatient(string _patientId) external view returns (tuple(string patientId, string fullName, string bloodType, string organNeeded, string urgencyLevel, string signatureIpfsHash, address hospitalAddress, uint256 registrationTime, bool isActive, bool signatureVerified))",
  "function getDonor(string _donorId) external view returns (tuple(string donorId, string fullName, string bloodType, string signatureIpfsHash, address hospitalAddress, uint256 registrationTime, bool isActive, bool signatureVerified))",
  "function isAuthorized(address _hospital) external view returns (bool)",
  "function authorizeHospital(address _hospital) external",
  "function revokeHospital(address _hospital) external",
  "function getStats() external view returns (uint256, uint256)",
  "function owner() external view returns (address)",
  "event PatientRegistered(string indexed patientId, string fullName, string signatureIpfsHash, address indexed hospital, uint256 timestamp)",
  "event DonorRegistered(string indexed donorId, string fullName, string signatureIpfsHash, address indexed hospital, uint256 timestamp)",
  "event SignatureVerified(string indexed recordId, bool isPatient, bool verified)",
  "event HospitalAuthorized(address indexed hospital)",
  "event HospitalRevoked(address indexed hospital)",
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor() {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(
      process.env.INFURA_API_URL ||
        "https://sepolia.infura.io/v3/6587311a93fe4c34adcef72bd583ea46",
    );

    // Initialize wallet
    const privateKey = process.env.METAMASK_PRIVATE_KEY || "";
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    // Contract address - OrganLink Registry deployed on Sepolia
    this.contractAddress =
      process.env.CONTRACT_ADDRESS ||
      "0x2ed506da0a5f375833176d51b73f3d0ca5e66c8a";

    // Initialize contract
    this.contract = new ethers.Contract(
      this.contractAddress,
      CONTRACT_ABI,
      this.wallet,
    );
  }

  // Register patient on blockchain
  async registerPatient(
    patientId: string,
    fullName: string,
    bloodType: string,
    organNeeded: string,
    urgencyLevel: string,
    signatureIpfsHash: string,
  ): Promise<string> {
    try {
      console.log("Registering patient on blockchain:", {
        patientId,
        fullName,
        bloodType,
        organNeeded,
        urgencyLevel,
        signatureIpfsHash,
      });

      // For demo purposes, we'll skip authorization check
      // In production, proper authorization would be needed
      console.log("Proceeding with patient registration (demo mode)");

      const tx = await this.contract.registerPatient(
        patientId,
        fullName,
        bloodType,
        organNeeded,
        urgencyLevel,
        signatureIpfsHash,
      );

      console.log("Transaction sent:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt.hash);

      return receipt.hash;
    } catch (error) {
      console.error("Blockchain patient registration error:", error);
      throw new Error("Failed to register patient on blockchain");
    }
  }

  // Register donor on blockchain
  async registerDonor(
    donorId: string,
    fullName: string,
    bloodType: string,
    signatureIpfsHash: string,
  ): Promise<string> {
    try {
      console.log("Registering donor on blockchain:", {
        donorId,
        fullName,
        bloodType,
        signatureIpfsHash,
      });

      // For demo purposes, we'll skip authorization check
      // In production, proper authorization would be needed
      console.log("Proceeding with donor registration (demo mode)");

      const tx = await this.contract.registerDonor(
        donorId,
        fullName,
        bloodType,
        signatureIpfsHash,
      );

      console.log("Transaction sent:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt.hash);

      return receipt.hash;
    } catch (error) {
      console.error("Blockchain donor registration error:", error);
      throw new Error("Failed to register donor on blockchain");
    }
  }

  // Verify patient signature on blockchain
  async verifyPatientSignature(
    patientId: string,
    verified: boolean,
  ): Promise<string> {
    try {
      const tx = await this.contract.verifyPatientSignature(
        patientId,
        verified,
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("Blockchain patient signature verification error:", error);
      throw new Error("Failed to verify patient signature on blockchain");
    }
  }

  // Verify donor signature on blockchain
  async verifyDonorSignature(
    donorId: string,
    verified: boolean,
  ): Promise<string> {
    try {
      const tx = await this.contract.verifyDonorSignature(donorId, verified);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("Blockchain donor signature verification error:", error);
      throw new Error("Failed to verify donor signature on blockchain");
    }
  }

  // Get patient from blockchain
  async getPatient(patientId: string): Promise<any> {
    try {
      const patient = await this.contract.getPatient(patientId);
      return {
        patientId: patient.patientId,
        fullName: patient.fullName,
        bloodType: patient.bloodType,
        organNeeded: patient.organNeeded,
        urgencyLevel: patient.urgencyLevel,
        signatureIpfsHash: patient.signatureIpfsHash,
        hospitalAddress: patient.hospitalAddress,
        registrationTime: Number(patient.registrationTime),
        isActive: patient.isActive,
        signatureVerified: patient.signatureVerified,
      };
    } catch (error) {
      console.error("Blockchain get patient error:", error);
      throw new Error("Failed to get patient from blockchain");
    }
  }

  // Get donor from blockchain
  async getDonor(donorId: string): Promise<any> {
    try {
      const donor = await this.contract.getDonor(donorId);
      return {
        donorId: donor.donorId,
        fullName: donor.fullName,
        bloodType: donor.bloodType,
        signatureIpfsHash: donor.signatureIpfsHash,
        hospitalAddress: donor.hospitalAddress,
        registrationTime: Number(donor.registrationTime),
        isActive: donor.isActive,
        signatureVerified: donor.signatureVerified,
      };
    } catch (error) {
      console.error("Blockchain get donor error:", error);
      throw new Error("Failed to get donor from blockchain");
    }
  }

  // Check if hospital is authorized
  async isHospitalAuthorized(hospitalAddress: string): Promise<boolean> {
    try {
      return await this.contract.isAuthorized(hospitalAddress);
    } catch (error) {
      console.error("Blockchain authorization check error:", error);
      return false;
    }
  }

  // Get blockchain stats
  async getStats(): Promise<{ totalPatients: number; totalDonors: number }> {
    try {
      const stats = await this.contract.getStats();
      return {
        totalPatients: Number(stats[0]),
        totalDonors: Number(stats[1]),
      };
    } catch (error) {
      console.error("Blockchain stats error:", error);
      return { totalPatients: 0, totalDonors: 0 };
    }
  }

  // Get wallet address
  getWalletAddress(): string {
    return this.wallet.address;
  }

  // Get balance
  async getBalance(): Promise<string> {
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Balance check error:", error);
      return "0";
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.provider.getNetwork();
      return true;
    } catch (error) {
      console.error("Blockchain connection test failed:", error);
      return false;
    }
  }

  // Check if current wallet is authorized
  async checkAuthorization(): Promise<boolean> {
    try {
      return await this.contract.isAuthorized(this.wallet.address);
    } catch (error) {
      console.error("Authorization check error:", error);
      return false;
    }
  }

  // Authorize the admin wallet (must be called by contract owner)
  async authorizeAdminWallet(): Promise<string | null> {
    try {
      console.log("Attempting to authorize admin wallet:", this.wallet.address);

      // First check if already authorized
      const isAuthorized = await this.checkAuthorization();
      if (isAuthorized) {
        console.log("Admin wallet is already authorized");
        return null;
      }

      // Try to authorize (this will only work if we're the contract owner)
      const tx = await this.contract.authorizeHospital(this.wallet.address);
      const receipt = await tx.wait();

      console.log("Admin wallet authorized successfully:", receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error("Authorization error:", error);
      throw error;
    }
  }

  // Get contract owner
  async getOwner(): Promise<string> {
    try {
      return await this.contract.owner();
    } catch (error) {
      console.error("Get owner error:", error);
      return "";
    }
  }
}

export const blockchainService = new BlockchainService();
