import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { User, Bell, Shield, Palette } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-[hsl(var(--muted-foreground))]">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Settings */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User size={20} />
                            Profile Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <Input defaultValue={user?.fullName} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input defaultValue={user?.email} disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <Input defaultValue={user?.phone || ''} placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <Input defaultValue={user?.role} disabled />
                            </div>
                        </div>
                        <Button className="mt-4">Save Changes</Button>
                    </CardContent>
                </Card>

                {/* Quick Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell size={20} />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Order notifications</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Low stock alerts</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Shift reminders</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette size={20} />
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                                Theme preference is controlled from the navbar toggle.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">Light</Button>
                                <Button variant="outline" size="sm" className="flex-1">Dark</Button>
                                <Button variant="outline" size="sm" className="flex-1">System</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield size={20} />
                        Security
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Change Password</h4>
                            <div className="space-y-3">
                                <Input type="password" placeholder="Current password" />
                                <Input type="password" placeholder="New password" />
                                <Input type="password" placeholder="Confirm new password" />
                                <Button>Update Password</Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Session Management</h4>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                                You're currently logged in on this device. You can log out of all other sessions for security.
                            </p>
                            <Button variant="outline">Log out other sessions</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
