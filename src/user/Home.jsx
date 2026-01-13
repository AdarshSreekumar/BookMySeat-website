import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaHistory, 
  FaBars, 
  FaInstagram, 
  FaTwitter, 
  FaFacebookF, 
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const loggedUser = JSON.parse(sessionStorage.getItem("user"));
  //   if (loggedUser) setUser(loggedUser);
  // }, []);

      useEffect(() => {
      const checkSession = () => {
        const loggedUser = sessionStorage.getItem("user");
        if (loggedUser && loggedUser !== "undefined") {
          setUser(JSON.parse(loggedUser));
        }
      };

      checkSession();
      // Listen for storage changes in other tabs (optional but good)
      window.addEventListener('storage', checkSession);
      return () => window.removeEventListener('storage', checkSession);
    }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Real-time Selection",
      desc: "See available seats instantly with live color-coded updates as they happen.",
      icon: "💺",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300",
    },
    {
      title: "Mobile Friendly",
      desc: "Book your favorite spot from any device, anywhere, anytime with our responsive app.",
      icon: "📱",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300",
    },
    {
      title: "Instant Confirmation",
      desc: "Receive your booking details and digital ticket immediately after a secure checkout.",
      icon: "⚡",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300",
    },
    {
      title: "Secure Payments",
      desc: "Your transactions are protected by industry-standard encryption and security protocols.",
      icon: "🔒",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300",
    }
  ];

  const bookingSteps = [
    {
      id: 1,
      number: "01",
      subtitle: "Discovery",
      title: "Browse Live Events",
      description: "Explore a curated list of music nights, drama shows, and conferences with real-time schedule updates.",
      highlight: "Unified API Integration",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      number: "02",
      subtitle: "Visualization",
      title: "Interactive Seat Maps",
      description: "Navigate our high-fidelity 3D floor plans. Pick your perfect vantage point with color-coded availability markers.",
      highlight: "Teal Interactive Layouts",
      image: "https://images.unsplash.com/photo-1503095396549-80705a68873c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      number: "03",
      subtitle: "Efficiency",
      title: "One-Click Booking",
      description: "Our optimized checkout flow ensures you secure your seats in seconds before they're gone.",
      highlight: "Sub-second Latency",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 4,
      number: "04",
      subtitle: "Security",
      title: "Seamless Payments",
      description: "Integrated with major providers for secure, encrypted transactions across all devices.",
      highlight: "Secure Teal Gateway",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const containerRef = useRef(null);

  useGSAP(
    () => {
      const pinSections = containerRef.current?.querySelectorAll(".pin-section");
      if (!pinSections || pinSections.length === 0) return;

      pinSections.forEach((section) => {
        const content = section.querySelector(".content-col");
        const image = section.querySelector(".image-col img");

        gsap.set(content.children, { y: 30, opacity: 0 });
        gsap.set(image, { scale: 1.1 });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          onEnter: () => {
            gsap.to(content.children, {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "power2.out"
            });
            gsap.to(image, { scale: 1, duration: 1.2 });
          },
          onLeave: () => {
            gsap.to(content.children, { y: -30, opacity: 0, stagger: 0.05 });
          },
          onEnterBack: () => {
            gsap.to(content.children, { y: 0, opacity: 1, stagger: 0.1 });
          },
          onLeaveBack: () => {
            gsap.to(content.children, { y: 30, opacity: 0, stagger: 0.05 });
          }
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="flex flex-col min-h-screen" style={styles.pageWrapper}>
      {/* --- NAVIGATION --- */}
      <nav style={styles.navbar} className="sticky top-0 z-[100] px-4 md:px-12 border-b border-white/10 backdrop-blur-md">
        <div style={styles.logo}>A <span className="text-teal-400">Auditorium</span></div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8">
            <span style={styles.link} className="hover:text-teal-400 transition-colors" onClick={() => scrollToSection('hero')}>Home</span>
           <Link to={'/events'}> <span style={styles.link} className="hover:text-teal-400 transition-colors" onClick={() => scrollToSection('features')}>Events</span></Link>
          </div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-teal-500/20 p-2 px-4 rounded-full hover:bg-teal-500/30 transition-all border border-teal-400/30"
              >
                <FaUserCircle className="text-xl text-teal-400" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">{user.username}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden text-white">
                  <Link 
                    to="/userprofile" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHistory className="text-teal-400" />
                    <span className="text-xs font-bold uppercase">My Bookings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-950/20 text-red-400 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span className="text-xs font-bold uppercase">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={'/login'}><button style={styles.loginBtn}>Log in</button></Link>
          )}
          
          <div className="md:hidden text-white cursor-pointer">
            <FaBars />
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="hero" style={styles.hero} className="flex-col lg:flex-row text-center lg:text-left">
        <div style={styles.heroContent} className="w-full px-4 mb-12 lg:mb-0">
          <h1 style={styles.heroTitle} className="text-4xl md:text-5xl lg:text-7xl">
            Experience Seamless <br/> 
            <span className="text-teal-400">Event Booking</span>
          </h1>
          <p style={styles.heroSubtitle}>Your premium gateway to secure the perfect seat, effortlessly.</p>
          
          <div style={styles.iconRow} className="justify-center lg:justify-start">
            <div style={styles.iconItem}>📅 <br/> <small className="text-teal-200">Real-time</small></div>
            <div style={styles.iconItem}>💳 <br/> <small className="text-teal-200">Secure Pay</small></div>
            <div style={styles.iconItem}>📱 <br/> <small className="text-teal-200">Mobile First</small></div>
          </div>

         {/* Updated Button Logic */}
            <button 
              onClick={() => {
                const loggedUser = JSON.parse(sessionStorage.getItem("user"));
                if (loggedUser) {
                  navigate("/seatbook");
                } else {
                  navigate("/login");
                }
              }}
              style={styles.primaryBtn} 
              className="hover:scale-105 transition-all"
            >
              {user ? "Continue Booking" : "Get Started"}
            </button>
        </div>

        <div style={styles.heroImageContainer} className="hidden md:flex w-full">
          <div style={styles.isometricStage}>
            <div style={styles.isoScreen}>TEAL AUDITORIUM</div>
            <div style={styles.isoFloor}>
              {[...Array(25)].map((_, i) => (
                <div key={i} style={styles.isoSeat}></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-slate-900 uppercase tracking-tight">
            System Features
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 font-medium">
            A unified booking ecosystem designed for reliability and speed.
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16 px-4"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-teal-100 hover:shadow-2xl transition-all duration-500 h-[340px] flex flex-col items-center text-center border border-slate-100 mx-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black mb-4 text-slate-900 uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 grow text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                  <div className="mt-auto pt-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 transition-all cursor-pointer">
                      Learn more &rarr;
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- GSAP PIN SECTION --- */}
      <div ref={containerRef} className="bg-slate-950">
        {bookingSteps.map((step) => (
          <section
            key={step.id}
            className="pin-section relative w-full h-screen flex flex-col lg:flex-row overflow-hidden border-b border-white/5"
          >
            <div className="content-col w-full lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-20 bg-slate-950/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none order-2 lg:order-1">
              <span className="text-teal-400 font-black text-[10px] tracking-[0.4em] mb-4 uppercase">
                Phase {step.number}
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
                {step.title}
              </h2>
              <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-md mb-8 font-medium">
                {step.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-teal-500" />
                <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  {step.highlight}
                </span>
              </div>
            </div>
            <div className="image-col relative w-full lg:w-1/2 h-full overflow-hidden order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:to-transparent z-10" />
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover grayscale opacity-40 brightness-75"
              />
            </div>
          </section>
        ))}
      </div>

      {/* --- GRID SECTION --- */}
      <section style={styles.greySection}>
        <div style={styles.container} className="px-4">
          <h2 className="text-3xl font-black text-center lg:text-left text-slate-900 uppercase tracking-tighter mb-12">Available Performances</h2>
          <div style={styles.eventGrid} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Live Concert", time: "300 seats left" },
              { title: "Drama Production", time: "Limited Availability" },
              { title: "Comedy Show", time: "50 seats left" },
              { title: "Guest Speaker", time: "120 seats left" }
            ].map((ev, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-2 hover:shadow-teal-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100">
                <div className="h-40 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-teal-600/20 text-4xl">
                   🎭
                </div>
                <div className="p-6">
                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm" style={{margin: 0}}>{ev.title}</h4>
                  <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest mt-2">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REVIEWS SECTION --- */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div style={styles.container} className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
          <div style={styles.footerCol}>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Secured Teal Checkout</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Every transaction is encrypted and processed via our unified payment gateway, ensuring the highest level of security.</p>
            <div className="text-teal-600 text-3xl mt-8 flex gap-6">💳 🏦 📱</div>
          </div>
          <div style={styles.footerCol}>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Member Reviews</h3>
            <div className="flex gap-6 p-8 rounded-[2rem] bg-teal-50/50 border border-teal-100 items-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black">JD</div>
              <div>
                <p className="text-slate-900 font-bold italic mb-2">"The unified teal interface is so clean and easy to navigate!"</p>
                <small className="text-teal-600 font-black uppercase tracking-widest text-[9px]">- Jane Doe, Verified User</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-white pt-20 pb-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div style={styles.logo} className="text-2xl">A <span className="text-teal-400">Auditorium</span></div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The next generation of event management. We provide a seamless, 
                secure, and high-fidelity booking experience for the modern audience.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white transition-all duration-300">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-teal-400 font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'Features', 'Events', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-teal-400 font-black text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-teal-400 font-black text-xs uppercase tracking-[0.2em] mb-8">Contact Info</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-teal-500 mt-1" />
                  <p className="text-slate-400 text-sm font-medium">123 Cinema Plaza, Indigo Street, NY 10012</p>
                </div>
                <div className="flex items-center gap-4">
                  <FaPhoneAlt className="text-teal-500" />
                  <p className="text-slate-400 text-sm font-medium">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-teal-500" />
                  <p className="text-slate-400 text-sm font-medium">support@auditorium.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2025 A Auditorium. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-[10px] font-black uppercase">Powered by</span>
              <span className="text-teal-500 font-black text-xs tracking-tighter">TEAL-STACK</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: { fontFamily: "'Inter', sans-serif", color: "#0f172a", backgroundColor: "#fff" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  navbar: { display: "flex", justifyContent: "space-between", padding: "20px 50px", alignItems: "center", backgroundColor: "#020617", color: "#fff" },
  logo: { fontSize: "20px", fontWeight: "900", letterSpacing: "-1px", textTransform: 'uppercase' },
  link: { fontSize: "11px", cursor: "pointer", opacity: 0.7, fontWeight: "800", textTransform: 'uppercase', letterSpacing: '2px' },
  loginBtn: { border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: "10px 24px", borderRadius: "50px", cursor: "pointer", fontSize: "11px", fontWeight: "800", textTransform: 'uppercase', letterSpacing: '1px' },
  
  hero: { display: "flex", padding: "140px 50px", background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)", color: "#fff", borderRadius: "0 0 100px 100px", alignItems: "center" },
  heroContent: { flex: 1.2 },
  heroTitle: { fontWeight: "900", lineHeight: 0.9, marginBottom: "32px", letterSpacing: "-3px" },
  heroSubtitle: { fontSize: "18px", opacity: 0.6, marginBottom: "56px", maxWidth: "500px", lineHeight: 1.6, fontWeight: '500' },
  iconRow: { display: "flex", gap: "40px", marginBottom: "56px" },
  iconItem: { textAlign: "center", fontSize: "12px", fontWeight: "800", textTransform: 'uppercase' },
  primaryBtn: { backgroundColor: "#0d9488", color: "#fff", border: "none", padding: "20px 48px", borderRadius: "100px", fontWeight: "900", cursor: "pointer", fontSize: "12px", textTransform: 'uppercase', letterSpacing: '2px', boxShadow: "0 20px 40px rgba(13, 148, 136, 0.3)" },
  
  heroImageContainer: { flex: 1, display: "flex", justifyContent: "center" },
  isometricStage: { width: "340px", height: "280px", backgroundColor: "rgba(255,255,255,0.02)", transform: "rotateX(50deg) rotateZ(-25deg)", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" },
  isoScreen: { width: "85%", height: "45px", background: "rgba(13, 148, 136, 0.1)", margin: "12% auto", borderRadius: "12px", color: "#2dd4bf", border: "1px solid rgba(45, 212, 191, 0.3)", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", letterSpacing: '2px' },
  isoFloor: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", padding: "30px" },
  isoSeat: { width: "24px", height: "24px", backgroundColor: "#fff", borderRadius: "6px", opacity: 0.1 },

  whiteSection: { padding: "120px 0" },
  greySection: { padding: "120px 0", backgroundColor: "#f8fafc" },
};

export default Home;