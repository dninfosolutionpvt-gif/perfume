import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';

// Premium Fonts Setup
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Premium SEO Metadata
export const metadata = {
  title: "Aura Luxe | Premium Luxury Inspired Perfumes & Fragrances",
  description: "Discover L'Élixir collections by Aura Luxe. Highly concentrated premium perfumes inspired by world-famous luxury scents. Find your signature scent today.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col font-sans">
        <CartProvider>
          {/* Header Bar */}
          <Navbar />
          
          {/* Main Scent Space */}
          <main className="flex-grow pt-[72px] sm:pt-[80px]">
            {children}
          </main>
          
          {/* Slide-over Drawers */}
          <CartDrawer />
          <WishlistDrawer />
          
          {/* Footer Bar */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
