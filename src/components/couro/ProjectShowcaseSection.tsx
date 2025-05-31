
"use client";
import { motion } from "framer-motion";
import SharkFitHighlight from "./SharkFitHighlight";
import OtherProjectsSection from "./OtherProjectsSection";

const ProjectShowcaseSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SharkFitHighlight />
        <OtherProjectsSection />
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;
