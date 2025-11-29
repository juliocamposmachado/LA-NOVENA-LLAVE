import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { documentationSections } from "@/types/documentation";

export function DocSidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["architecture", "firmware-code"]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Sistema de Fechadura Inteligente
        </h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">
          Documentação Técnica de Firmware
        </p>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {documentationSections.map((section) => (
            <div key={section.id}>
              <Link
                to={`/#${section.id}`}
                onClick={() => {
                  if (section.subsections) {
                    toggleSection(section.id);
                  }
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(section.id)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </span>
                {section.subsections && (
                  <span>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
              </Link>

              {section.subsections && expandedSections.includes(section.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.subsections.map((subsection) => (
                    <Link
                      key={subsection.id}
                      to={`/#${subsection.id}`}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-sm transition-colors",
                        isActive(subsection.id)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {subsection.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          2025 Sistema de Fechadura Inteligente
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 xl:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className="hidden xl:flex xl:w-64 xl:flex-col xl:fixed xl:inset-y-0 bg-sidebar-background border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar-background border-r border-sidebar-border z-50 xl:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
