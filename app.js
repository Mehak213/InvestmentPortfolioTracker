// app.js
document.addEventListener('DOMContentLoaded', () => {
    const investmentForm = document.getElementById('investment-form');
    const investmentList = document.getElementById('investment-list');
    const totalValueEl = document.getElementById('total-value');
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
  
    // Chart setup
    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    let portfolioChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          label: 'Portfolio Distribution',
          data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      }
    });
  
    // Calculate and update total portfolio value
    function updateTotalValue() {
      const totalValue = investments.reduce((total, investment) => total + investment.currentValue, 0);
      totalValueEl.textContent = totalValue.toFixed(2);
    }
  
    // Update chart
    function updateChart() {
      portfolioChart.data.labels = investments.map(inv => inv.assetName);
      portfolioChart.data.datasets[0].data = investments.map(inv => inv.currentValue);
      portfolioChart.update();
    }
  
    // Render investments in the table
    function renderInvestments() {
      investmentList.innerHTML = '';
      investments.forEach((investment, index) => {
        const percentageChange = ((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100).toFixed(2);
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${investment.assetName}</td>
          <td>$${investment.investedAmount.toFixed(2)}</td>
          <td>$${investment.currentValue.toFixed(2)}</td>
          <td>${percentageChange}%</td>
          <td>
            <button class="update" data-index="${index}">Update</button>
            <button class="remove" data-index="${index}">Remove</button>
          </td>
        `;
        investmentList.appendChild(row);
      });
  
      updateTotalValue();
      updateChart();
    }
  
    // Add investment
    investmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const assetName = document.getElementById('asset-name').value;
      const investedAmount = parseFloat(document.getElementById('invested-amount').value);
      const currentValue = parseFloat(document.getElementById('current-value').value);
  
      const newInvestment = { assetName, investedAmount, currentValue };
      investments.push(newInvestment);
      localStorage.setItem('investments', JSON.stringify(investments));
  
      investmentForm.reset();
      renderInvestments();
    });
  
    // Handle update and remove buttons
    investmentList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove')) {
        const index = e.target.getAttribute('data-index');
        investments.splice(index, 1);
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
      } else if (e.target.classList.contains('update')) {
        const index = e.target.getAttribute('data-index');
        const updatedValue = prompt("Enter the updated current value:", investments[index].currentValue);
        if (updatedValue !== null) {
          investments[index].currentValue = parseFloat(updatedValue);
          localStorage.setItem('investments', JSON.stringify(investments));
          renderInvestments();
        }
      }
    });
  
    // Initial render
    renderInvestments();
  });
  