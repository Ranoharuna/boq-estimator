function addRow() {
  const itemName = document.getElementById("itemName").value;
  const unit = document.getElementById("unit").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  const rate = parseFloat(document.getElementById("rate").value);

  if (!itemName || !unit || isNaN(quantity) || isNaN(rate)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const amount = quantity * rate;

  const tableBody = document.getElementById("boq-body");
  const row = tableBody.insertRow();

  row.innerHTML = `
    <td>${itemName}</td>
    <td>${unit}</td>
    <td>${quantity}</td>
    <td>${rate}</td>
    <td>${amount.toFixed(2)}</td>
  `;

  document.getElementById("itemName").value = "";
  document.getElementById("unit").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("rate").value = "";
}

function calculateTotal() {
  const tableBody = document.getElementById("boq-body");
  let total = 0;

  for (let i = 0; i < tableBody.rows.length; i++) {
    const amount = parseFloat(tableBody.rows[i].cells[4].innerText);
    total += amount;
  }

  document.getElementById("total-amount").innerText = total.toFixed(2);
}

function exportTableToExcel() {
  const table = document.getElementById("boq-table");
  const wb = XLSX.utils.table_to_book(table, { sheet: "BOQ" });
  XLSX.writeFile(wb, "boq-estimate.xlsx");
}
