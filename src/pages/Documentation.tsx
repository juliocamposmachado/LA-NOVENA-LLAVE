import { useEffect } from "react";
import { useLocation } from "react-router";
import { DocSidebar } from "@/components/documentation/DocSidebar";
import { BackToTop } from "@/components/documentation/BackToTop";
import { SearchBar } from "@/components/documentation/SearchBar";
import { HomeSection } from "@/components/documentation/sections/HomeSection";
import { ObjectiveSection } from "@/components/documentation/sections/ObjectiveSection";
import { OverviewSection } from "@/components/documentation/sections/OverviewSection";
import { ThreatModelSection } from "@/components/documentation/sections/ThreatModelSection";
import { ArchitectureSection } from "@/components/documentation/sections/ArchitectureSection";
import { AuthenticationSection } from "@/components/documentation/sections/AuthenticationSection";
import { FirmwareSection } from "@/components/documentation/sections/FirmwareSection";
import { AntiAttackSection } from "@/components/documentation/sections/AntiAttackSection";
import { AnatelSection } from "@/components/documentation/sections/AnatelSection";
import { SecurityChecklistSection } from "@/components/documentation/sections/SecurityChecklistSection";
import { CostEstimationSection } from "@/components/documentation/sections/CostEstimationSection";
import { FirmwareCodeSection } from "@/components/documentation/sections/FirmwareCodeSection";

export default function Documentation() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <DocSidebar />
      <BackToTop />
      
      <main className="xl:pl-64">
        <div className="max-w-5xl mx-auto px-6 py-8 xl:px-12">
          <div className="mb-8 flex justify-center">
            <SearchBar />
          </div>
          
          <HomeSection />
          <ObjectiveSection />
          <OverviewSection />
          <ThreatModelSection />
          <ArchitectureSection />
          <AuthenticationSection />
          <FirmwareSection />
          <AntiAttackSection />
          <AnatelSection />
          <SecurityChecklistSection />
          <CostEstimationSection />
          <FirmwareCodeSection />
        </div>
      </main>
    </div>
  );
}
