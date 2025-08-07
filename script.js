// Grab DOM elements
const itemInput = document.getElementById('item');
const unitInput = document.getElementById('unit');
const qtyInput = document.getElementById('quantity');
const rateInput = document.getElementById('rate');
const tableBody = document.getElementById('boq-body');
const totalDisplay = document.getElementById('total');

let total = 0;

// Add Row Function
function addRow() {
  const item = itemInput.value.trim();
  const unit = unitInput.value.trim();
  const quantity = parseFloat(qtyInput.value);
  const rate = parseFloat(rateInput.value);

  if (!item || !unit || isNaN(quantity) || isNaN(rate)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const amount = quantity * rate;
  total += amount;

  // Create table row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${item}</td>
    <td>${unit}</td>
    <td>${quantity}</td>
    <td>${rate}</td>
    <td>${amount.toFixed(2)}</td>
  `;

  tableBody.appendChild(newRow);
  updateTotal();

  // Clear inputs
  itemInput.value = '';
  unitInput.value = '';
  qtyInput.value = '';
  rateInput.value = '';
}

// Update Total Display
function updateTotal() {
  totalDisplay.textContent = `Total BOQ Amount: ₦${total.toFixed(2)}`;
}

// Hook buttons
document.getElementById('add-btn').addEventListener('click', addRow);
document.getElementById('calc-btn').addEventListener('click', updateTotal);
