import { useState } from "react"
import { Save, User, Shield, Bell, Palette, Database, Key, Globe, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface UserSettings {
  profile: {
    name: string
    email: string
    bio: string
    avatar: string
  }
  security: {
    twoFactorEnabled: boolean
    apiKeyVisible: boolean
    sessionTimeout: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    securityAlerts: boolean
  }
  preferences: {
    theme: string
    language: string
    timezone: string
    currency: string
  }
  api: {
    apiKey: string
    webhookUrl: string
    rateLimit: string
  }
}

const initialSettings: UserSettings = {
  profile: {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Crypto enthusiast and AI developer",
    avatar: "/api/placeholder/100/100"
  },
  security: {
    twoFactorEnabled: true,
    apiKeyVisible: false,
    sessionTimeout: "24h"
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  },
  preferences: {
    theme: "dark",
    language: "en",
    timezone: "UTC",
    currency: "USD"
  },
  api: {
    apiKey: "sk-1234567890abcdef1234567890abcdef",
    webhookUrl: "https://api.example.com/webhook",
    rateLimit: "1000"
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    setHasChanges(false)
    // Here you would typically save to your backend
  }

  const generateNewApiKey = () => {
    const newKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    updateSettings("api", "apiKey", newKey)
  }

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account...")
      // Handle account deletion
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/CorewL.png" 
              alt="CoreWeave Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings("profile", "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings("profile", "email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={settings.profile.bio}
                  onChange={(e) => updateSettings("profile", "bio", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSettings("security", "twoFactorEnabled", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <Select
                  value={settings.security.sessionTimeout}
                  onValueChange={(value) => updateSettings("security", "sessionTimeout", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="8h">8 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Danger Zone</Label>
                    <p className="text-sm text-muted-foreground">
                      Irreversible and destructive actions
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={deleteAccount}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "pushNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(checked) => updateSettings("notifications", "marketingEmails", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important security events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.securityAlerts}
                  onCheckedChange={(checked) => updateSettings("notifications", "securityAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => updateSettings("preferences", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => updateSettings("preferences", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) => updateSettings("preferences", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.preferences.currency}
                    onValueChange={(value) => updateSettings("preferences", "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={settings.api.apiKey}
                      readOnly
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={generateNewApiKey} variant="outline">
                    Generate New
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your API key secure and don't share it publicly
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-app.com/webhook"
                  value={settings.api.webhookUrl}
                  onChange={(e) => updateSettings("api", "webhookUrl", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  URL to receive webhook notifications
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={settings.api.rateLimit}
                  onChange={(e) => updateSettings("api", "rateLimit", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of API requests per hour
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">API Status</span>
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your API access is currently active and functioning normally
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}