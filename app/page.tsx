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
      {/* <Link href="/auth/signin">
       <button> Login </button>
      </Link>
      <Link href="/auth/signup">
       <button> Sign Up </button>
      </Link>

      <br />
      <form action="/api/extract-content" method="POST" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload PDF</button>
      </form> */}
    </div>
  );
}

