import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Calendar,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  MapPin,
  Package,
} from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";

interface StoreRequest {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  requestedPlan: "Basic" | "Pro" | "Enterprise";
  expectedBranches: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

const requestsData: StoreRequest[] = [
  { id: "REQ001", storeName: "FreshMart", ownerName: "Vikram Singh", email: "vikram@freshmart.com", phone: "+91 98765 43210", location: "Mumbai, India", requestedPlan: "Pro", expectedBranches: 5, requestDate: "2024-01-18", status: "pending" },
  { id: "REQ002", storeName: "TechZone Plus", ownerName: "Neha Gupta", email: "neha@techzone.com", phone: "+91 87654 32109", location: "Delhi, India", requestedPlan: "Enterprise", expectedBranches: 12, requestDate: "2024-01-17", status: "pending" },
  { id: "REQ003", storeName: "StyleHub", ownerName: "Rajesh Kumar", email: "rajesh@stylehub.com", phone: "+91 76543 21098", location: "Bangalore, India", requestedPlan: "Basic", expectedBranches: 2, requestDate: "2024-01-16", status: "pending" },
  { id: "REQ004", storeName: "MediCare Stores", ownerName: "Dr. Priya Sharma", email: "priya@medicare.com", phone: "+91 65432 10987", location: "Chennai, India", requestedPlan: "Pro", expectedBranches: 8, requestDate: "2024-01-15", status: "approved" },
  { id: "REQ005", storeName: "QuickBite", ownerName: "Arun Menon", email: "arun@quickbite.com", phone: "+91 54321 09876", location: "Hyderabad, India", requestedPlan: "Basic", expectedBranches: 3, requestDate: "2024-01-14", status: "rejected", notes: "Incomplete documentation" },
];

export default function SuperAdminRequests() {
  const [selectedRequest, setSelectedRequest] = useState<StoreRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const pendingCount = requestsData.filter(r => r.status === "pending").length;
  const approvedCount = requestsData.filter(r => r.status === "approved").length;
  const rejectedCount = requestsData.filter(r => r.status === "rejected").length;

  const handleApprove = (request: StoreRequest) => {
    console.log("Approving request:", request.id);
    // Send welcome email
  };

  const handleReject = () => {
    console.log("Rejecting request:", selectedRequest?.id, "Reason:", rejectReason);
    setShowRejectDialog(false);
    setRejectReason("");
    setSelectedRequest(null);
  };

  const columns: ColumnDef<StoreRequest>[] = [
    {
      accessorKey: "storeName",
      header: "Store",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.storeName}</p>
            <p className="text-sm text-muted-foreground">{row.original.ownerName}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {row.original.email}
          </p>
          <p className="text-sm flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" />
            {row.original.phone}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "requestedPlan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.getValue("requestedPlan") as string;
        return (
          <Badge className={
            plan === "Enterprise" ? "bg-accent/10 text-accent border-accent/20" :
            plan === "Pro" ? "bg-primary/10 text-primary border-primary/20" :
            "bg-muted text-muted-foreground"
          }>
            {plan}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expectedBranches",
      header: "Branches",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("expectedBranches")}</span>
      ),
    },
    {
      accessorKey: "requestDate",
      header: "Requested",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {row.getValue("requestDate")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={
            status === "approved" ? "bg-success/10 text-success border-success/20" :
            status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/20" :
            "bg-warning/10 text-warning border-warning/20"
          }>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;
        if (request.status !== "pending") {
          return (
            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="gap-1 bg-success hover:bg-success/90"
              onClick={() => handleApprove(request)}
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                setSelectedRequest(request);
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <KPICard
          title="Pending Requests"
          value={pendingCount.toString()}
          icon={Clock}
          iconColor="warning"
        />
        <KPICard
          title="Approved This Month"
          value={approvedCount.toString()}
          icon={CheckCircle}
          iconColor="success"
        />
        <KPICard
          title="Rejected"
          value={rejectedCount.toString()}
          icon={XCircle}
          iconColor="destructive"
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store Registration Requests</CardTitle>
            <CardDescription>Review and approve new store registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={requestsData}
              searchPlaceholder="Search requests..."
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.storeName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.ownerName}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedRequest.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedRequest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedRequest.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedRequest.requestedPlan} Plan - {selectedRequest.expectedBranches} branches</span>
                </div>
              </div>
              {selectedRequest.notes && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                  <p className="text-sm text-destructive/80">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject the registration request from <strong>{selectedRequest?.storeName}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}