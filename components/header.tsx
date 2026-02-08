"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Phone, Users, Building2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FixHistoryButton } from "@/components/fix-history-button";

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: Phone },
        { name: "Clients", href: "/clients", icon: Building2 },
    ];

    if (session?.user?.role === "ADMIN") {
        navigation.push({ name: "User Management", href: "/users", icon: Users });
    }

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur">
            <div className="container mx-auto max-w-7xl px-4 py-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white hidden sm:block">Phone Manager</span>
                            </Link>

                            <nav className="flex items-center gap-2">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.name} href={item.href}>
                                            <Button
                                                variant={isActive ? "secondary" : "ghost"}
                                                size="sm"
                                                className={
                                                    isActive
                                                        ? "bg-white text-blue-600 hover:bg-white/90"
                                                        : "text-white hover:bg-white/10"
                                                }
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {item.name}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            {session?.user && (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="hidden sm:flex items-center gap-2 text-white cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={session.user.image || ""} />
                                                    <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm">
                                                    <p className="font-medium">{session.user.name}</p>
                                                    <p className="text-xs text-blue-100">{session.user.role}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {session.user.role === "ADMIN" && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <div className="w-full">
                                                            <FixHistoryButton />
                                                        </div>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            )}
                                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
