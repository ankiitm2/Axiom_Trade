import PulseDashboard from "@/components/feature/PulseDashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
       {/* Top Nav Placeholder (Optional, usually part of layout) */}
      <div className="h-14 border-b border-border/20 flex items-center px-6 bg-background/50 backdrop-blur-md z-50">
          <div className="font-bold text-xl mr-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AXIOM</div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
             <a href="#" className="text-foreground">Pulse</a>
             <a href="#" className="hover:text-foreground transition-colors">Discover</a>
             <a href="#" className="hover:text-foreground transition-colors">Trackers</a>
          </nav>
      </div>

      <div className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto">
        <ErrorBoundary>
           <PulseDashboard />
        </ErrorBoundary>
      </div>
    </main>
  );
}
