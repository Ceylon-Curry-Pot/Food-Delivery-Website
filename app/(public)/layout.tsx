import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/global/Footer';
import LoyaltyModal from '@/components/loyalty/LoyaltyModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <LoyaltyModal />
    </>
  );
}