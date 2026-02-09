import { Car, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-2 font-semibold">
           <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Car className="size-4" />
          </div>
          <span>Verifi-Check</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
                {user.email}
            </span>
            <form action="/auth/signout" method="post">
                 {/* We need a signout endpoint or action */}
                 <button className="text-sm font-medium hover:underline">
                    Salir
                 </button>
            </form>
        </div>
      </header>
      <main className="flex-1 flex flex-col p-4 md:p-6 pb-20">
        {children}
      </main>
    </div>
  )
}
