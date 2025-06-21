import type { Subject, Topic } from "@/context/study-context"

export interface ScheduledTopic extends Topic {
  subjectName: string
  priorityScore: number
  dueDate?: string // For spaced repetition
}

export function generateStudySchedule(subjects: Subject[]): {
  dailySuggestions: ScheduledTopic[]
  urgentTopics: ScheduledTopic[]
} {
  const allTopics: ScheduledTopic[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today's date to start of day

  subjects.forEach((subject) => {
    subject.topics.forEach((topic) => {
      let priorityScore = 0
      let dueDate: string | undefined

      // Base priority on status
      if (topic.status === "new") {
        priorityScore += 100
      } else if (topic.status === "learning") {
        priorityScore += 50
      } else if (topic.status === "revised") {
        priorityScore += 10 // Lower base priority if recently revised
      }

      // Factor in difficulty
      priorityScore += topic.difficulty * 10

      // Factor in exam date (if available)
      if (subject.examDate) {
        const examDate = new Date(subject.examDate)
        examDate.setHours(0, 0, 0, 0)
        const diffTime = examDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 7 && diffDays >= 0) {
          priorityScore += 200 // Very high priority for exams within a week
        } else if (diffDays > 7 && diffDays <= 30) {
          priorityScore += 100 // High priority for exams within a month
        }
        // Topics after exam date or in past are not prioritized for study
        if (diffDays < 0) {
          priorityScore = -1 // Mark as completed or irrelevant for scheduling
        }
      }

      // Spaced Repetition Logic (simplified)
      if (topic.status === "revised" && topic.lastRevised) {
        const lastRevisedDate = new Date(topic.lastRevised)
        lastRevisedDate.setHours(0, 0, 0, 0)
        const daysSinceRevised = Math.ceil((today.getTime() - lastRevisedDate.getTime()) / (1000 * 60 * 60 * 24))

        // Example: Revise after 1, 3, 7, 14, 30 days
        const nextRevisionIntervals = [1, 3, 7, 14, 30]
        let nextRevisionDay = 0
        for (const interval of nextRevisionIntervals) {
          if (daysSinceRevised < interval) {
            nextRevisionDay = interval
            break
          }
        }
        if (nextRevisionDay === 0 && daysSinceRevised >= nextRevisionIntervals[nextRevisionIntervals.length - 1]) {
          nextRevisionDay = nextRevisionIntervals[nextRevisionIntervals.length - 1] * 2 // If already passed all intervals, double last one
        }

        if (nextRevisionDay > 0) {
          const nextDueDate = new Date(lastRevisedDate)
          nextDueDate.setDate(lastRevisedDate.getDate() + nextRevisionDay)
          dueDate = nextDueDate.toISOString().split("T")[0]

          const daysUntilDue = Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          if (daysUntilDue <= 0) {
            priorityScore += 150 // Overdue
          } else if (daysUntilDue <= 3) {
            priorityScore += 75 // Due soon
          }
        }
      }

      if (priorityScore >= 0) {
        // Only include topics that are relevant for scheduling
        allTopics.push({
          ...topic,
          subjectName: subject.name,
          priorityScore,
          dueDate,
        })
      }
    })
  })

  // Sort by priority (descending)
  allTopics.sort((a, b) => b.priorityScore - a.priorityScore)

  // Simple daily suggestions (e.g., top 5)
  const dailySuggestions = allTopics.slice(0, 5)

  // Urgent topics (e.g., priority score > threshold or overdue)
  const urgentTopics = allTopics.filter(
    (topic) => topic.priorityScore > 150 || (topic.dueDate && new Date(topic.dueDate) <= today),
  )

  return { dailySuggestions, urgentTopics }
}
