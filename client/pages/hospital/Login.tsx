import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Heart, MapPin } from "lucide-react";
import { useHospitalAuth } from "@/contexts/HospitalAuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Locations {
  [country: string]: {
    [state: string]: {
      [city: string]: Array<{
        id: string;
        name: string;
      }>;
    };
  };
}

export default function HospitalLogin() {
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { login, hospital, requestPasswordReset } = useHospitalAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (hospital) {
      navigate("/hospital/dashboard");
    }
  }, [hospital, navigate]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/hospital/auth/locations");
      const data = await response.json();

      // Flatten the location structure to get all hospitals
      const allHospitals: any[] = [];
      Object.keys(data).forEach(country => {
        Object.keys(data[country]).forEach(city => {
          data[country][city].forEach((hospital: any) => {
            allHospitals.push({
              ...hospital,
              location: `${city}, ${country}`
            });
          });
        });
      });

      setHospitals(allHospitals);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
      showToast("Failed to load hospitals", "error");
    } finally {
      setLoadingHospitals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId || !password) {
      showToast("Please enter hospital ID and password", "error");
      return;
    }

    setIsLoading(true);

    const result = await login(hospitalId, password);

    if (result.success) {
      showToast("Login successful! Welcome to OrganLink", "success");
      navigate("/hospital/dashboard");
    } else {
      showToast(result.error || "Login failed", "error");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!hospitalId || !resetEmail) {
      showToast("Please enter hospital ID and email", "error");
      return;
    }

    const result = await requestPasswordReset(hospitalId, resetEmail);

    if (result.success) {
      showToast("Password reset request sent to admin for approval", "success");
      setShowForgotPassword(false);
      setResetEmail("");
    } else {
      showToast(result.error || "Failed to send reset request", "error");
    }
  };

  const countries = Object.keys(locations);
  const states = selectedCountry ? Object.keys(locations[selectedCountry] || {}) : [];
  const cities = selectedCountry && selectedState ? Object.keys(locations[selectedCountry][selectedState] || {}) : [];
  const hospitals = selectedCountry && selectedState && selectedCity ? 
    locations[selectedCountry][selectedState][selectedCity] || [] : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-md lg:w-96">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-medical-600 p-3 rounded-2xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hospital Portal
              </h2>
              <p className="text-sm text-gray-600">
                Access your hospital management system
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                {!showForgotPassword ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Select Location & Hospital
                      </Label>
                      
                      {loadingLocations ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical-600 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Loading locations...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          <Select value={selectedCountry} onValueChange={(value) => {
                            setSelectedCountry(value);
                            setSelectedState("");
                            setSelectedCity("");
                            setSelectedHospital("");
                          }}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={selectedState} 
                            onValueChange={(value) => {
                              setSelectedState(value);
                              setSelectedCity("");
                              setSelectedHospital("");
                            }}
                            disabled={!selectedCountry}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={selectedCity} 
                            onValueChange={(value) => {
                              setSelectedCity(value);
                              setSelectedHospital("");
                            }}
                            disabled={!selectedState}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={selectedHospital} 
                            onValueChange={setSelectedHospital}
                            disabled={!selectedCity}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select Hospital" />
                            </SelectTrigger>
                            <SelectContent>
                              {hospitals.map((hospital) => (
                                <SelectItem key={hospital.id} value={hospital.id}>
                                  {hospital.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="h-12 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-medical-600 hover:text-medical-700"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-medical-600 hover:bg-medical-700 text-white"
                      disabled={isLoading || !selectedHospital || !password || loadingLocations}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Request Password Reset</h3>
                      <p className="text-sm text-gray-600">
                        Your request will be sent to admin for approval
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        required
                        className="mt-1 h-12"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 h-12 bg-medical-600 hover:bg-medical-700"
                        onClick={handleForgotPassword}
                        disabled={!selectedHospital || !resetEmail}
                      >
                        Send Request
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Protected by advanced security protocols
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Image and Content */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-medical-600 via-medical-700 to-medical-800 relative">
          <div className="flex flex-col justify-center px-12 py-12 text-white relative z-10">
            <div className="mb-8">
              <img
                src="https://images.pexels.com/photos/33474165/pexels-photo-33474165.jpeg"
                alt="Hospital Professional"
                className="w-80 h-80 object-cover rounded-2xl mx-auto mb-8"
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                Hospital Management Portal
              </h1>
              <p className="text-lg text-medical-100 leading-relaxed max-w-md mx-auto">
                Securely manage patient registrations, donor coordination, and organ matching 
                with advanced blockchain verification and AI-powered matching algorithms.
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-medical-400/20 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 lg:bg-transparent py-4 text-center border-t lg:border-t-0">
        <p className="text-xs text-gray-500">
          © 2025 OrganLink. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-2 text-xs">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Terms of Service
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
