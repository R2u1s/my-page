import { HeroSection } from "../../../widgets/hero";
import { SkillsSection } from "../../../widgets/skills";
import { ProjectsSection } from "../../../widgets/projects";
import { VisitCounterSection } from "../../../widgets/visit-counter";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <VisitCounterSection />
    </>
  );
}
