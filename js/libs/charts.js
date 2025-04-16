import Chart from 'chart.js/auto';

export function renderEnrollmentChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Stadsbor", "Landsbygd", "Lägsta kast", "Övre kast"],
      datasets: [{
        label: "Antal studenter (i tusental)",
        data: [800, 350, 200, 700],
        backgroundColor: ["#2980b9", "#27ae60", "#c0392b", "#8e44ad"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Antagning till universitet efter socialgrupp"
        }
      }
    }
  });
}

export function renderWorkingChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Arbetar samtidigt", "Studerar på heltid"],
      datasets: [{
        data: [60, 40],
        backgroundColor: ["#f39c12", "#3498db"]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Andel studenter som arbetar parallellt med studier"
        }
      }
    }
  });
}

export function renderGenderChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2015", "2017", "2019", "2021", "2023"],
      datasets: [
        {
          label: "Kvinnor",
          data: [45, 48, 50, 53, 56],
          borderColor: "#e91e63",
          fill: false
        },
        {
          label: "Män",
          data: [55, 52, 50, 47, 44],
          borderColor: "#2196f3",
          fill: false
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Könsfördelning i högre utbildning över tid (%)"
        }
      }
    }
  });
}
