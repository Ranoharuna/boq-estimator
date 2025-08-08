document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#boqTable tbody");
    const addRowBtn = document.getElementById("addRow");
    const clearTableBtn = document.getElementById("clearTable");

    // Load saved data
    loadTableData();

    // Add new row
    addRowBtn.addEventListener("click", () => {
        addRow();
        saveTableData();
    });

    // Clear table
    clearTableBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all rows?")) {
            tableBody.innerHTML = "";
            saveTableData();
        }
    });

    // Function to add row
    function addRow(data = {}) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" value="${data.item || ''}"></td>
            <td><input type="number" value="${data.qty || ''}" min="0"></td>
            <td><input type="text" value="${data.unit || ''}"></td>
            <td><input type="number" value="${data.rate || ''}" min="0"></td>
            <td><input type="number" value="${data.amount || ''}" readonly></td>
            <td><button class="delete-btn">❌</button></td>
        `;

        // Delete button event
        row.querySelector(".delete-btn").addEventListener("click", () => {
            row.remove();
            saveTableData();
        });

        // Auto-calc amount
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                const qty = parseFloat(row.children[1].querySelector("input").value) || 0;
                const rate = parseFloat(row.children[3].querySelector("input").value) || 0;
                row.children[4].querySelector("input").value = (qty * rate).toFixed(2);
                saveTableData();
            });
        });

        tableBody.appendChild(row);
    }

    // Save table data to localStorage
    function saveTableData() {
        const rows = [];
        tableBody.querySelectorAll("tr").forEach(tr => {
            const inputs = tr.querySelectorAll("input");
            rows.push({
                item: inputs[0].value,
                qty: inputs[1].value,
                unit: inputs[2].value,
                rate: inputs[3].value,
                amount: inputs[4].value
            });
        });
        localStorage.setItem("boqTableData", JSON.stringify(rows));
    }

    // Load table data from localStorage
    function loadTableData() {
        const savedData = JSON.parse(localStorage.getItem("boqTableData") || "[]");
        savedData.forEach(row => addRow(row));
    }
});
