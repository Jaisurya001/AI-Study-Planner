"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Subject, TopicStatus } from "@/context/study-context"
import { Progress } from "@/components/ui/progress"
import type { ScheduledTopic } from "@/lib/ai-scheduling-logic"
import { Badge } from "@/components/ui/badge"
import { useStudy } from "@/context/study-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface DashboardOverviewProps {
  subjects: Subject[]
  dailySuggestions: ScheduledTopic[]
  urgentTopics: ScheduledTopic[]
}

export default function DashboardOverview({ subjects, dailySuggestions, urgentTopics }: DashboardOverviewProps) {
  const { updateTopicStatus } = useStudy()
  const { toast } = useToast()

  const getProgress = (subject: Subject) => {
    if (subject.topics.length === 0) return 0
    const revisedCount = subject.topics.filter((topic) => topic.status === "revised").length
    return Math.round((revisedCount / subject.topics.length) * 100)
  }

  const handleStatusChange = (subjectId: string, topicId: string, newStatus: TopicStatus) => {
    updateTopicStatus(subjectId, topicId, newStatus)
    toast({
      title: "Topic Status Updated!",
      description: "The topic's status has been successfully changed.",
    })
  }

  const getStatusColor = (status: TopicStatus) => {
    switch (status) {
      case "new":
        return "bg-gray-200 text-gray-800"
      case "learning":
        return "bg-yellow-200 text-yellow-800"
      case "revised":
        return "bg-green-200 text-green-800"
      default:
        return ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-auto">
      {/* Subject Progress */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <p className="text-gray-500">No subjects added yet. Add some to see progress!</p>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{subject.name}</h3>
                    <span className="text-sm text-gray-600">{getProgress(subject)}% Revised</span>
                  </div>
                  <Progress value={getProgress(subject)} className="h-2" />
                  {subject.examDate && (
                    <p className="text-xs text-gray-500">
                      Exam Date: {new Date(subject.examDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold mb-1">Topics:</h4>
                    {subject.topics.length === 0 ? (
                      <p className="text-xs text-gray-500">No topics for this subject.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Topic</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subject.topics.map((topic) => (
                            <TableRow key={topic.id}>
                              <TableCell className="font-medium">{topic.name}</TableCell>
                              <TableCell>{topic.difficulty}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(topic.status)}>{topic.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Select
                                  onValueChange={(value: TopicStatus) =>
                                    handleStatusChange(subject.id, topic.id, value)
                                  }
                                  value={topic.status}
                                >
                                  <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="learning">Learning</SelectItem>
                                    <SelectItem value="revised">Revised</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Daily Study Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Study Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            {dailySuggestions.length === 0 ? (
              <p className="text-gray-500">No suggestions yet. Add subjects/topics and generate a schedule!</p>
            ) : (
              <ul className="space-y-2">
                {dailySuggestions.map((topic) => (
                  <li key={topic.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm text-gray-600">
                        {topic.subjectName} (Priority: {topic.priorityScore})
                      </p>
                    </div>
                    {topic.dueDate && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Due: {new Date(topic.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Urgent Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {urgentTopics.length === 0 ? (
              <p className="text-gray-500">No urgent topics at the moment. Keep up the good work!</p>
            ) : (
              <ul className="space-y-2">
                {urgentTopics.map((topic) => (
                  <li key={topic.id} className="flex items-center justify-between text-red-600">
                    <div>
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm">
                        {topic.subjectName} (Priority: {topic.priorityScore})
                      </p>
                    </div>
                    {topic.dueDate && (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Overdue: {new Date(topic.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exam Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exam Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.filter((s) => s.examDate).length === 0 ? (
              <p className="text-gray-500">No upcoming exams set.</p>
            ) : (
              <ul className="space-y-2">
                {subjects
                  .filter((s) => s.examDate && new Date(s.examDate) >= new Date())
                  .sort((a, b) => new Date(a.examDate!).getTime() - new Date(b.examDate!).getTime())
                  .map((subject) => (
                    <li key={subject.id} className="flex items-center justify-between">
                      <p className="font-medium">{subject.name}</p>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        {new Date(subject.examDate!).toLocaleDateString()}
                      </Badge>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
