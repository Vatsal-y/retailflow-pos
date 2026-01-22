import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  Store,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  FileText,
  Eye,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Pending Approvals", href: "/super/approvals", icon: ClipboardCheck, badge: "3" },
  { label: "Subscriptions", href: "/super/subscriptions", icon: CreditCard },
  { label: "Store Oversight", href: "/super/stores", icon: Store },
  { label: "Platform Settings", href: "/super/settings", icon: Settings },
];

interface PendingStore {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  plan: string;
  location: string;
  requestedDate: string;
  estimatedRevenue: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  documents: string[];
  notes: string;
}

const pendingStores: PendingStore[] = [
  {
    id: "REQ001",
    storeName: "TechShop Mumbai",
    ownerName: "Raj Patel",
    email: "raj@techshop.in",
    phone: "+91 98765 43210",
    plan: "Pro",
    location: "Mumbai, Maharashtra",
    requestedDate: "2 days ago",
    estimatedRevenue: "$2,300/mo",
    status: "pending",
    documents: ["GST Certificate", "PAN Card", "Business License"],
    notes: "Large electronics retailer with 3 planned locations.",
  },
  {
    id: "REQ002",
    storeName: "FreshMart",
    ownerName: "Priya Sharma",
    email: "priya@freshmart.in",
    phone: "+91 87654 32109",
    plan: "Enterprise",
    location: "Delhi NCR",
    requestedDate: "3 days ago",
    estimatedRevenue: "$5,800/mo",
    status: "reviewing",
    documents: ["GST Certificate", "PAN Card", "Business License", "Bank Statement"],
    notes: "Grocery chain expanding from local to regional.",
  },
  {
    id: "REQ003",
    storeName: "StyleHub",
    ownerName: "Amit Kumar",
    email: "amit@stylehub.in",
    phone: "+91 76543 21098",
    plan: "Basic",
    location: "Bangalore, Karnataka",
    requestedDate: "5 days ago",
    estimatedRevenue: "$850/mo",
    status: "pending",
    documents: ["GST Certificate", "PAN Card"],
    notes: "Fashion boutique startup.",
  },
];

const rejectionReasons = [
  "Incomplete documentation",
  "Failed verification",
  "Duplicate account",
  "Suspicious activity",
  "Invalid business credentials",
  "Other",
];

export default function PendingApprovals() {
  const [selectedStore, setSelectedStore] = useState<PendingStore | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");

  const handleViewDetails = (store: PendingStore) => {
    setSelectedStore(store);
    setViewDialogOpen(true);
  };

  const handleApprove = (store: PendingStore) => {
    console.log("Approving:", store.id);
    // API call would go here
  };

  const handleReject = (store: PendingStore) => {
    setSelectedStore(store);
    setRejectDialogOpen(true);
  };

  const handleBulkApprove = () => {
    console.log("Bulk approving:", selectedItems);
  };

  const handleBulkReject = () => {
    console.log("Bulk rejecting:", selectedItems);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === pendingStores.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingStores.map((s) => s.id));
    }
  };

  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Pending Approvals"
      subtitle="Review and approve new store registrations"
      userRole="super_admin"
      userName="Admin User"
      storeName="POS Pro Platform"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Pending", count: 2, icon: Clock, color: "warning" },
            { label: "Under Review", count: 1, icon: Eye, color: "info" },
            { label: "Approved Today", count: 5, icon: CheckCircle, color: "success" },
            { label: "Rejected Today", count: 1, icon: XCircle, color: "destructive" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <span className="font-medium">{selectedItems.length} items selected</span>
            <div className="flex gap-2">
              <Button size="sm" className="gap-2" onClick={handleBulkApprove}>
                <ThumbsUp className="h-4 w-4" />
                Approve Selected
              </Button>
              <Button size="sm" variant="destructive" className="gap-2" onClick={handleBulkReject}>
                <ThumbsDown className="h-4 w-4" />
                Reject Selected
              </Button>
            </div>
          </motion.div>
        )}

        {/* Approval Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Approval Queue</CardTitle>
                  <CardDescription>New store registration requests</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === pendingStores.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label className="text-sm">Select All</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingStores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 ${
                      selectedItems.includes(store.id) ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedItems.includes(store.id)}
                        onCheckedChange={() => toggleSelectItem(store.id)}
                        className="mt-1"
                      />
                      
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{store.storeName}</h3>
                          <Badge
                            variant={
                              store.status === "pending"
                                ? "secondary"
                                : store.status === "reviewing"
                                ? "outline"
                                : "default"
                            }
                            className={
                              store.status === "pending"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : store.status === "reviewing"
                                ? "bg-info/10 text-info border-info/20"
                                : ""
                            }
                          >
                            {store.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {store.status === "reviewing" && <Eye className="h-3 w-3 mr-1" />}
                            {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{store.plan}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{store.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{store.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{store.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{store.requestedDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {store.documents.map((doc) => (
                            <Badge key={doc} variant="secondary" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0 space-y-2">
                        <p className="font-semibold text-success">{store.estimatedRevenue}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(store)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleApprove(store)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(store)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Store Application Details</DialogTitle>
              <DialogDescription>
                Review all information before making a decision
              </DialogDescription>
            </DialogHeader>
            
            {selectedStore && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Store Name</Label>
                    <p className="font-medium">{selectedStore.storeName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Owner Name</Label>
                    <p className="font-medium">{selectedStore.ownerName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedStore.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedStore.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium">{selectedStore.location}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Selected Plan</Label>
                    <Badge>{selectedStore.plan}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Documents Submitted</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.documents.map((doc) => (
                      <Button key={doc} variant="outline" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        {doc}
                        <Eye className="h-4 w-4 ml-2" />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedStore.notes}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setViewDialogOpen(false);
                  if (selectedStore) handleReject(selectedStore);
                }}
              >
                Reject
              </Button>
              <Button
                className="bg-success hover:bg-success/90"
                onClick={() => {
                  setViewDialogOpen(false);
                  if (selectedStore) handleApprove(selectedStore);
                }}
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Reject Application
              </DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this application.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={rejectReason} onValueChange={setRejectReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Additional Notes (optional)</Label>
                <Textarea
                  placeholder="Provide additional context..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setRejectDialogOpen(false)}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
