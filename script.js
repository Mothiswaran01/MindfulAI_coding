let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

const ctx = document.getElementById("financeChart").getContext("2d");
let chart;

form.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();
  form.reset();
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  render();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function render() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.description} - ₹${t.amount}
      <span class="delete" onclick="removeTransaction(${t.id})">❌</span>
    `;
    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  renderChart(income, expense);
}

function renderChart(income, expense) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

render();
