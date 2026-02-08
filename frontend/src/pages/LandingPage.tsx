import { useNavigate } from 'react-router-dom';
import { ShoppingCart, BarChart3, Users, CreditCard, Shield, Zap, ArrowRight, CheckCircle, Package, Clock, TrendingUp, Store } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <ShoppingCart size={24} />,
            title: 'Smart POS Terminal',
            description: 'Intuitive point-of-sale interface with barcode scanning, quick checkout, and real-time inventory updates.'
        },
        {
            icon: <BarChart3 size={24} />,
            title: 'Advanced Analytics',
            description: 'Comprehensive sales reports, revenue tracking, and actionable insights to grow your business.'
        },
        {
            icon: <Users size={24} />,
            title: 'Multi-Branch Management',
            description: 'Manage multiple store locations from a single dashboard with role-based access control.'
        },
        {
            icon: <CreditCard size={24} />,
            title: 'Seamless Payments',
            description: 'Accept all payment methods including cash, cards, and digital wallets with ease.'
        },
        {
            icon: <Shield size={24} />,
            title: 'Enterprise Security',
            description: 'Bank-grade security with encrypted data, secure authentication, and audit trails.'
        },
        {
            icon: <Zap size={24} />,
            title: 'Lightning Fast',
            description: 'Optimized performance for busy retail environments with offline capability.'
        }
    ];

    const capabilities = [
        { icon: <Package size={20} />, label: 'Inventory Management' },
        { icon: <Clock size={20} />, label: 'Shift Tracking' },
        { icon: <TrendingUp size={20} />, label: 'Sales Analytics' },
        { icon: <Store size={20} />, label: 'Multi-Store Support' },
        { icon: <Users size={20} />, label: 'Customer Management' }
    ];

    const stats = [
        { value: '6+', label: 'Core Modules' },
        { value: '4', label: 'User Roles' },
        { value: '100%', label: 'Open Source' },
        { value: '24/7', label: 'Self-Hosted' }
    ];

    return (
        <div className="min-h-screen bg-[#f8f7f4]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f7f4]/80 backdrop-blur-md border-b border-[#e5e4e0]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-[#1a472a] flex items-center justify-center">
                            <ShoppingCart size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#1a472a]">RetailFlow</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-[#4a5568] hover:text-[#1a472a] transition-colors font-medium">Features</a>
                        <a href="#why-retailflow" className="text-[#4a5568] hover:text-[#1a472a] transition-colors font-medium">Why RetailFlow</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-[#1a472a] font-medium hover:bg-[#1a472a]/5 rounded-lg transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 bg-[#1a472a] text-white font-medium rounded-lg hover:bg-[#1a472a]/90 transition-colors shadow-lg shadow-[#1a472a]/20"
                        >
                            Start Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Floating avatars decoration */}
                <div className="absolute top-40 left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-2xl">👩‍💼</span>
                </div>
                <div className="absolute top-52 right-[15%] w-14 h-14 rounded-full bg-gradient-to-br from-green-200 to-green-300 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                    <span className="text-xl">👨‍💻</span>
                </div>
                <div className="absolute bottom-40 left-[20%] w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>
                    <span className="text-lg">🧑‍💼</span>
                </div>
                <div className="absolute bottom-60 right-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.7s' }}>
                    <span className="text-2xl">👩‍🔧</span>
                </div>

                {/* Cursor decorations */}
                <div className="absolute top-60 left-[25%] hidden lg:block">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M1 1L12 19L8 8L19 12L1 1Z" fill="#1a472a" stroke="#1a472a" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="absolute bottom-52 right-[25%] hidden lg:block">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M1 1L12 19L8 8L19 12L1 1Z" fill="#1a472a" stroke="#1a472a" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e5e4e0] shadow-sm mb-8">
                        <Zap size={16} className="text-[#d4af37]" />
                        <span className="text-sm font-medium text-[#4a5568]">BUILT FOR SPEED</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a472a] leading-tight mb-6">
                        One tool to{' '}
                        <span className="relative inline-block">
                            manage
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                <path d="M2 8C50 2 150 2 198 8" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </span>
                        <br />
                        sales and your team
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto mb-10">
                        RetailFlow helps retail teams work faster, smarter and more efficiently,
                        delivering the visibility and data-driven insights to boost sales and ensure growth.
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="group px-8 py-4 bg-[#1a472a] text-white font-semibold rounded-lg hover:bg-[#1a472a]/90 transition-all shadow-xl shadow-[#1a472a]/20 flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section className="py-12 px-6 border-y border-[#e5e4e0] bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-sm font-medium text-[#6b7280]">
                            <span className="text-[#1a472a] font-bold">Powerful Features</span><br />
                            Everything you need
                        </p>
                        <div className="flex items-center gap-8 flex-wrap justify-center">
                            {capabilities.map((cap, index) => (
                                <div key={index} className="flex items-center gap-2 text-[#6b7280] hover:text-[#1a472a] transition-colors">
                                    {cap.icon}
                                    <span className="text-sm font-medium">{cap.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e5e4e0] shadow-sm mb-6">
                            <CheckCircle size={16} className="text-[#1a472a]" />
                            <span className="text-sm font-medium text-[#4a5568]">FEATURES</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1a472a] mb-4">
                            Latest advanced technologies to<br />
                            ensure everything you need
                        </h2>
                        <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
                            Maximize your team's productivity and revenue with our affordable,
                            user-friendly point of sale system.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-white rounded-2xl border border-[#e5e4e0] hover:border-[#1a472a]/20 hover:shadow-xl hover:shadow-[#1a472a]/5 transition-all duration-300"
                            >
                                <div className="h-14 w-14 rounded-xl bg-[#f0f9f1] flex items-center justify-center text-[#1a472a] mb-6 group-hover:bg-[#1a472a] group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#1a472a] mb-3">{feature.title}</h3>
                                <p className="text-[#6b7280] leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why RetailFlow Section (replacing testimonials) */}
            <section id="why-retailflow" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0f9f1] rounded-full mb-6">
                                <Store size={16} className="text-[#1a472a]" />
                                <span className="text-sm font-medium text-[#1a472a]">WHY RETAILFLOW</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1a472a] leading-relaxed mb-6">
                                Built for modern retail businesses that demand efficiency and control
                            </h2>
                            <p className="text-lg text-[#6b7280] mb-6">
                                RetailFlow is a complete point-of-sale solution designed for multi-branch retail operations.
                                From inventory tracking to employee management, our platform gives you full visibility
                                into every aspect of your business.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-[#1a472a] mt-1 flex-shrink-0" />
                                    <span className="text-[#4a5568]">Role-based access control for Cashiers, Branch Managers, Store Admins, and Super Admins</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-[#1a472a] mt-1 flex-shrink-0" />
                                    <span className="text-[#4a5568]">Real-time sales tracking and comprehensive analytics dashboard</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-[#1a472a] mt-1 flex-shrink-0" />
                                    <span className="text-[#4a5568]">Complete inventory management with stock alerts and reorder tracking</span>
                                </li>
                            </ul>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="p-6 bg-[#f8f7f4] rounded-2xl text-center">
                                    <p className="text-4xl md:text-5xl font-bold text-[#1a472a] mb-2">{stat.value}</p>
                                    <p className="text-[#6b7280]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-[#1a472a]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to scale your<br />retail business?
                    </h2>
                    <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                        Get started with RetailFlow today and take control of your
                        sales, inventory, and team management.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white text-[#1a472a] font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Get Started Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-[#0f2818]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <ShoppingCart size={20} className="text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">RetailFlow</span>
                            </div>
                            <p className="text-white/60 text-sm">
                                Modern point of sale system built for retail excellence.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-3 text-white/60 text-sm">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#why-retailflow" className="hover:text-white transition-colors">Why RetailFlow</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-3 text-white/60 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-3 text-white/60 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-sm">© 2026 RetailFlow. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-white/40 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
