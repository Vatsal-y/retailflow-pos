import { useNavigate } from 'react-router-dom';
import { ShoppingCart, BarChart3, Users, CreditCard, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

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

    const partners = ['Shopify', 'Square', 'Stripe', 'PayPal', 'Visa'];

    const stats = [
        { value: '10K+', label: 'Active Stores' },
        { value: '500K+', label: 'Transactions Daily' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
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
                        <a href="#testimonials" className="text-[#4a5568] hover:text-[#1a472a] transition-colors font-medium">Testimonials</a>
                        <a href="#pricing" className="text-[#4a5568] hover:text-[#1a472a] transition-colors font-medium">Pricing</a>
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

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group px-8 py-4 bg-[#1a472a] text-white font-semibold rounded-lg hover:bg-[#1a472a]/90 transition-all shadow-xl shadow-[#1a472a]/20 flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white text-[#1a472a] font-semibold rounded-lg border-2 border-[#e5e4e0] hover:border-[#1a472a]/30 transition-colors">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-12 px-6 border-y border-[#e5e4e0] bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-sm font-medium text-[#6b7280]">
                            More than <span className="text-[#1a472a] font-bold">100+</span><br />
                            companies partner
                        </p>
                        <div className="flex items-center gap-12 flex-wrap justify-center">
                            {partners.map((partner) => (
                                <span key={partner} className="text-xl font-bold text-[#9ca3af] hover:text-[#6b7280] transition-colors cursor-default">
                                    {partner}
                                </span>
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
                            ensure everything you needs
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

            {/* Testimonial Section */}
            <section id="testimonials" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <blockquote className="text-2xl md:text-3xl text-[#1a472a] font-medium leading-relaxed mb-8">
                                "Using RetailFlow helped our company to decrease operational
                                and turnaround time, while increasing the resource allocation
                                and effectiveness of our inventory management."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a472a] to-[#2d5a3d] flex items-center justify-center">
                                    <span className="text-xl">👩‍💼</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a472a]">Sarah Mitchell</p>
                                    <p className="text-[#6b7280] text-sm">Head of Operations at RetailPro</p>
                                </div>
                            </div>
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
                        Join thousands of retailers who trust RetailFlow to manage their
                        sales, inventory, and team effectively.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white text-[#1a472a] font-semibold rounded-lg hover:bg-white/90 transition-colors"
                        >
                            Get Started Free
                        </button>
                        <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:border-white/60 transition-colors">
                            Request Demo
                        </button>
                    </div>
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
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
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
                                <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
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
