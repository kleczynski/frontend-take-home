import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Eye, GitBranch, BarChart3, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Sightings", to: "/sightings" as const, icon: Eye },
  { label: "Workflows", to: "/workflows" as const, icon: GitBranch },
  { label: "Analytics", to: "/analytics" as const, icon: BarChart3 },
];

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-xl">🔍</span>
          <span className="group-data-[collapsible=icon]:hidden">PokéTracker</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  render={<Link to={item.to} />}
                  isActive={!!matchRoute({ to: item.to, fuzzy: true })}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Ranger Field Tool v1.0
          </span>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-7 w-7">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
