import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Eye,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { useHospitalAuth } from "@/contexts/HospitalAuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Donor {
  id: number;
  donor_id: string;
  hospital_id: string;
  full_name: string;
  age: number;
  gender: string;
  blood_type: string;
  organs_to_donate: string[];
  medical_history: string;
  contact_phone: string;
  contact_email: string;
  emergency_contact: string;
  emergency_phone: string;
  signature_file_path?: string;
  signature_ipfs_hash?: string;
  blockchain_tx_hash?: string;
  signature_verified: boolean;
  registration_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ViewDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrgan, setFilterOrgan] = useState("all");
  const [filterBloodType, setFilterBloodType] = useState("all");

  const { hospital } = useHospitalAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, searchTerm, filterOrgan, filterBloodType]);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("hospital_token");
      const response = await fetch("/api/hospital/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors);
      } else {
        showToast("Failed to load donors", "error");
      }
    } catch (error) {
      console.error("Failed to fetch donors:", error);
      showToast("Failed to load donors", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (donor) =>
          donor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.contact_email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Organ filter
    if (filterOrgan) {
      filtered = filtered.filter((donor) =>
        donor.organs_to_donate.includes(filterOrgan),
      );
    }

    // Blood type filter
    if (filterBloodType) {
      filtered = filtered.filter(
        (donor) => donor.blood_type === filterBloodType,
      );
    }

    setFilteredDonors(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const organTypes = [
    "Kidney",
    "Liver",
    "Heart",
    "Lung",
    "Pancreas",
    "Cornea",
    "Bone Marrow",
    "Skin",
    "Bone",
  ];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
              <p className="text-gray-600 mt-1">
                {hospital?.hospital_name} • Manage your donor registrations
              </p>
            </div>
            <Link to="/hospital/donors/register">
              <Button className="bg-medical-600 hover:bg-medical-700">
                <Plus className="h-4 w-4 mr-2" />
                Register New Donor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold">{donors.length}</p>
                </div>
                <Heart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Donors</p>
                  <p className="text-2xl font-bold">
                    {donors.filter((d) => d.is_active).length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold">
                    {donors.filter((d) => d.signature_verified).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Organs</p>
                  <p className="text-2xl font-bold">
                    {donors.reduce(
                      (total, donor) => total + donor.organs_to_donate.length,
                      0,
                    )}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterOrgan} onValueChange={setFilterOrgan}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by organ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organs</SelectItem>
                  {organTypes.map((organ) => (
                    <SelectItem key={organ} value={organ}>
                      {organ}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterBloodType}
                onValueChange={setFilterBloodType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Types</SelectItem>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterOrgan("");
                  setFilterBloodType("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donors List */}
        <div className="space-y-4">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <Card
                key={donor.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {donor.full_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {donor.donor_id} • Age: {donor.age} •{" "}
                            {donor.gender}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{donor.blood_type}</Badge>
                          {donor.signature_verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {donor.is_active && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Organs to Donate:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {donor.organs_to_donate.map((organ) => (
                            <Badge
                              key={organ}
                              className="bg-red-100 text-red-800"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {organ}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {donor.contact_phone}
                        </div>
                        {donor.contact_email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {donor.contact_email}
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Registered: {formatDate(donor.registration_date)}
                        </div>
                      </div>

                      {donor.medical_history && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <strong>Medical History:</strong>{" "}
                            {donor.medical_history}
                          </p>
                        </div>
                      )}

                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Emergency Contact:</strong>{" "}
                          {donor.emergency_contact} - {donor.emergency_phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>

                      {donor.signature_ipfs_hash && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/api/hospital/upload/ipfs/${donor.signature_ipfs_hash}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                      )}

                      {donor.blockchain_tx_hash && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://sepolia.etherscan.io/tx/${donor.blockchain_tx_hash}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Blockchain
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Donors Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {donors.length === 0
                    ? "No donors have been registered yet."
                    : "No donors match your current filter criteria."}
                </p>
                <Link to="/hospital/donors/register">
                  <Button className="bg-medical-600 hover:bg-medical-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register First Donor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
