import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Mail,
  CreditCard,
  Database,
  Shield,
  Globe,
  Palette,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Server,
} from "lucide-react";
import { toast } from "sonner";

export default function SuperAdminSettings() {
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showRazorpayKey, setShowRazorpayKey] = useState(false);

  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@posplatform.com");
  const [smtpPassword, setSmtpPassword] = useState("");

  // Payment Settings
  const [stripeKey, setStripeKey] = useState("sk_live_*****************************");
  const [razorpayKey, setRazorpayKey] = useState("rzp_live_*****************************");

  // Feature Toggles
  const [whiteLabel, setWhiteLabel] = useState(true);
  const [customDomains, setCustomDomains] = useState(true);
  const [apiAccess, setApiAccess] = useState(true);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(true);

  // Backup Settings
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupRetention, setBackupRetention] = useState("30");

  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="smtp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="smtp" className="gap-2">
              <Mail className="h-4 w-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Shield className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Database className="h-4 w-4" />
              Backup
            </TabsTrigger>
          </TabsList>

          {/* SMTP Settings */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>SMTP Configuration</CardTitle>
                    <CardDescription>Configure email server settings for notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">Username</Label>
                    <Input
                      id="smtpUser"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={() => handleSaveSettings("SMTP")} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Gateways */}
          <TabsContent value="payments">
            <div className="space-y-6">
              {/* Stripe */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-[#635BFF]" />
                      </div>
                      <div>
                        <CardTitle>Stripe</CardTitle>
                        <CardDescription>International payments processing</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripeKey">Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stripeKey"
                        type={showStripeKey ? "text" : "password"}
                        value={stripeKey}
                        onChange={(e) => setStripeKey(e.target.value)}
                        className="font-mono"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowStripeKey(!showStripeKey)}
                      >
                        {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => handleSaveSettings("Stripe")} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Stripe Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Razorpay */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#072654]/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-[#072654]" />
                      </div>
                      <div>
                        <CardTitle>Razorpay</CardTitle>
                        <CardDescription>India payments processing</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpayKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="razorpayKey"
                        type={showRazorpayKey ? "text" : "password"}
                        value={razorpayKey}
                        onChange={(e) => setRazorpayKey(e.target.value)}
                        className="font-mono"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowRazorpayKey(!showRazorpayKey)}
                      >
                        {showRazorpayKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => handleSaveSettings("Razorpay")} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Razorpay Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feature Toggles */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable platform features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">White-Label Branding</p>
                        <p className="text-sm text-muted-foreground">Allow stores to use custom branding</p>
                      </div>
                    </div>
                    <Switch checked={whiteLabel} onCheckedChange={setWhiteLabel} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Custom Domains</p>
                        <p className="text-sm text-muted-foreground">Allow stores to connect custom domains</p>
                      </div>
                    </div>
                    <Switch checked={customDomains} onCheckedChange={setCustomDomains} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">API Access</p>
                        <p className="text-sm text-muted-foreground">Enable API access for Pro+ plans</p>
                      </div>
                    </div>
                    <Switch checked={apiAccess} onCheckedChange={setApiAccess} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Advanced Analytics</p>
                        <p className="text-sm text-muted-foreground">Enable advanced analytics features</p>
                      </div>
                    </div>
                    <Switch checked={advancedAnalytics} onCheckedChange={setAdvancedAnalytics} />
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Features")} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Feature Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Backup Schedule</CardTitle>
                    <CardDescription>Configure automatic database backups</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Retention Period (days)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={backupRetention}
                      onChange={(e) => setBackupRetention(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Last Backup</p>
                      <p className="text-sm text-muted-foreground">January 18, 2024 at 03:00 AM</p>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Successful
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={() => handleSaveSettings("Backup")} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Backup Settings
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Database className="h-4 w-4" />
                    Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}