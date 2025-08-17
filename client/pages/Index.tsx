import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/shared/Layout";
import { 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Activity,
  Award,
  Globe,
  Lock,
  Database,
  Brain
} from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-medical-100 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting Lives Through
              <span className="text-medical-600 block">Organ Donation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Advanced blockchain technology, AI-powered matching, and secure IPFS storage 
              revolutionizing organ transplantation worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/hospital/login">
                  Hospital Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/organization/login">
                  Organization Portal
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-medical-600 mb-2">100,000+</div>
                <div className="text-gray-600">Lives Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-medical-600 mb-2">500+</div>
                <div className="text-gray-600">Partner Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-medical-600 mb-2">50+</div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Revolutionary Technology for Life-Saving Matches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge blockchain, AI, and biometric verification 
              to ensure secure, transparent, and efficient organ matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Matching</h3>
                <p className="text-gray-600">
                  Advanced algorithms analyze compatibility factors to find optimal donor-patient matches 
                  across our global network.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Blockchain Security</h3>
                <p className="text-gray-600">
                  Immutable records on Ethereum Sepolia ensure complete transparency and 
                  tamper-proof documentation of all transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">OCR Verification</h3>
                <p className="text-gray-600">
                  Signature verification using Tesseract.js OCR technology ensures authentic 
                  consent and prevents fraud.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">IPFS Storage</h3>
                <p className="text-gray-600">
                  Decentralized storage via Pinata API ensures documents are permanent, 
                  accessible, and distributed globally.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Notifications</h3>
                <p className="text-gray-600">
                  Socket.IO powered instant alerts notify hospitals when matches are found, 
                  reducing critical response times.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="bg-medical-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Network</h3>
                <p className="text-gray-600">
                  Connect hospitals and organizations worldwide for cross-border organ 
                  matching and collaborative healthcare.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How OrganLink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined process designed for maximum security, efficiency, and life-saving impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-medical-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600">
                Hospitals register donors and patients with secure signature verification
              </p>
            </div>

            <div className="text-center">
              <div className="bg-medical-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verify</h3>
              <p className="text-gray-600">
                OCR technology validates signatures and uploads documents to IPFS
              </p>
            </div>

            <div className="text-center">
              <div className="bg-medical-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Match</h3>
              <p className="text-gray-600">
                AI algorithms find optimal matches based on compatibility factors
              </p>
            </div>

            <div className="text-center">
              <div className="bg-medical-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Real-time notifications connect hospitals for life-saving procedures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Access Your Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, role-based access for hospitals, organizations, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-medical-200">
              <CardContent className="p-8 text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Activity className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hospital Portal</h3>
                <p className="text-gray-600 mb-6">
                  Register donors and patients, manage AI matching, and receive real-time notifications.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/hospital/login">Access Hospital Portal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-medical-200">
              <CardContent className="p-8 text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Organization Portal</h3>
                <p className="text-gray-600 mb-6">
                  Propose policies, participate in voting, and manage organizational guidelines.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/organization/login">Access Organization Portal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-medical-200">
              <CardContent className="p-8 text-center">
                <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage hospitals, organizations, monitor blockchain logs, and system metrics.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/admin/login">Access Admin Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-medical-600 to-medical-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the global network of hospitals and organizations using OrganLink 
            to connect donors with patients in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 bg-white text-medical-600 hover:bg-gray-100"
              asChild
            >
              <Link to="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-medical-600"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
