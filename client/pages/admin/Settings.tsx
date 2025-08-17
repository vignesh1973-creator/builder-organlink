import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { Settings as SettingsIcon, Bell, User, Mail, Key } from "lucide-react";

export default function AdminSettings() {
  const [emailSettings, setEmailSettings] = useState({
    adminEmail: 'admin@organlink.org',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Password Reset Request',
      message: 'Metro Medical Center has requested a password reset',
      type: 'security',
      time: '5 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'System Performance Alert',
      message: 'Database query response time increased by 23%',
      type: 'warning',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully',
      type: 'success',
      time: '2 hours ago',
      read: true
    }
  ]);

  const handlePasswordChange = async () => {
    if (emailSettings.newPassword !== emailSettings.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Implement password change logic
    console.log('Changing password...');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <AdminLayout 
      title="System Settings"
      subtitle="Configure system settings and administrative profiles"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-medical-600" />
              <span>Admin Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="adminEmail">Admin Email Address</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  id="adminEmail"
                  value={emailSettings.adminEmail}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={emailSettings.currentPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={emailSettings.newPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={emailSettings.confirmPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-medical-600" />
              <span>Notifications</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-medical-200'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <Badge 
                      className={
                        notification.type === 'security' 
                          ? 'bg-red-100 text-red-800'
                          : notification.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
