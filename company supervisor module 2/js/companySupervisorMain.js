/**
 * CSE6214 Software Engineering Fundamentals
 * Internship Placement System
 * Company Supervisor Main Module
 * 
 * This is the main controller that integrates all company supervisor functions:
 * 1. Application Approval/Rejection
 * 2. Student Logbook Management
 * 3. Attendance Recording
 * 4. Student Management Dashboard
 */

class CompanySupervisorDashboard {
    constructor() {
        // Initialize all modules
        this.applicationManager = new ApplicationManager();
        this.logbookViewer = new LogbookViewer();
        this.logbookApproval = new LogbookApproval();
        this.attendanceRecorder = new AttendanceRecorder();
        
        // Current supervisor ID (in real system, this comes from login)
        this.supervisorId = "SUP001";
        this.supervisorName = "Dr. Sarah Chen";
        
        // Initialize dashboard
        this.initializeDashboard();
        
        console.log("Company Supervisor Dashboard initialized");
    }

    /**
     * Initialize the complete dashboard
     */
    async initializeDashboard() {
        try {
            // Set up UI event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Update dashboard statistics
            this.updateDashboardStats();
            
            // Show default tab
            this.showTab('applications');
            
            console.log("Dashboard initialization complete");
        } catch (error) {
            console.error("Error initializing dashboard:", error);
            this.showErrorMessage("Failed to initialize dashboard. Please refresh the page.");
        }
    }

