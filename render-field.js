const { readFileSync } = require('fs');

const renderCell = cell => {
  const { ship, hit } = cell;

  return `<td class="${!hit ? '' : ship ? 'colpito affondato' : 'colpito'}">${hit ? hit.name : ''}</td>`;
};

module.exports = (field, ships, players) => {
  const css = readFileSync('./field.css').toString();
  return [
    `<style>${css}</style>`,
    '<table id="field">',
      '<tbody>',
        ...field.map(row => `<tr>${row.map(cell => renderCell(cell)).join('')}</tr>`),
      '</tbody>',
    '</table>',
    '<div id="players">',
      '<h1>Players:</h1>',
      '<table>',
        '<thead>',
          '<th><td>Name</td><td>Score</td></th>',
        '</thead>',
        '<tbody>',
          ...Object.values(players).sort((a, b) => b.score - a.score).map(({ name, score }) => `<tr><td>${name}</td><td>${score}</td></tr>`),
        '</tbody>',
      '</table>',
    '</div>',

    '<div id="ships">',
      '<h1>Ships:</h1>',
      '<table>',
        '<tbody>',
          '<th><td>Id</td><td>maxHp</td><td>killer</td></th>',
          ...Object.values(ships).map(({ shipId, maxHp, killer }) => `<tr><td>${shipId}</td><td>${maxHp}</td><td>${killer ? killer.name : 'NA'}</td></tr>`),
        '</tbody>',
      '</table>',
    '</div>'

  ].join('');
};