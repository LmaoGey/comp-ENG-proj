// File: companySupervisorMain.js
class CompanySupervisorDashboard {
    constructor() {
        this.applicationManager = new ApplicationManager();
        this.logbookViewer = new LogbookViewer();
        this.logbookApproval = new LogbookApproval();
        this.attendanceRecorder = new AttendanceRecorder();
        this.initializeDashboard();
    }

    async initializeDashboard() {
        // Load supervisor's data
        await this.loadSupervisorData();
        this.setupNavigation();
        this.updateDashboardStats();
    }

    async loadSupervisorData() {
        const supervisorId = this.getCurrentSupervisorId();
        
        // Load applications
        const applications = await this.applicationManager.fetchApplications(supervisorId);
        this.applicationManager.displayApplications(applications);
        
        // Load students
        const students = await this.attendanceRecorder.fetchSupervisorStudents(supervisorId);
        this.populateStudentDropdown(students);
    }

    setupNavigation() {
        // Tab navigation
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.showTab(tabId);
            });
        });
    }

    showTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabId).classList.add('active');
    }

    populateStudentDropdown(students) {
        const select = document.getElementById('studentSelect');
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.id})`;
            select.appendChild(option);
        });
    }

    updateDashboardStats() {
        // Update dashboard statistics
        fetch('/api/supervisor/stats')
            .then(response => response.json())
            .then(stats => {
                document.getElementById('pendingApps').textContent = stats.pendingApplications;
                document.getElementById('activeStudents').textContent = stats.activeStudents;
                document.getElementById('logbooksPending').textContent = stats.logbooksPendingReview;
            });
    }

    getCurrentSupervisorId() {
        // This should come from authentication/session
        return localStorage.getItem('supervisorId') || 'demo_supervisor_id';
    }
}

// Global functions for HTML onclick events
function approveApp(applicationId) {
    const appManager = new ApplicationManager();
    appManager.approveApplication(applicationId)
        .then(() => {
            alert('Application approved!');
            location.reload();
        })
        .catch(error => console.error('Error:', error));
}

function showRejectForm(applicationId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
        const appManager = new ApplicationManager();
        appManager.rejectApplication(applicationId, reason)
            .then(() => {
                alert('Application rejected!');
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    }
}

function viewApplicationDetails(applicationId) {
    window.location.href = `/applications/${applicationId}`;
}

function addComment(entryId) {
    document.getElementById('entryId').value = entryId;
    document.getElementById('commentModal').style.display = 'block';
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CompanySupervisorDashboard();
});
