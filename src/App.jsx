import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Phone, Mail, ArrowRight, ShieldCheck, Truck, Scale, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Smooth navigation handler — intercepts all anchor[href^="#"] clicks
function useSmoothNav(flashRef) {
    useEffect(() => {
        const handleClick = (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            e.preventDefault();

            const targetId = anchor.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            // Subtle flash overlay for a cinematic section-cut feel
            if (flashRef.current) {
                gsap.fromTo(
                    flashRef.current,
                    { opacity: 0 },
                    {
                        opacity: 0.07,
                        duration: 0.18,
                        ease: 'power2.in',
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => gsap.set(flashRef.current, { opacity: 0 })
                    }
                );
            }

            // Smooth GSAP scroll with premium easing
            gsap.to(window, {
                duration: 1.35,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power4.inOut',
            });
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [flashRef]);
}

export default function App() {
    const container = useRef();
    const flashRef = useRef();
    const mobileMenuRef = useRef();
    const mobileLinksRef = useRef([]);
    const [menuOpen, setMenuOpen] = useState(false);
    useSmoothNav(flashRef);

    // Animate mobile menu open/close
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (menuOpen) {
            gsap.set(mobileMenuRef.current, { display: 'flex' });
            gsap.fromTo(mobileMenuRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
            gsap.from(mobileLinksRef.current,
                { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
            );
        } else {
            gsap.to(mobileMenuRef.current,
                {
                    opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
                    onComplete: () => gsap.set(mobileMenuRef.current, { display: 'none' })
                }
            );
        }
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Navbar scroll effect
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: { className: 'nav-scrolled', targets: '.navbar' }
            });

            // Hero animations
            const tl = gsap.timeline();
            tl.from('.hero-word', { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out' }, 0.3)
                .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power2.out' }, 1)
                .from('.hero-cta', { y: 20, opacity: 0, duration: 1, ease: 'power2.out' }, 1.3);

            // Features Cards Fade Up
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '.features-section',
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Philosophy Section text reveal
            gsap.from('.phil-line-1', {
                scrollTrigger: { trigger: '.philosophy-section', start: 'top 60%' },
                opacity: 0, y: 30, duration: 1
            });
            gsap.from('.phil-line-2-word', {
                scrollTrigger: { trigger: '.philosophy-section', start: 'top 50%' },
                opacity: 0, y: 40, duration: 1, stagger: 0.1, ease: 'power3.out'
            });

            // Protocol Stacking Archive
            const cards = gsap.utils.toArray('.protocol-card');
            cards.forEach((card, i) => {
                if (i !== cards.length - 1) { // Don't shrink the last card
                    gsap.to(card, {
                        scale: 0.92,
                        opacity: 0.3,
                        filter: 'blur(8px)',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top top',
                            end: 'bottom top',
                            scrub: true,
                            pin: true,
                            pinSpacing: false
                        }
                    });
                } else {
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top top',
                        end: '+=100%',
                        pin: true,
                        pinSpacing: true
                    });
                }
            });

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={container} className="relative w-full bg-background selection:bg-accent selection:text-white">
            {/* Cinematic flash overlay for navigation clicks */}
            <div ref={flashRef} className="fixed inset-0 z-[100] pointer-events-none bg-background" style={{ opacity: 0 }} />
            <div className="noise-overlay" />

            {/* MOBILE MENU OVERLAY */}
            <div
                ref={mobileMenuRef}
                className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex-col items-center justify-center gap-10 hidden"
            >
                <button onClick={closeMenu} className="absolute top-7 right-7 text-white/70 hover:text-white transition-colors">
                    <X size={28} />
                </button>
                {['#services', '#approach', '#process', '#contact'].map((href, i) => (
                    <a
                        key={href}
                        href={href}
                        ref={el => mobileLinksRef.current[i] = el}
                        onClick={closeMenu}
                        className="text-3xl font-serif italic text-white/90 hover:text-accent transition-colors tracking-wide"
                    >
                        {['Services', 'Approach', 'Process', 'Contact'][i]}
                    </a>
                ))}
                <a href="tel:+919443921222" className="mt-4 flex items-center gap-2 text-white/50 text-sm font-mono tracking-widest hover:text-accent transition-colors">
                    <Phone size={14} /> +91 9443921222
                </a>
            </div>

            {/* NAVBAR */}
            <nav className="navbar fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl px-5 py-3 rounded-full flex items-center justify-between transition-all duration-500 border bg-primary/40 backdrop-blur-md border-white/10 text-white shadow-lg [&.nav-scrolled]:bg-background/90 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:text-primary [&.nav-scrolled]:border-border [&.nav-scrolled]:shadow-sm">
                {/* Logo */}
                <div className="font-serif text-lg tracking-wide uppercase font-semibold">Sekar</div>

                {/* Desktop links */}
                <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
                    <a href="#services" className="opacity-90 hover:opacity-100 hover:-translate-y-[1px] transition-all">Services</a>
                    <a href="#approach" className="opacity-90 hover:opacity-100 hover:-translate-y-[1px] transition-all">Approach</a>
                    <a href="#process" className="opacity-90 hover:opacity-100 hover:-translate-y-[1px] transition-all">Process</a>
                </div>

                {/* Desktop CTA */}
                <a href="#contact" className="hidden md:inline-flex px-5 py-2 rounded-full border border-white/40 text-sm font-medium transition-all hover:bg-white hover:text-primary [.nav-scrolled_&]:border-primary/40 [.nav-scrolled_&]:hover:bg-primary [.nav-scrolled_&]:hover:text-white">
                    Contact Us
                </a>

                {/* Mobile: phone + hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <a href="tel:+919443921222" className="p-2 text-white/80 hover:text-accent transition-colors">
                        <Phone size={18} />
                    </a>
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="p-2 text-white/90 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative h-[100dvh] w-full flex items-end px-6 md:px-16 pb-24 overflow-hidden">
                {/* Background Image - Local Copra Image */}
                <div className="absolute inset-0 w-full h-full bg-primary z-0">
                    <img
                        src="/hero.png"
                        alt="Copra Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Cinematic multi-layer gradient overlay */}
                <div className="absolute inset-0 z-[1] pointer-events-none">
                    {/* Layer 1: Heavy bottom sweep — anchors text */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #2B2622 0%, #2B2622 8%, rgba(43,38,34,0.85) 30%, rgba(43,38,34,0.4) 55%, rgba(43,38,34,0.15) 75%, rgba(43,38,34,0.35) 100%)' }} />
                    {/* Layer 2: Left vignette — adds depth for text side */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(43,38,34,0.7) 0%, rgba(43,38,34,0.3) 40%, transparent 70%)' }} />
                    {/* Layer 3: Warm cinematic color wash */}
                    <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(135deg, rgba(176,107,26,0.15) 0%, transparent 50%, rgba(43,38,34,0.2) 100%)' }} />
                </div>

                <div className="relative w-full max-w-5xl z-[2] text-white">
                    <h1 className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-x-4 overflow-hidden">
                            {['Connecting', 'people,'].map((w, i) => (
                                <span key={i} className="hero-word text-4xl md:text-6xl lg:text-7xl font-sans tracking-tight font-medium leading-[1.1]">{w}</span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 overflow-hidden mt-1 md:mt-4">
                            {['not', 'just', 'copra.'].map((w, i) => (
                                <span key={i} className="hero-word text-5xl md:text-7xl lg:text-8xl font-serif italic text-accent tracking-normal leading-[1.1]">{w}</span>
                            ))}
                        </div>
                    </h1>
                    <p className="hero-sub mt-8 max-w-xl text-lg md:text-xl text-white/80 font-sans tracking-wide leading-relaxed">
                        Reliable copra brokerage connecting farmers, dryers, and oil mills in Kangeyam. Built on decades of trust, fair pricing, and long-term relationships.
                    </p>
                    <div className="hero-cta mt-10 flex gap-4 items-center">
                        <a href="#contact" className="group relative overflow-hidden bg-accent text-white px-8 py-4 rounded-full font-medium tracking-wide flex items-center gap-2 hover:scale-[1.03] transition-transform magnetic">
                            <span className="relative z-10 flex items-center gap-2">Discuss Requirements <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ... (rest of the sections remain structurally the same) ... */}

            {/* FEATURES / SERVICES */}
            <section id="services" className="features-section py-32 px-6 md:px-16 bg-surface relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <h2 className="text-4xl md:text-5xl font-serif text-primary">Core Facilitation Services</h2>
                        <p className="max-w-sm text-textDark/80">Streamlining the coconut trade ecosystem with absolute transparency and dedicated coordination.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="feature-card bg-background rounded-[2rem] p-10 border border-border/50 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-8 border border-border">
                                <Scale className="text-accent" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 tracking-tight">Sourcing & Pricing</h3>
                            <p className="text-textDark/70 leading-relaxed mb-8 flex-1">
                                Connecting buyers and sellers while providing expert price negotiation support to ensure fair market value for both parties.
                            </p>
                            <div className="text-sm font-medium text-accent border-b border-accent/30 w-fit pb-1">Price Discovery</div>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card bg-background rounded-[2rem] p-10 border border-border/50 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-500 delay-100">
                            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-8 border border-border">
                                <ShieldCheck className="text-accent" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 tracking-tight">Quality Coordination</h3>
                            <p className="text-textDark/70 leading-relaxed mb-8 flex-1">
                                Navigating complex quality discussions and precise moisture coordination to meet exact oil mill extraction standards.
                            </p>
                            <div className="text-sm font-medium text-accent border-b border-accent/30 w-fit pb-1">Moisture Standards</div>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card bg-background rounded-[2rem] p-10 border border-border/50 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-500 delay-200">
                            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-8 border border-border">
                                <Truck className="text-accent" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 tracking-tight">Trade Facilitation</h3>
                            <p className="text-textDark/70 leading-relaxed mb-8 flex-1">
                                End-to-end logistics coordination, ensuring seamless transport and delivery from dryer yards directly to mill silos.
                            </p>
                            <div className="text-sm font-medium text-accent border-b border-accent/30 w-fit pb-1">Transport Management</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section id="approach" className="philosophy-section relative py-40 bg-primary text-white overflow-hidden px-6 md:px-16 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <p className="phil-line-1 text-xl md:text-2xl font-sans text-white/50 tracking-wide">
                        Most commodity brokers focus on: transactional volume and quick margins.
                    </p>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight flex flex-wrap justify-center gap-x-4">
                        {['We', 'focus', 'on:', 'long-term', 'relationships', '&', 'fair', 'trade.'].map((w, i) => (
                            <span key={i} className={`phil-line-2-word ${w === 'relationships' || w === 'fair' ? 'italic text-accent' : ''}`}>
                                {w}
                            </span>
                        ))}
                    </h2>
                </div>
            </section>

            {/* PROTOCOL / PROCESS */}
            <section id="process" className="relative bg-background">
                {[
                    {
                        step: "01",
                        title: "Network Activation",
                        desc: "We leverage our deep roots in Kangeyam to source exact grade copra from trusted coconut dryers matching specific mill requirements."
                    },
                    {
                        step: "02",
                        title: "Fair Value Consensus",
                        desc: "Expert mediation on price based on real-time market data, ensuring a transparent and equitable agreement between buyer and seller."
                    },
                    {
                        step: "03",
                        title: "Logistical Execution",
                        desc: "Coordinating quality checks, precise moisture verification, loading, and final delivery to the oil mill gates seamlessly."
                    }
                ].map((item, idx) => (
                    <div key={idx} className="protocol-card min-h-screen w-full flex items-center px-6 md:px-16 bg-background relative border-t border-border/40">
                        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
                            <div className="order-2 md:order-1 flex justify-center">
                                {/* Abstract Data/Trade Visuals */}
                                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border border-border relative flex items-center justify-center bg-surface">
                                    <div className="absolute inset-2 border border-dashed border-accent/40 rounded-full animate-[spin_60s_linear_infinite]" />
                                    <div className="absolute inset-8 border border-border rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                                    <div className="text-8xl font-serif italic text-accent/20 select-none">{item.step}</div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 space-y-6">
                                <span className="font-mono text-sm tracking-widest text-accent">PHASE {item.step}</span>
                                <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight">{item.title}</h2>
                                <p className="text-lg text-textDark/70 leading-relaxed max-w-lg">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* FOOTER / CONTACT */}
            <footer id="contact" className="bg-primary text-white rounded-t-[3rem] p-10 md:p-20 relative overflow-hidden mt-32">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">

                    <div className="space-y-10">
                        <div>
                            <h3 className="text-3xl font-serif font-semibold mb-2">Sekar Canvassing</h3>
                            <p className="text-white/60 text-lg">Connecting People, Not Just Copra.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-mono text-xs tracking-widest text-white/80">ACCEPTING INQUIRIES</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h4 className="text-sm font-mono tracking-widest text-accent">CONTACT</h4>
                            <ul className="space-y-4 text-white/80">
                                <li>
                                    <a href="tel:+919443921222" className="flex items-center gap-3 hover:text-accent transition-colors group">
                                        <Phone size={18} className="text-white/50 group-hover:text-accent" />
                                        +91 9443921222
                                    </a>
                                </li>
                                <li>
                                    <a href="https://wa.me/919443921222" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors group">
                                        <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        WhatsApp Message
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:gunasekaran.kangayam@gmail.com" className="flex items-center gap-3 hover:text-accent transition-colors group">
                                        <Mail size={18} className="text-white/50 group-hover:text-accent" />
                                        Send Email
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-mono tracking-widest text-accent">HQ</h4>
                            <address className="not-italic text-white/80 leading-relaxed">
                                Kangeyam,<br />
                                Tamil Nadu, India.
                            </address>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
