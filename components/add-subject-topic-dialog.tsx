"use client"

import type React from "react"

import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useStudy } from "@/context/study-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function AddSubjectTopicDialog() {
  const { subjects, addSubject, addTopic } = useStudy()
  const [subjectName, setSubjectName] = useState("")
  const [examDate, setExamDate] = useState("")
  const [selectedSubjectId, setSelectedSubjectId] = useState("")
  const [topicName, setTopicName] = useState("")
  const [topicDifficulty, setTopicDifficulty] = useState("1")
  const { toast } = useToast()

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (subjectName.trim()) {
      addSubject(subjectName.trim(), examDate || undefined)
      setSubjectName("")
      setExamDate("")
      toast({
        title: "Subject Added!",
        description: `'${subjectName}' has been added.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Subject name cannot be empty.",
        variant: "destructive",
      })
    }
  }

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSubjectId && topicName.trim()) {
      addTopic(selectedSubjectId, topicName.trim(), Number.parseInt(topicDifficulty))
      setTopicName("")
      setTopicDifficulty("1")
      toast({
        title: "Topic Added!",
        description: `'${topicName}' added to subject.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Please select a subject and enter a topic name.",
        variant: "destructive",
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Study Item</DialogTitle>
        <DialogDescription>Add new subjects or topics to your study plan.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {/* Add Subject Form */}
        <form onSubmit={handleAddSubject} className="grid gap-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">Add New Subject</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectName" className="text-right">
              Subject Name
            </Label>
            <Input
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="examDate" className="text-right">
              Exam Date (Optional)
            </Label>
            <Input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-black text-white">
              Add Subject
            </Button>
          </DialogFooter>
        </form>

        {/* Add Topic Form */}
        <form onSubmit={handleAddTopic} className="grid gap-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">Add New Topic</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="selectSubject" className="text-right">
              Select Subject
            </Label>
            {subjects.length === 0 ? (
              <div className="col-span-3">
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="text-muted-foreground">No subjects available. Add one first.</span>
                </div>
              </div>
            ) : (
              <Select onValueChange={setSelectedSubjectId} value={selectedSubjectId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topicName" className="text-right">
              Topic Name
            </Label>
            <Input
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topicDifficulty" className="text-right">
              Difficulty (1-5)
            </Label>
            <Select onValueChange={setTopicDifficulty} value={topicDifficulty}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-black text-white" disabled={subjects.length === 0}>
              Add Topic
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  )
}
