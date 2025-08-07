// Select elements
const addItemBtn = document.getElementById('add-item-btn');
const calculateTotalBtn = document.getElementById('calculate-total-btn');
const boqTableBody = document.querySelector('#boq-table tbody');
const totalAmountDisplay = document.getElementById('total-amount');

// Store all rows in an array
let boqItems = [];

// Function to add item to table
addItemBtn.addEventListener('click', () => {
    const itemName = document.getElementById('item-name').value.trim();
    const unit = document.getElementById('unit').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const rate = parseFloat(document.getElementById('rate').value);

    if (!itemName || !unit || isNaN(quantity) || isNaN(rate)) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    const amount = quantity * rate;

    // Save item to array
    boqItems.push({ itemName, unit, quantity, rate, amount });

    // Update table
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itemName}</td>
        <td>${unit}</td>
        <td>${quantity}</td>
        <td>${rate}</td>
        <td>${amount.toFixed(2)}</td>
    `;
    boqTableBody.appendChild(row);

    // Clear inputs
    document.getElementById('item-name').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('rate').value = '';
});

// Function to calculate total
calculateTotalBtn.addEventListener('click', () => {
    const total = boqItems.reduce((sum, item) => sum + item.amount, 0);
    totalAmountDisplay.textContent = `₦${total.toFixed(2)}`;
});
