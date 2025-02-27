import type {
  ActionButton,
  Assignment,
  Module,
  QuizQuestion,
  Resource,
  VideoDescription,
} from '@/components/course-view/types/course'
import {
  BookOpen,
  Download,
  FileCode,
  FileText,
  Link,
  Star,
  Video,
} from 'lucide-react'

export const initialModules: Module[] = [
  {
    id: 'm0',
    title: 'Module 0 - Introduction to course',
    duration: '06:47:58 hours',
    completed: true,
    lessons: [
      {
        id: '0.1',
        title: '0.1 Course Overview and Setup',
        duration: '15:30 minutes',
        completed: true,
        url: 'https://example.com/video1.mp4',
        type: 'video',
      },
      {
        id: '0.2',
        title: '0.2 Development Environment Setup',
        duration: '20:45 minutes',
        completed: true,
        url: 'https://example.com/text1.html',
        type: 'text',
      },
    ],
  },
  {
    id: 'm1',
    title: 'Module 1 - Getting started ',
    duration: '07:52:12 hours',
    completed: true,
    lessons: [
      {
        id: '1.1',
        title: '1.1 Introduction to React Components',
        duration: '25:15 minutes',
        completed: true,
        url: 'https://example.com/video3.mp4',
        type: 'video',
      },
      {
        id: '1.2',
        title: '1.2 JSX Fundamentals',
        duration: '28:40 minutes',
        completed: true,
        url: 'https://example.com/text2.html',
        type: 'text',
      },
      {
        id: '1.3',
        title: '1.3 Props and Components',
        duration: '32:20 minutes',
        completed: true,
        url: 'https://example.com/video5.mp4',
        type: 'video',
      },
    ],
  },
  {
    id: 'm2',
    title: 'Module 2 - Going Deep into React: Adding Interactivity',
    duration: '06:26:18 hours',
    isActive: true,
    completed: false,
    lessons: [
      {
        id: '2.1',
        title: '2.1 Responding to Events - Adding Event Handlers',
        duration: '22:30 minutes',
        completed: true,
        url: 'https://example.com/video6.mp4',
        type: 'video',
      },
      {
        id: '2.2',
        title: '2.2 Responding to Events - Event Propagation',
        duration: '26:45 minutes',
        completed: true,
        url: 'https://example.com/text3.html',
        type: 'text',
      },
      {
        id: '2.3',
        title: "2.3 Understanding State: A Component's Memory",
        duration: '26:13 minutes',
        completed: true,
        url: 'https://example.com/video8.mp4',
        type: 'video',
      },
      {
        id: '2.4',
        title: '2.4 How state works in React - A deep dive',
        duration: '18:25 minutes',
        completed: true,
        url: 'https://example.com/text4.html',
        type: 'text',
      },
      {
        id: '2.5',
        title: '2.5 How Rendering works',
        duration: '14:23 minutes',
        completed: true,
        url: 'https://example.com/video10.mp4',
        type: 'video',
      },
      {
        id: '2.6',
        title: '2.6 State as a Snapshot',
        duration: '24:42 minutes',
        completed: true,
        url: 'https://example.com/text5.html',
        type: 'text',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Module 3 - Managing State',
    duration: '05:30:00 hours',
    completed: false,
    lessons: [
      {
        id: '3.1',
        title: '3.1 State Management Fundamentals',
        duration: '28:15 minutes',
        completed: false,
        url: 'https://example.com/video12.mp4',
        type: 'video',
      },
      {
        id: '3.2',
        title: '3.2 Using Context API',
        duration: '32:45 minutes',
        completed: false,
        url: 'https://example.com/text6.html',
        type: 'text',
      },
      {
        id: '3.3',
        title: '3.3 Reducers and Complex State',
        duration: '35:20 minutes',
        completed: false,
        url: 'https://example.com/video14.mp4',
        type: 'video',
      },
    ],
  },
]

export const actionButtons: ActionButton[] = [
  {
    icon: Star as React.ComponentType<{ className?: string }>,
    label: 'Community',
    content: {
      title: 'Join Our Community',
      description: 'Connect with fellow learners and share your journey',
      body: (
        <div className="space-y-4">
          <p>
            Join our vibrant community of React developers! Share your
            experiences, ask questions, and collaborate with peers who are on
            the same learning journey.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Community Features:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Discussion forums</li>
              <li>Code sharing</li>
              <li>Project showcases</li>
              <li>Peer reviews</li>
              <li>Study groups</li>
            </ul>
          </div>
        </div>
      ),
    },
  },
  {
    icon: FileText,
    label: 'Related Guidelines',
    content: {
      title: 'Related Guidelines',
      description: 'Important information and resources for this lesson',
      body: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Prerequisites:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Basic JavaScript knowledge</li>
              <li>Understanding of ES6+ features</li>
              <li>Familiarity with DOM manipulation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Additional Resources:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>React Documentation</li>
              <li>MDN Web Docs</li>
              <li>Practice Exercises</li>
            </ul>
          </div>
        </div>
      ),
    },
  },
  {
    icon: Download,
    label: 'Video Download',
    content: {
      title: 'Download Options',
      description: 'Choose your preferred video quality',
      body: (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Button variant="outline" className="w-full justify-between">
              <span>HD Quality (720p)</span>
              <span className="text-muted-foreground">1.2 GB</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Medium Quality (480p)</span>
              <span className="text-muted-foreground">720 MB</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Low Quality (360p)</span>
              <span className="text-muted-foreground">400 MB</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: Downloads are available for enrolled students only
          </p>
        </div>
      ),
    },
  },
]

export const videoDescription: VideoDescription = {
  title:
    '2.10 Project Tutorial- Tasker: Streamlining Success with React-Powered Task Management',
  subtitle: 'Tasker - A simple task management system for everyone.',
  description: `Tasker is an intuitive task management system designed for everyone. It enables easy creation and management of tasks with features such as task creation (title, desc, tags, due date, priority, owner), task listing, powerful search with 'debounce' for an enhanced experience, task categorization (by tag, priority, owner), marking tasks as favorites, tracking and updating task status, task editing, and efficient task deletion. Simplify your task management with Tasker.`,
  features: [
    'Task Creation(title, desc, tags, due date, priority, owner)',
    'Listing the tasks',
    "Search: Ability to search by entering keywords that matches one or more tasks. Implement 'debounce' technique for improved search experience.",
    'Categorising the tasks(by tag, priority, owner)',
    'Marking a Task as favorite',
    'Tracking and update the task status',
    'Edit the tasks',
    'Delete one or more tasks',
  ],
}

export const resources: Resource[] = [
  {
    title: 'React Documentation',
    description: 'Official React documentation for components and hooks',
    type: 'documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
    icon: FileCode,
  },
  {
    title: 'Event Handling in React',
    description:
      'A comprehensive guide to handling events in React applications',
    type: 'article',
    url: 'https://example.com/react-events-article',
    icon: FileText,
  },
  {
    title: 'React State Management Tutorial',
    description: 'Video tutorial on state management patterns in React',
    type: 'video',
    url: 'https://example.com/state-management-video',
    icon: Video,
  },
  {
    title: 'React Hooks Cheatsheet',
    description: 'Quick reference guide for React hooks',
    type: 'cheatsheet',
    url: 'https://example.com/hooks-cheatsheet',
    icon: BookOpen,
  },
  {
    title: 'GitHub Repository',
    description: 'Source code for the examples in this lesson',
    type: 'code',
    url: 'https://github.com/example/react-events-demo',
    icon: Link,
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Which of the following are main purposes of the Tasker application? (Select all that apply)',
    options: [
      'Social media management',
      'Task management and organization',
      'Video streaming',
      'Task categorization',
    ],
    correctAnswer: [1, 3],
    type: 'multiple',
  },
  {
    id: 2,
    question:
      'Which features help in improving search performance? (Select all that apply)',
    options: [
      'Task deletion',
      'Task categorization',
      'Debounce technique',
      'Task marking',
    ],
    correctAnswer: [1, 2],
    type: 'multiple',
  },
  {
    id: 3,
    question: 'Select all the features available in the Tasker application:',
    options: [
      'Task Creation',
      'Video Editing',
      'Task Categorization',
      'Image Filtering',
      'Marking Tasks as Favorite',
    ],
    correctAnswer: [0, 2, 4],
    type: 'multiple',
  },
  {
    id: 4,
    question:
      'What are the benefits of using the debounce technique in search? (Select all that apply)',
    options: [
      'Reduces server load',
      'Improves user experience',
      'Prevents unnecessary API calls',
      'Increases search speed',
    ],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
  },
]

export const assignment: Assignment = {
  title: 'Build a React Task Management Application',
  description:
    'Create a simple task management application using React that allows users to add, edit, delete, and mark tasks as complete.',
  totalScore: 100,
  expiryDate: '2025-03-15T23:59:59',
  requirements: [
    'Implement task creation with title, description, and due date',
    'Add functionality to mark tasks as complete',
    'Implement task deletion',
    'Add task filtering (All, Active, Completed)',
    'Use React hooks for state management',
    'Implement responsive design',
    'Add proper error handling',
  ],
  submissionTypes: {
    githubRepo: true,
    githubLive: true,
    codeEditor: true,
  },
  status: 'pending',
}

import { Button } from '@/components/ui/button'
