"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export type TopicStatus = "new" | "learning" | "revised"

export interface Topic {
  id: string
  name: string
  status: TopicStatus
  difficulty: number // 1-5
  lastRevised?: string // Date string (YYYY-MM-DD)
}

export interface Subject {
  id: string
  name: string
  examDate?: string // Date string (YYYY-MM-DD)
  topics: Topic[]
}

interface StudyContextType {
  subjects: Subject[]
  addSubject: (subjectName: string, examDate?: string) => void
  addTopic: (subjectId: string, topicName: string, difficulty: number) => void
  updateTopicStatus: (subjectId: string, topicId: string, newStatus: TopicStatus) => void
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>([])

  const addSubject = (subjectName: string, examDate?: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: subjectName,
      examDate,
      topics: [],
    }
    setSubjects((prev) => [...prev, newSubject])
  }

  const addTopic = (subjectId: string, topicName: string, difficulty: number) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: [
                ...subject.topics,
                {
                  id: crypto.randomUUID(),
                  name: topicName,
                  status: "new",
                  difficulty,
                },
              ],
            }
          : subject,
      ),
    )
  }

  const updateTopicStatus = (subjectId: string, topicId: string, newStatus: TopicStatus) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === topicId
                  ? {
                      ...topic,
                      status: newStatus,
                      lastRevised: newStatus === "revised" ? new Date().toISOString().split("T")[0] : topic.lastRevised,
                    }
                  : topic,
              ),
            }
          : subject,
      ),
    )
  }

  return (
    <StudyContext.Provider value={{ subjects, addSubject, addTopic, updateTopicStatus }}>
      {children}
    </StudyContext.Provider>
  )
}

export const useStudy = () => {
  const context = useContext(StudyContext)
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider")
  }
  return context
}