    /**
     * Set up all event listeners for the UI
     */
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab || e.target.closest('.tab-btn').dataset.tab;
                this.showTab(tabId);
            });
        });

        // Application search and filter
        const searchInput = document.getElementById('searchApplications');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterApplications(e.target.value);
            });
        }

        const statusFilter = document.getElementById('filterStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterApplicationsByStatus(e.target.value);
            });
        }

        // Logbook student selection
        const studentSelectLogbook = document.getElementById('studentSelectLogbook');
        if (studentSelectLogbook) {
            studentSelectLogbook.addEventListener('change', () => {
                const studentId = studentSelectLogbook.value;
                if (studentId) {
                    this.loadStudentLogbook(studentId);
                }
            });
        }

        // Attendance student selection
        const studentSelectAttendance = document.getElementById('studentSelect');
        if (studentSelectAttendance) {
            studentSelectAttendance.addEventListener('change', () => {
                const studentId = studentSelectAttendance.value;
                if (studentId) {
                    this.loadStudentAttendanceSummary(studentId);
                }
            });
        }

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        console.log("Event listeners setup complete");
    }

    /**
     * Load initial data for the dashboard
     */
    async loadInitialData() {
        try {
            // Load applications
            const applications = await this.applicationManager.fetchApplications(this.supervisorId);
            this.applicationManager.displayApplications(applications);

            // Load students
            const students = await this.attendanceRecorder.fetchSupervisorStudents(this.supervisorId);
            this.populateStudentDropdowns(students);
            this.displayStudentCards(students);

            // Load today's attendance
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = await this.attendanceRecorder.getAttendanceForDate(today);
            this.updateTodayAttendance(todayAttendance);

            console.log("Initial data loaded successfully");
        } catch (error) {
            console.error("Error loading initial data:", error);
            this.showErrorMessage("Failed to load data. Using demo data.");
            
            // Fallback to mock data
            this.loadMockData();
        }
    }

    /**
     * Populate student dropdowns in all sections
     */
    populateStudentDropdowns(students) {
        // Logbook dropdown
        const logbookSelect = document.getElementById('studentSelectLogbook');
        if (logbookSelect) {
            this.populateDropdown(logbookSelect, students, "Select a student");
        }

        // Attendance dropdown
        const attendanceSelect = document.getElementById('studentSelect');
        if (attendanceSelect) {
            this.populateDropdown(attendanceSelect, students, "Select Student");
        }
    }

    /**
     * Generic dropdown population
     */
    populateDropdown(selectElement, items, defaultText = "Select") {
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id || item.studentId;
            option.textContent = `${item.name} (${item.studentId})`;
            selectElement.appendChild(option);
        });
    }

    /**
     * Display student cards in the students tab
     */
    displayStudentCards(students) {
        const container = document.getElementById('studentsContainer');
        if (!container) return;

        container.innerHTML = '';

        students.forEach(student => {
            const card = this.createStudentCard(student);
            container.appendChild(card);
        });

        if (students.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-graduate"></i>
                    <p>No students assigned yet</p>
                </div>
            `;
        }
    }

    /**
     * Create HTML for a student card
     */
    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';
        
        // Get initials for avatar
        const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        card.innerHTML = `
            <div class="student-avatar" style="background: ${student.avatarColor || '#4A00E0'}">
                ${initials}
            </div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p><i class="fas fa-id-card"></i> ${student.studentId}</p>
                <p><i class="fas fa-envelope"></i> ${student.email}</p>
                <p><i class="fas fa-graduation-cap"></i> ${student.program}</p>
            </div>
            <div class="student-stats">
                <div class="stat">
                    <div class="stat-value">${student.attendanceRate || 0}%</div>
                    <div class="stat-label">Attendance</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${student.completedTasks || 0}</div>
                    <div class="stat-label">Tasks</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${student.performanceRating || 0}/5</div>
                    <div class="stat-label">Rating</div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-view" onclick="dashboard.viewStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-comment" onclick="dashboard.sendMessage('${student.id}')">
                    <i class="fas fa-comment"></i> Message
                </button>
            </div>
        `;
        
        return card;
    }

    /**
     * Switch between tabs
     */
    showTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
        
        // Show active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Load data for specific tabs
        if (tabId === 'logbooks') {
            this.loadLogbookData();
        } else if (tabId === 'attendance') {
            this.loadAttendanceData();
        }
    }

    /**
     * Load data for logbooks tab
     */
    async loadLogbookData() {
        const studentSelect = document.getElementById('studentSelectLogbook');
        if (studentSelect.value) {
            await this.loadStudentLogbook(studentSelect.value);
        }
    }

    /**
     * Load data for attendance tab
     */
    async loadAttendanceData() {
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect.value) {
            await this.loadStudentAttendanceSummary(studentSelect.value);
        }
    }

    /**
     * Load and display student logbook
     */
    async loadStudentLogbook(studentId = null) {
        try {
            if (!studentId) {
                studentId = document.getElementById('studentSelectLogbook').value;
            }
            
            if (!studentId) {
                this.showInfoMessage("Please select a student to view their logbook");
                return;
            }

            const date = document.getElementById('logbookDate').value;
            const logbook = await this.logbookViewer.fetchStudentLogbook(studentId, date);
            this.logbookViewer.displayLogbook(logbook);
        } catch (error) {
            console.error("Error loading logbook:", error);
            this.showErrorMessage("Failed to load logbook");
        }
    }

    /**
     * Load student attendance summary
     */
    async loadStudentAttendanceSummary(studentId = null) {
        try {
            if (!studentId) {
                studentId = document.getElementById('studentSelect').value;
            }
            
            if (!studentId) {
                document.getElementById('attendanceSummary').innerHTML = 
                    '<p>Select a student to view their attendance summary</p>';
                return;
            }

            const startDate = '2026-01-01'; // Last 30 days
            const endDate = '2026-01-20';
            await this.attendanceRecorder.generateAttendanceSummary(studentId, startDate, endDate);
        } catch (error) {
            console.error("Error loading attendance summary:", error);
            this.showErrorMessage("Failed to load attendance summary");
        }
    }

    /**
     * Filter applications based on search text
     */
    filterApplications(searchText) {
        const filtered = this.applicationManager.applications.filter(app => 
            app.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
            app.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
            app.internshipPosition.toLowerCase().includes(searchText.toLowerCase())
        );
        
        this.applicationManager.displayApplications(filtered);
    }

    /**
     * Filter applications by status
     */
    filterApplicationsByStatus(status) {
        if (status === 'all') {
            this.applicationManager.displayApplications(this.applicationManager.applications);
        } else {
            const filtered = this.applicationManager.applications.filter(app => 
                app.status === status
            );
            this.applicationManager.displayApplications(filtered);
        }
    }

    /**
     * Update dashboard statistics
     */
    updateDashboardStats() {
        // Update application count
        const pendingApps = this.applicationManager.applications.filter(app => 
            app.status === 'pending'
        ).length;
        document.getElementById('pendingApps').textContent = pendingApps;

        // Update logbook count (in real system, would come from API)
        const pendingLogbooks = this.logbookViewer.logbookEntries?.filter(entry => 
            entry.status === 'pending'
        ).length || 0;
        document.getElementById('logbooksPending').textContent = pendingLogbooks;

        // Update active students count
        const activeStudents = this.attendanceRecorder.students?.length || 0;
        document.getElementById('activeStudents').textContent = activeStudents;
    }

    /**
     * Update today's attendance display
     */
    updateTodayAttendance(attendanceRecords) {
        if (!attendanceRecords || attendanceRecords.length === 0) {
            document.getElementById('attendanceToday').textContent = '0/0';
            return;
        }

        const presentCount = attendanceRecords.filter(record => 
            record.status === 'present'
        ).length;
        
        const totalCount = attendanceRecords.length;
        document.getElementById('attendanceToday').textContent = `${presentCount}/${totalCount}`;
    }

    /**
     * Handle application approval
     */
    async handleApproveApplication(applicationId) {
        try {
            const result = await this.applicationManager.approveApplication(applicationId);
            if (result.success) {
                this.showSuccessMessage("Application approved successfully!");
                this.updateDashboardStats();
                
                // Refresh applications display
                const applications = await this.applicationManager.fetchApplications(this.supervisorId);
                this.applicationManager.displayApplications(applications);
            }
        } catch (error) {
            console.error("Error approving application:", error);
            this.showErrorMessage("Failed to approve application");
        }
    }

    /**
     * Handle application rejection
     */
    async handleRejectApplication(applicationId, reason) {
        try {
            const result = await this.applicationManager.rejectApplication(applicationId, reason);
            if (result.success) {
                this.showSuccessMessage("Application rejected successfully!");
                this.updateDashboardStats();
                
                // Refresh applications display
                const applications = await this.applicationManager.fetchApplications(this.supervisorId);
                this.applicationManager.displayApplications(applications);
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            this.showErrorMessage("Failed to reject application");
        }
    }

    /**
     * View application details in modal
     */
    async viewApplicationDetails(applicationId) {
        try {
            const application = this.applicationManager.applications.find(app => 
                app.id === applicationId
            );
            
            if (!application) {
                this.showErrorMessage("Application not found");
                return;
            }

            const modalContent = document.getElementById('appDetailsContent');
            modalContent.innerHTML = this.createApplicationDetailsHTML(application);
            
            document.getElementById('appDetailsModal').style.display = 'block';
        } catch (error) {
            console.error("Error viewing application details:", error);
            this.showErrorMessage("Failed to load application details");
        }
    }

    /**
     * Create HTML for application details
     */
    createApplicationDetailsHTML(application) {
        return `
            <div class="application-details">
                <div class="detail-row">
                    <label>Student Name:</label>
                    <strong>${application.studentName}</strong>
                </div>
                <div class="detail-row">
                    <label>Student ID:</label>
                    <span>${application.studentId}</span>
                </div>
                <div class="detail-row">
                    <label>Program:</label>
                    <span>${application.studentProgram}</span>
                </div>
                <div class="detail-row">
                    <label>GPA:</label>
                    <span>${application.gpa}</span>
                </div>
                <div class="detail-row">
                    <label>Position:</label>
                    <span>${application.internshipPosition}</span>
                </div>
                <div class="detail-row">
                    <label>Applied Date:</label>
                    <span>${application.appliedDate}</span>
                </div>
                <div class="detail-row">
                    <label>Status:</label>
                    <span class="status-badge status-${application.status}">
                        ${application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                </div>
                <div class="detail-section">
                    <label>Cover Letter:</label>
                    <div class="cover-letter">${application.coverLetter}</div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-approve" onclick="dashboard.handleApproveApplication('${application.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-reject" onclick="dashboard.showRejectForm('${application.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn btn-view" onclick="window.open('${application.resumeUrl}', '_blank')">
                        <i class="fas fa-file-pdf"></i> View Resume
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show reject form for application
     */
    showRejectForm(applicationId) {
        const reason = prompt("Please enter the reason for rejection:");
        if (reason && reason.trim()) {
            this.handleRejectApplication(applicationId, reason.trim());
        } else if (reason !== null) {
            this.showErrorMessage("Please enter a reason for rejection");
        }
    }

    /**
     * View student details
     */
    viewStudentDetails(studentId) {
        this.showInfoMessage(`Viewing details for student ${studentId} - Feature in development`);
        // In full implementation, would open student profile modal
    }

    /**
     * Send message to student
     */
    sendMessage(studentId) {
        const message = prompt("Enter your message to the student:");
        if (message && message.trim()) {
            this.showSuccessMessage("Message sent successfully!");
            // In full implementation, would send via API
        }
    }

    /**
     * Handle logout
     */
    handleLogout() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('supervisorId');
            this.showSuccessMessage("Logged out successfully!");
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);
        }
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    /**
     * Load mock data as fallback
     */
    loadMockData() {
        console.log("Loading mock data...");
        
        // Applications
        this.applicationManager.applications = window.mockData?.applications || [];
        this.applicationManager.displayApplications(this.applicationManager.applications);
        
        // Students
        const students = window.mockData?.students || [];
        this.attendanceRecorder.students = students;
        this.populateStudentDropdowns(students);
        this.displayStudentCards(students);
        
        // Logbooks
        this.logbookViewer.logbookEntries = window.mockData?.logbookEntries || [];
        
        // Attendance
        this.attendanceRecorder.attendanceRecords = window.mockData?.attendanceRecords || [];
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        alert(`✅ ${message}`);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        alert(`❌ ${message}`);
    }

    /**
     * Show info message
     */
    showInfoMessage(message) {
        alert(`ℹ️ ${message}`);
    }
}

// Global functions for HTML onclick events (accessible from HTML)
window.dashboard = null; // Will hold dashboard instance

function approveApp(applicationId) {
    if (window.dashboard) {
        window.dashboard.handleApproveApplication(applicationId);
    }
}

function rejectApp(applicationId) {
    if (window.dashboard) {
        window.dashboard.showRejectForm(applicationId);
    }
}

function viewApplicationDetails(applicationId) {
    if (window.dashboard) {
        window.dashboard.viewApplicationDetails(applicationId);
    }
}

function loadStudentLogbook() {
    if (window.dashboard) {
        window.dashboard.loadStudentLogbook();
    }
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
}

function closeAppDetailsModal() {
    document.getElementById('appDetailsModal').style.display = 'none';
}

function addComment(entryId) {
    document.getElementById('entryId').value = entryId;
    document.getElementById('commentModal').style.display = 'block';
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.dashboard = new CompanySupervisorDashboard();
        console.log("Company Supervisor Dashboard ready!");
    } catch (error) {
        console.error("Failed to initialize dashboard:", error);
        alert("Failed to initialize the dashboard. Please check the console for errors.");
    }
});

// Make dashboard available globally for debugging
window.getDashboard = () => window.dashboard;