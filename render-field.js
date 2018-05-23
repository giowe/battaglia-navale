const { readFileSync } = require('fs');
const css = readFileSync('./field.css').toString();

const renderCell = cell => {
  const { ship, hit } = cell;

  return `<td class="${!hit ? '' : ship ? 'colpito affondato' : 'colpito'}">${hit ? hit : ''}</td>`;
};

module.exports = (field, players) => {
  return [
    `<style>${css}</style>`,
    '<table>',
      '<tbody>',
        ...field.map(row => `<tr>${row.map(cell => renderCell(cell)).join('')}</tr>`),
      '</tbody>',
    '</table>'
  ].join('');
};