// Mock Data for Company Supervisor Module
// This file provides test data since we don't have a backend yet

window.mockData = {
    // Company Supervisor Information
    supervisor: {
        id: "SUP001",
        name: "Dr. Sarah Chen",
        email: "sarah.chen@techcorp.com",
        company: "TechCorp Solutions",
        department: "Software Development"
    },

    // Applications Data
    applications: [
        {
            id: "APP001",
            studentId: "STU2024001",
            studentName: "John David",
            studentEmail: "john.david@university.edu",
            studentProgram: "Computer Science",
            gpa: 3.8,
            internshipPosition: "Software Developer Intern",
            appliedDate: "2026-01-10",
            status: "pending",
            coverLetter: "Experienced in JavaScript, React, and Node.js. Completed 3 major projects.",
            resumeUrl: "#",
            interviewDate: null
        },
        {
            id: "APP002",
            studentId: "STU2024002",
            studentName: "Emma Wilson",
            studentEmail: "emma.wilson@university.edu",
            studentProgram: "Information Systems",
            gpa: 3.9,
            internshipPosition: "Data Analyst Intern",
            appliedDate: "2026-01-12",
            status: "pending",
            coverLetter: "Strong background in statistics and data visualization with Python.",
            resumeUrl: "#",
            interviewDate: null
        },
        {
            id: "APP003",
            studentId: "STU2024003",
            studentName: "Michael Brown",
            studentEmail: "michael.brown@university.edu",
            studentProgram: "Software Engineering",
            gpa: 3.6,
            internshipPosition: "Frontend Developer Intern",
            appliedDate: "2026-01-08",
            status: "approved",
            coverLetter: "Passionate about UI/UX design with React and TypeScript experience.",
            resumeUrl: "#",
            interviewDate: "2026-01-18"
        },
        {
            id: "APP004",
            studentId: "STU2024004",
            studentName: "Sophia Garcia",
            studentEmail: "sophia.garcia@university.edu",
            studentProgram: "Computer Engineering",
            gpa: 3.7,
            internshipPosition: "Backend Developer Intern",
            appliedDate: "2026-01-15",
            status: "rejected",
            coverLetter: "Experience with Java Spring Boot and microservices architecture.",
            resumeUrl: "#",
            interviewDate: null,
            rejectionReason: "Position filled"
        }
    ],

    // Students under this supervisor
    students: [
        {
            id: "STU001",
            name: "Alex Johnson",
            studentId: "STU2024005",
            email: "alex.johnson@university.edu",
            program: "Computer Science",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            attendanceRate: 92,
            completedTasks: 45,
            performanceRating: 4.5,
            avatarColor: "#4A00E0"
        },
        {
            id: "STU002",
            name: "Maria Rodriguez",
            studentId: "STU2024006",
            email: "maria.rodriguez@university.edu",
            program: "Information Technology",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            attendanceRate: 88,
            completedTasks: 38,
            performanceRating: 4.2,
            avatarColor: "#8E2DE2"
        },
        {
            id: "STU003",
            name: "David Kim",
            studentId: "STU2024007",
            email: "david.kim@university.edu",
            program: "Software Engineering",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            attendanceRate: 95,
            completedTasks: 52,
            performanceRating: 4.8,
            avatarColor: "#667eea"
        },
        {
            id: "STU004",
            name: "Lisa Wang",
            studentId: "STU2024008",
            email: "lisa.wang@university.edu",
            program: "Data Science",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            attendanceRate: 90,
            completedTasks: 42,
            performanceRating: 4.3,
            avatarColor: "#764ba2"
        }
    ],

    // Logbook Entries
    logbookEntries: [
        {
            id: "LOG001",
            studentId: "STU001",
            studentName: "Alex Johnson",
            date: "2026-01-20",
            taskTitle: "API Development for User Management",
            hoursWorked: 8,
            taskDescription: "Developed REST APIs for user authentication and profile management using Node.js and Express. Implemented JWT token-based authentication and password encryption.",
            skillsApplied: ["JavaScript", "Node.js", "Express", "MongoDB", "JWT"],
            status: "pending",
            comments: [
                {
                    id: "COM001",
                    commenter: "Dr. Sarah Chen",
                    text: "Great work on implementing JWT authentication! Make sure to add proper error handling for edge cases.",
                    date: "2026-01-21 10:30:00"
                }
            ]
        },
        {
            id: "LOG002",
            studentId: "STU001",
            studentName: "Alex Johnson",
            date: "2026-01-19",
            taskTitle: "Database Schema Design",
            hoursWorked: 6,
            taskDescription: "Designed MongoDB schema for the project. Created collections for users, projects, and tasks with proper relationships and indexing.",
            skillsApplied: ["MongoDB", "Database Design", "Indexing"],
            status: "approved",
            comments: [
                {
                    id: "COM002",
                    commenter: "Dr. Sarah Chen",
                    text: "Schema design looks good. Consider adding more indexes for frequently queried fields.",
                    date: "2026-01-19 16:45:00"
                }
            ]
        },
        {
            id: "LOG003",
            studentId: "STU002",
            studentName: "Maria Rodriguez",
            date: "2026-01-20",
            taskTitle: "Frontend Dashboard Development",
            hoursWorked: 7,
            taskDescription: "Created React components for the admin dashboard. Implemented charts using Chart.js and responsive design.",
            skillsApplied: ["React", "JavaScript", "Chart.js", "CSS", "Responsive Design"],
            status: "pending",
            comments: []
        }
    ],

    // Attendance Records
    attendanceRecords: [
        {
            id: "ATT001",
            studentId: "STU001",
            studentName: "Alex Johnson",
            date: "2026-01-20",
            status: "present",
            checkIn: "09:00",
            checkOut: "17:00",
            notes: "On time, productive day"
        },
        {
            id: "ATT002",
            studentId: "STU002",
            studentName: "Maria Rodriguez",
            date: "2026-01-20",
            status: "present",
            checkIn: "09:15",
            checkOut: "17:30",
            notes: "Slightly late due to traffic"
        },
        {
            id: "ATT003",
            studentId: "STU003",
            studentName: "David Kim",
            date: "2026-01-20",
            status: "present",
            checkIn: "08:45",
            checkOut: "17:15",
            notes: "Early arrival, completed extra tasks"
        },
        {
            id: "ATT004",
            studentId: "STU004",
            studentName: "Lisa Wang",
            date: "2026-01-20",
            status: "absent",
            checkIn: null,
            checkOut: null,
            notes: "Medical leave"
        }
    ],

}