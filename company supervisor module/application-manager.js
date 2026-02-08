// File: applicationApproval.js
class ApplicationManager {
    constructor() {
        this.applications = [];
    }

    // Fetch applications for the company supervisor
    async fetchApplications(companyId) {
        const response = await fetch(`/api/applications/company/${companyId}`);
        this.applications = await response.json();
        return this.applications;
    }

    // Approve an application
    async approveApplication(applicationId) {
        const response = await fetch(`/api/applications/${applicationId}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
        return response.json();
    }

    // Reject an application
    async rejectApplication(applicationId, reason) {
        const response = await fetch(`/api/applications/${applicationId}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'rejected', 
                rejectionReason: reason 
            })
        });
        return response.json();
    }

    // Display applications in a table
    displayApplications(applications) {
        const table = document.getElementById('applicationsTable');
        table.innerHTML = '';

        applications.forEach(app => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${app.studentName}</td>
                <td>${app.studentId}</td>
                <td>${app.internshipPosition}</td>
                <td>${app.applicationDate}</td>
                <td>${app.status}</td>
                <td>
                    <button onclick="viewApplicationDetails('${app.id}')">View</button>
                    <button onclick="approveApp('${app.id}')">Approve</button>
                    <button onclick="showRejectForm('${app.id}')">Reject</button>
                </td>
            `;
        });
    }
}
