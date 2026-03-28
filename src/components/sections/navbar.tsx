"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Shield, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isDark, setIsDark] = React.useState(true)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">
            Urban Resilience <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</Link>
          <Link href="#case-studies" className="text-sm font-medium hover:text-primary transition-colors">Case Studies</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold">
            <Link href="/onboarding">Request Demo</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg font-medium">Features</Link>
          <Link href="#solutions" onClick={() => setIsOpen(false)} className="text-lg font-medium">Solutions</Link>
          <Link href="#case-studies" onClick={() => setIsOpen(false)} className="text-lg font-medium">Case Studies</Link>
          <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium">Pricing</Link>
          <Button asChild className="w-full bg-primary text-primary-foreground">
            <Link href="/onboarding" onClick={() => setIsOpen(false)}>Request Demo</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}