const { readFileSync } = require('fs');
const css = readFileSync('./field.css').toString();

const renderCell = cell => {
  const { ship, hit } = cell;

  return `<td class="${!hit ? '' : ship ? 'colpito affondato' : 'colpito'}">${hit ? hit.name : ''}</td>`;
};

module.exports = (field, ships, players) => {
  return [
    `<style>${css}</style>`,
    '<table id="field">',
      '<tbody>',
        ...field.map(row => `<tr>${row.map(cell => renderCell(cell)).join('')}</tr>`),
      '</tbody>',
    '</table>',
    '<div id="players">',
      '<h1>Players:</h1>',
      '<ul>',
        ...Object.values(players).sort((a, b) => b.score - a.score).map(({ name, score }) => `<li>${name} | score: ${score}</li>`),
      '</ul>',
    '</div>'
  ].join('');
};