document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    fetchHistory();
});

async function fetchHistory() {
    const operation = document.getElementById('history-filter').value;
    const table = document.getElementById('history-table');
    const tbody = document.getElementById('history-body');
    const msgBox = document.getElementById('history-message');
    const token = localStorage.getItem('jwt_token');

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/quantities/history/operation/${operation}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            alert("Your secure session has expired. Please log in again.");
            logout();
            return;
        }

        const data = await response.json();
        tbody.innerHTML = '';

        if (response.ok && data.length > 0) {
            table.classList.remove('hidden');
            msgBox.classList.add('hidden');
            data.forEach(record => {
                const val1 = `${record.thisValue} ${record.thisUnit}`;
                const val2 = record.thatUnit ? `${record.thatValue} ${record.thatUnit}` : "-";
                const result = record.resultString ? record.resultString : `${record.resultValue} ${record.resultUnit}`;

                const row = `
                    <tr>
                        <td><strong>${val1}</strong></td>
                        <td>${val2}</td>
                        <td><span style="color: var(--primary); font-weight: 600;">${record.operation}</span></td>
                        <td class="success"><strong>${result}</strong></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

        } else {
            table.classList.add('hidden');
            msgBox.classList.remove('hidden');
            msgBox.className = "message"; 
            msgBox.innerText = `No history found for '${operation}' operations.`;
        }

    } catch (error) {
        table.classList.add('hidden');
        msgBox.classList.remove('hidden');
        msgBox.className = "message error";
        msgBox.innerText = "Failed to connect to the secure server.";
    }
}