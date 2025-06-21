"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, Book, Calendar, Settings, Plus, User2, ChevronDown, ChevronUp, LogIn, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import AddSubjectTopicDialog from "./add-subject-topic-dialog"
import AuthDialog from "./auth-dialog"
import { useStudy } from "@/context/study-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function AppSidebar() {
  const { subjects } = useStudy()
  const { state } = useSidebar()

  const menuItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
    },
    {
      title: "Subjects",
      url: "#",
      icon: Book,
    },
    {
      title: "Exams",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <span className="font-bold text-lg">Study AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.title === "Dashboard"}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel>Study Plan</SidebarGroupLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus />
                  <span className="sr-only">Add Subject/Topic</span>
                </Button>
              </DialogTrigger>
              <AddSubjectTopicDialog />
            </Dialog>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {subjects.length === 0 && (
                <SidebarMenuItem>
                  <span className={`text-sm text-gray-500 px-2 ${state === "collapsed" ? "hidden" : ""}`}>
                    No subjects added.
                  </span>
                </SidebarMenuItem>
              )}
              {subjects.map((subject) => (
                <Collapsible key={subject.id} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Book />
                        <span>{subject.name}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subject.topics.length === 0 && (
                          <SidebarMenuSubItem>
                            <span className="text-xs text-gray-500 px-2">No topics.</span>
                          </SidebarMenuSubItem>
                        )}
                        {subject.topics.map((topic) => (
                          <SidebarMenuSubItem key={topic.id}>
                            <SidebarMenuSubButton asChild>
                              <a href="#">
                                <span>{topic.name}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>User Profile</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                      </Button>
                    </DialogTrigger>
                    <AuthDialog type="login" />
                  </Dialog>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Sign Up</span>
                      </Button>
                    </DialogTrigger>
                    <AuthDialog type="signup" />
                  </Dialog>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
