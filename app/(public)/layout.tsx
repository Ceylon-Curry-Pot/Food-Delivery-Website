import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/global/Footer';
import HoursAndLocation from '@/components/global/HoursAndLocation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <HoursAndLocation />
      <Footer />
    </>
  );
}
