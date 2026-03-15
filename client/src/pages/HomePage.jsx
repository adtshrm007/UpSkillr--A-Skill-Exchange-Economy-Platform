import HeroSection from "../components/ui/HeroSection";
import HowItWorks from "../components/ui/HowItWorks";
import Community from "../components/ui/Community";
import FollowOurNews from "../components/ui/FollowOurNews";
import { AuthProvider } from "../context/Auth.context";
export default function HomePage() {
  return (
    <>
      <AuthProvider>
        <HeroSection />
      </AuthProvider>
      <HowItWorks />
      <Community />
      <FollowOurNews />
    </>
  );
}
