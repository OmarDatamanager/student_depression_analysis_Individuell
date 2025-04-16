import gv from './wait-for-google-charts.js';
import jload from './jload.js';
import $ from './shorthand-query-selector.js';

let counter = 1;

export default async function drawGoogleChart({ type, data, element, options }) {
  element = element && $(element);
  if (!element) {
    element = document.createElement('div');
    element.classList.add('chart-' + counter++);
    document.querySelector('main').append(element);
  }

  if (typeof data === 'string') {
    data = await jload(data);
  }

  let chart = new gv[type](element);
  chart.draw(gv.toTable(data), options);
}

let timeout;
window.onresize = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => location.reload(), 1000);
};
