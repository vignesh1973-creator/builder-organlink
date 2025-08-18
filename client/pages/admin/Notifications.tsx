import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import { Bell, Check, Trash2, Filter } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'security' | 'warning' | 'success' | 'info';
  time: string;
  read: boolean;
  fullMessage?: string;
}

export default function Notifications() {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Password Reset Request',
      message: 'Metro Medical Center has requested a password reset',
      fullMessage: 'Metro Medical Center (ID: MMC001) located in Delhi, India has submitted a password reset request. The request was initiated by Dr. Rajesh Kumar at 14:30 IST. Please verify the identity and process the request accordingly.',
      type: 'security',
      time: '5 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'System Performance Alert',
      message: 'Database query response time increased by 23%',
      fullMessage: 'System monitoring has detected that database query response times have increased by 23% over the last hour. Current average response time is 145ms, up from 118ms. Consider checking for slow queries or high load conditions.',
      type: 'warning',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully',
      fullMessage: 'The scheduled daily backup process has completed successfully at 02:00 UTC. Total backup size: 2.3 GB. All critical data including hospital records, organization data, and transaction logs have been secured.',
      type: 'success',
      time: '2 hours ago',
      read: true
    },
    {
      id: 4,
      title: 'New Hospital Registration',
      message: 'Apollo Hospital has been registered and is pending approval',
      fullMessage: 'Apollo Hospital from Chennai, Tamil Nadu, India has completed their registration process. Hospital ID: APOLLO001. All required documentation has been submitted and the application is now pending admin approval.',
      type: 'info',
      time: '3 hours ago',
      read: false
    },
    {
      id: 5,
      title: 'Security Scan Completed',
      message: 'Weekly security scan found no vulnerabilities',
      fullMessage: 'The automated weekly security scan has been completed successfully. Scanned 2,847 endpoints and found no critical vulnerabilities. All systems are up to date with the latest security patches.',
      type: 'success',
      time: '1 day ago',
      read: true
    },
    {
      id: 6,
      title: 'Policy Vote Completed',
      message: 'Emergency Organ Allocation Protocol has been approved',
      fullMessage: 'The voting period for the Emergency Organ Allocation Protocol has ended. Final tally: 18 votes in favor, 3 votes against. The policy is now active and will be implemented across all participating hospitals.',
      type: 'info',
      time: '2 days ago',
      read: true
    }
  ]);

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

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    if (filter === 'security') return notification.type === 'security';
    if (filter === 'warning') return notification.type === 'warning';
    if (filter === 'success') return notification.type === 'success';
    if (filter === 'info') return notification.type === 'info';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return '🔒';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  return (
    <AdminLayout 
      title="Notifications"
      subtitle="Manage all system notifications and alerts"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-medical-600" />
            <span className="text-lg font-medium">
              All Notifications ({notifications.length})
            </span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You're all caught up!" 
                    : `No ${filter} notifications to display.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-medical-200 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        notification.read ? 'text-gray-600' : 'text-gray-800'
                      }`}>
                        {notification.fullMessage || notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
