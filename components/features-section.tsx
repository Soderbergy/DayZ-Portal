import { UsersIcon, ServerIcon, ClipboardCheckIcon, ActivityIcon, ShieldCheckIcon, ZapIcon } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: ServerIcon,
      title: "Real-time Server Monitoring",
      description:
        "Monitor your DayZ server performance, player counts, and uptime in real-time with responsive dashboards.",
    },
    {
      icon: UsersIcon,
      title: "Team Management",
      description:
        "Create teams, invite members, and assign custom roles with detailed permissions for effective collaboration.",
    },
    {
      icon: ClipboardCheckIcon,
      title: "Task Management",
      description:
        "Create, assign, and track tasks for both individuals and teams with deadlines and progress updates.",
    },
    {
      icon: ActivityIcon,
      title: "Activity Logging",
      description: "Full logging of all user and team actions with access controlled by team roles and permissions.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Authentication",
      description:
        "Discord OAuth login for secure user authentication and seamless integration with your existing community.",
    },
    {
      icon: ZapIcon,
      title: "Scalable Architecture",
      description: "Built on a modern tech stack that allows for seamless future additions and feature expansions.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to manage your DayZ server and team in one place
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

