import { Car, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "@/app/actions/auth"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar - Desktop Only for now to keep it simple and minimalist */}
      <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-16 flex-col border-r bg-background/50 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-center border-b">
           <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Car className="size-5" />
          </div>
        </div>
        <nav className="flex flex-1 flex-col items-center gap-4 py-8">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors hover:bg-secondary/80" title="Dashboard">
            <LayoutDashboard className="size-5" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-primary cursor-pointer" title="Reportes">
            <FileText className="size-5" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-primary cursor-pointer" title="Ajustes">
            <Settings className="size-5" />
          </div>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4 py-8">
          <form action={signOut}>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" title="Cerrar Sesión">
              <LogOut className="size-5" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-16">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Verifi-Check</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium leading-none text-foreground/80">
                {user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-muted-foreground">Administrador</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 pb-24">
          <div className="mx-auto max-w-5xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
