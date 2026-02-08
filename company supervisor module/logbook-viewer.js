// File: logbookViewer.js
class LogbookViewer {
    constructor() {
        this.currentLogbook = null;
    }

    // Fetch student logbook
    async fetchStudentLogbook(studentId) {
        const response = await fetch(`/api/logbooks/student/${studentId}`);
        const logbook = await response.json();
        this.currentLogbook = logbook;
        return logbook;
    }

    // Display logbook entries
    displayLogbook(logbook) {
        const container = document.getElementById('logbookContainer');
        container.innerHTML = '';

        logbook.entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'logbook-entry';
            entryDiv.innerHTML = `
                <h4>${entry.date} - ${entry.taskTitle}</h4>
                <p><strong>Hours:</strong> ${entry.hoursWorked}</p>
                <p><strong>Description:</strong> ${entry.taskDescription}</p>
                <p><strong>Skills Applied:</strong> ${entry.skillsApplied.join(', ')}</p>
                <p><strong>Status:</strong> ${entry.status}</p>
                <div id="comments-${entry.id}">
                    ${this.displayComments(entry.comments)}
                </div>
                <button onclick="addComment('${entry.id}')">Add Comment</button>
            `;
            container.appendChild(entryDiv);
        });
    }

    displayComments(comments) {
        if (!comments || comments.length === 0) return '<p>No comments yet.</p>';
        return comments.map(comment => `
            <div class="comment">
                <strong>${comment.commenter}:</strong> ${comment.text}
                <br><small>${comment.date}</small>
            </div>
        `).join('');
    }
}
