"use client"

import { useStudy } from "@/context/study-context"
import DashboardOverview from "@/components/dashboard-overview"
import { generateStudySchedule } from "@/lib/ai-scheduling-logic"
import { useEffect, useState } from "react"
import type { ScheduledTopic } from "@/lib/ai-scheduling-logic"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { subjects } = useStudy()
  const [dailySuggestions, setDailySuggestions] = useState<ScheduledTopic[]>([])
  const [urgentTopics, setUrgentTopics] = useState<ScheduledTopic[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (subjects.length > 0) {
      const { dailySuggestions, urgentTopics } = generateStudySchedule(subjects)
      setDailySuggestions(dailySuggestions)
      setUrgentTopics(urgentTopics)
    } else {
      setDailySuggestions([])
      setUrgentTopics([])
    }
  }, [subjects])

  const handleGenerateSchedule = () => {
    if (subjects.length === 0 || subjects.every((s) => s.topics.length === 0)) {
      toast({
        title: "No topics to schedule!",
        description: "Please add some subjects and topics first.",
        variant: "destructive",
      })
      return
    }
    const { dailySuggestions, urgentTopics } = generateStudySchedule(subjects)
    setDailySuggestions(dailySuggestions)
    setUrgentTopics(urgentTopics)
    toast({
      title: "Schedule Generated!",
      description: "Your study schedule has been updated based on your topics.",
    })
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleGenerateSchedule} className="bg-black text-white">
          Generate Study Schedule
        </Button>
      </div>
      <DashboardOverview subjects={subjects} dailySuggestions={dailySuggestions} urgentTopics={urgentTopics} />
    </div>
  )
}
