import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { Plus, Building2 } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  country: string;
  city: string;
  hospital_id: string;
  email: string;
  phone: string;
  capacity: number;
  specializations: string[];
  status: string;
  last_activity: string;
  created_at: string;
}

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const columns = [
    {
      key: "hospital_info",
      label: "Hospital Info",
      render: (_, row: Hospital) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.hospital_id}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (_, row: Hospital) => (
        <div>
          <div className="text-sm text-gray-900">{row.city}</div>
          <div className="text-sm text-gray-500">{row.country}</div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (_, row: Hospital) => (
        <div>
          <div className="text-sm text-gray-900">{row.email}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          className={
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (value: number) => (
        <span className="text-sm text-gray-900">{value || "N/A"}</span>
      ),
    },
    {
      key: "specializations",
      label: "Specializations",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            value.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500">None</span>
          )}
          {value && value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "last_activity",
      label: "Last Activity",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString() : "Never"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "country",
      label: "Country",
      options: [
        { value: "usa", label: "United States" },
        { value: "canada", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
        { value: "india", label: "India" },
        { value: "australia", label: "Australia" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (hospital: Hospital) => {
        console.log("Edit hospital:", hospital);
      },
      variant: "outline" as const,
    },
    {
      label: "Reset Password",
      onClick: (hospital: Hospital) => {
        console.log("Reset password for hospital:", hospital);
      },
      variant: "secondary" as const,
    },
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async (
    filters?: Record<string, string>,
    search?: string,
    page = 1,
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...filters,
      });

      const response = await fetch(`/api/admin/hospitals?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHospitals(data.hospitals);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    fetchHospitals(filters, undefined, 1);
  };

  const handleSearchChange = (search: string) => {
    fetchHospitals(undefined, search, 1);
  };

  const handlePageChange = (page: number) => {
    fetchHospitals(undefined, undefined, page);
  };

  return (
    <AdminLayout
      title="Manage Hospitals"
      subtitle="View and manage all registered hospitals"
    >
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-medical-600" />
            <span className="text-lg font-medium">
              Hospitals ({pagination.total})
            </span>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        </div>

        {/* Hospitals Table */}
        <DataTable
          data={hospitals}
          columns={columns}
          filters={filters}
          searchPlaceholder="Search hospitals..."
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          actions={actions}
          pagination={{
            ...pagination,
            onPageChange: handlePageChange,
          }}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
}
