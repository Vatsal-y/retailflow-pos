import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, ShoppingCart, CreditCard, Smartphone, Banknote, Wallet, AlertTriangle, Play, Square, X, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ShiftReport } from "@/store/slices/shiftReportSlice";
import { format, parseISO, differenceInHours, differenceInMinutes } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { startShift, endShift, fetchShiftReports } from "@/store/slices/shiftReportSlice";

const COLORS = ["hsl(var(--emerald-500))", "hsl(var(--primary))", "hsl(var(--amber-500))", "hsl(var(--pink-500))"];

export default function ShiftsPage() {
  const [showEndShift, setShowEndShift] = useState(false);
  const [showStartShift, setShowStartShift] = useState(false);
  const [actualCash, setActualCash] = useState("");
  const [supervisorPin, setSupervisorPin] = useState("");
  const [openingCash, setOpeningCash] = useState("5000");

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { shiftReports, currentShift, isLoading, error } = useSelector((state: RootState) => state.shiftReport);

  useEffect(() => {
    if (user && user.branchId) {
      dispatch(fetchShiftReports(user.branchId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const pastShifts = useMemo(() => {
    return shiftReports.filter(s => s.status === 'CLOSED');
  }, [shiftReports]);

  const getShiftDuration = (start: string, end?: string) => {
    const startDate = parseISO(start);
    const endDate = end ? parseISO(end) : new Date();
    const hours = differenceInHours(endDate, startDate);
    const mins = differenceInMinutes(endDate, startDate) % 60;
    return `${hours}h ${mins}m`;
  };

  const expectedCash = currentShift
    ? (currentShift.openingCash || 0) + (currentShift.cashSales || 0)
    : 0;

  const discrepancy = actualCash
    ? parseFloat(actualCash) - expectedCash
    : 0;

  const handleStartShift = async () => {
    if (!openingCash) {
      toast.error("Please enter opening cash amount");
      return;
    }
    if (!user || !user.branchId || !user.id) {
      toast.error("User information not available");
      return;
    }

    try {
      await dispatch(startShift({
        branchId: user.branchId,
        cashierId: parseInt(user.id),
        openingCash: parseFloat(openingCash),
      })).unwrap();

      toast.success("Shift started successfully!");
      setShowStartShift(false);
      setOpeningCash("5000");
    } catch (error: any) {
      toast.error(error || "Failed to start shift");
    }
  };

  const handleEndShift = async () => {
    if (!supervisorPin) {
      toast.error("Supervisor PIN is required");
      return;
    }
    if (!user || !user.id) {
      toast.error("User information not available");
      return;
    }

    try {
      await dispatch(endShift({
        cashierId: parseInt(user.id),
        closingCash: actualCash ? parseFloat(actualCash) : 0,
      })).unwrap();

      toast.success("Shift ended successfully!");
      setShowEndShift(false);
      setSupervisorPin("");
      setActualCash("");
    } catch (error: any) {
      toast.error(error || "Failed to end shift");
    }
  };

  const paymentChartData = currentShift ? [
    { name: "Cash", value: currentShift.cashSales || 0 },
    { name: "Card", value: currentShift.cardSales || 0 },
    { name: "UPI", value: currentShift.upiSales || 0 },
    { name: "Wallet", value: currentShift.walletSales || 0 },
  ] : [
    { name: "Cash", value: 0 },
    { name: "Card", value: 0 },
    { name: "UPI", value: 0 },
    { name: "Wallet", value: 0 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role="cashier" />

      <main className="flex-1 md:ml-60 transition-all duration-300">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Shift Management</h1>
              <p className="text-muted-foreground">
                Track your shift performance and cash reconciliation
              </p>
            </div>
            {!currentShift ? (
              <Button onClick={() => setShowStartShift(true)} className="gap-2" variant="posSuccess">
                <Play className="h-4 w-4" />
                Start Shift
              </Button>
            ) : (
              <Button onClick={() => setShowEndShift(true)} className="gap-2" variant="destructive">
                <Square className="h-4 w-4" />
                End Shift
              </Button>
            )}
          </div>

          {/* Current Shift Card */}
          {currentShift && (
            <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Current Shift</h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="animate-pulse">Active</Badge>
                        <span className="text-sm text-muted-foreground">
                          {currentShift.cashierName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="text-lg font-bold">
                        {format(parseISO(currentShift.startTime), "HH:mm")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(currentShift.startTime), "dd MMM")}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-lg font-bold">
                        {getShiftDuration(currentShift.startTime)}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Opening Cash</p>
                      <p className="text-lg font-bold">₹{currentShift.openingCash.toLocaleString()}</p>
                    </div>
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Expected Cash</p>
                      <p className="text-lg font-bold text-primary">₹{expectedCash.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xl font-bold">{currentShift.totalOrders}</p>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-xl font-bold">₹{currentShift.totalSales.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                      <Banknote className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-xl font-bold">₹{(currentShift.cashSales || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Cash</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xl font-bold">₹{(currentShift.cardSales || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Card</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown Chart */}
                <div className="w-full lg:w-64">
                  <h3 className="font-semibold mb-2 text-center">Payment Breakdown</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={paymentChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {paymentChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          )}

          {/* No Active Shift */}
          {!currentShift && (
            <Card className="p-12 text-center border-dashed border-2">
              <Clock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Shift</h3>
              <p className="text-muted-foreground mb-6">
                Start a shift to begin tracking your sales and cash
              </p>
              <Button onClick={() => setShowStartShift(true)} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start New Shift
              </Button>
            </Card>
          )}

          {/* Past Shifts */}
          <div>
            <h2 className="text-xl font-bold mb-4">Shift History</h2>
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Cash</TableHead>
                      <TableHead className="text-right">Card</TableHead>
                      <TableHead className="text-center">Discrepancy</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : pastShifts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <p className="text-muted-foreground">No past shifts</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pastShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell className="font-medium">
                            {format(parseISO(shift.startTime), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell>
                            {getShiftDuration(shift.startTime, shift.endTime)}
                          </TableCell>
                          <TableCell className="text-center">{shift.totalOrders}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{shift.totalSales.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(shift.cashSales || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(shift.cardSales || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {(() => {
                              const expected = (shift.openingCash || 0) + (shift.cashSales || 0);
                              const actual = shift.closingCash || 0;
                              const diff = actual - expected;

                              if (diff !== 0) {
                                return (
                                  <Badge
                                    variant={diff > 0 ? "success" : "destructive"}
                                    className="gap-1"
                                  >
                                    {diff > 0 ? "+" : ""}₹{diff}
                                  </Badge>
                                );
                              }
                              return <Badge variant="secondary">₹0</Badge>;
                            })()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Start Shift Modal */}
      {showStartShift && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Start New Shift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowStartShift(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="openingCash">Opening Cash in Drawer</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="openingCash"
                    type="number"
                    placeholder="5000"
                    value={openingCash}
                    onChange={(e) => setOpeningCash(e.target.value)}
                    className="pl-8 text-lg"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Count the cash in drawer before starting
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowStartShift(false)}>
                Cancel
              </Button>
              <Button className="flex-1 gap-2" variant="posSuccess" onClick={handleStartShift}>
                <Play className="h-4 w-4" />
                Start Shift
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* End Shift Modal */}
      {showEndShift && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">End Shift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEndShift(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Expected vs Actual */}
              <Card className="p-4 bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Expected Cash</span>
                  <span className="font-bold text-lg">₹{expectedCash.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Opening (₹{currentShift?.openingCash.toLocaleString()}) + Cash Sales (₹{(currentShift?.cashSales || 0).toLocaleString()})
                </p>
              </Card>

              <div>
                <Label htmlFor="actualCash">Actual Cash Count</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="actualCash"
                    type="number"
                    placeholder="Enter cash count"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    className="pl-8 text-lg"
                  />
                </div>
              </div>

              {actualCash && (
                <Card className={`p-4 ${discrepancy === 0 ? "bg-emerald-500/10 border-emerald-500/20" : discrepancy > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-destructive/10 border-destructive/20"}`}>
                  <div className="flex items-center gap-3">
                    {discrepancy !== 0 && <AlertTriangle className={`h-5 w-5 ${discrepancy > 0 ? "text-amber-500" : "text-destructive"}`} />}
                    <div>
                      <p className="font-semibold">
                        {discrepancy === 0 ? "Perfect Match! ✓" : discrepancy > 0 ? "Cash Over" : "Cash Short"}
                      </p>
                      <p className="text-sm">
                        Discrepancy: <span className={discrepancy === 0 ? "text-emerald-600" : discrepancy > 0 ? "text-amber-600" : "text-destructive"}>
                          {discrepancy >= 0 ? "+" : ""}₹{discrepancy.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div>
                <Label htmlFor="pin" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Supervisor PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter supervisor PIN"
                  maxLength={4}
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for shift reconciliation (Demo: 1234)
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowEndShift(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                variant="destructive"
                onClick={handleEndShift}
                disabled={!actualCash || supervisorPin.length !== 4}
              >
                <Square className="h-4 w-4" />
                End Shift
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
