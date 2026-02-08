// File: attendanceRecorder.js
class AttendanceRecorder {
    constructor() {
        this.attendanceRecords = [];
        this.setupAttendanceForm();
    }

    setupAttendanceForm() {
        document.getElementById('attendanceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordAttendance();
        });
    }

    // Fetch students under supervisor
    async fetchSupervisorStudents(supervisorId) {
        const response = await fetch(`/api/supervisors/${supervisorId}/students`);
        return await response.json();
    }

    // Record attendance
    async recordAttendance() {
        const studentId = document.getElementById('studentSelect').value;
        const date = document.getElementById('attendanceDate').value;
        const status = document.getElementById('attendanceStatus').value;
        const notes = document.getElementById('attendanceNotes').value;
        const supervisorId = 'current_user_id'; // Get from session

        const attendanceData = {
            studentId: studentId,
            date: date,
            status: status,
            notes: notes,
            recordedBy: supervisorId,
            timestamp: new Date().toISOString()
        };

        const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });

        if (response.ok) {
            alert('Attendance recorded successfully');
            document.getElementById('attendanceForm').reset();
            this.updateAttendanceSummary();
        } else {
            alert('Failed to record attendance');
        }
    }

    // Generate attendance summary
    async generateAttendanceSummary(studentId, startDate, endDate) {
        const response = await fetch(
            `/api/attendance/summary?studentId=${studentId}&startDate=${startDate}&endDate=${endDate}`
        );
        const summary = await response.json();
        this.displayAttendanceSummary(summary);
    }

    displayAttendanceSummary(summary) {
        const summaryDiv = document.getElementById('attendanceSummary');
        summaryDiv.innerHTML = `
            <h3>Attendance Summary</h3>
            <p><strong>Total Days:</strong> ${summary.totalDays}</p>
            <p><strong>Present:</strong> ${summary.presentDays}</p>
            <p><strong>Absent:</strong> ${summary.absentDays}</p>
            <p><strong>Late:</strong> ${summary.lateDays}</p>
            <p><strong>Attendance Rate:</strong> ${summary.attendanceRate}%</p>
        `;
    }
}