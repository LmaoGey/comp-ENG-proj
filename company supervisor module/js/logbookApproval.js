// File: logbookApproval.js
class LogbookApproval {
    constructor() {
        this.commentForm = document.getElementById('commentForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComment();
        });
    }

    // Approve a logbook entry
    async approveLogbookEntry(entryId) {
        const response = await fetch(`/api/logbook-entries/${entryId}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
        return response.json();
    }

    // Add comment to logbook entry
    async addComment(entryId, commentText, supervisorId) {
        const response = await fetch(`/api/logbook-entries/${entryId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: commentText,
                supervisorId: supervisorId,
                date: new Date().toISOString()
            })
        });
        return response.json();
    }

    // Submit comment from form
    async submitComment() {
        const entryId = document.getElementById('entryId').value;
        const commentText = document.getElementById('commentText').value;
        const supervisorId = 'current_user_id'; // Get from session

        if (!commentText.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            await this.addComment(entryId, commentText, supervisorId);
            alert('Comment added successfully');
            this.commentForm.reset();
            // Refresh logbook display
            location.reload();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    }
}