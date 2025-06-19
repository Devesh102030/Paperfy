import Link from "next/link";
import { HeroSection } from "./components/HeroSection";
import { UseSection } from "./components/UseSection";
import { Features } from "./components/PowerfulFeatures";
import { PricingSection } from "./components/PricingSection";
import { Footer } from "./components/Footer";
import { ActionCall } from "./components/ActionCall";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <UseSection/>
      <Features/>
      <PricingSection/>
      <ActionCall/>
      <Footer/>
    </div>
  );
}

