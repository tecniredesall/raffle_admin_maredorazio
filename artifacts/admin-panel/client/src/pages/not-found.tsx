import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
         <img src={`${import.meta.env.BASE_URL}images/hero-glow.png`} alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="glass-panel relative z-10 w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mb-8 text-muted-foreground">
          La ruta a la que intentas acceder no existe en el panel de administración.
        </p>
        <Link href="/" className="w-full">
          <Button className="w-full">Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
