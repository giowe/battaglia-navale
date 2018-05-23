const express = require('express');
const app = new express();
const { readFileSync } = require('fs');
const { EOL } = require('os');
const bodyParser = require('body-parser');
const renderField = require('./render-field.js');
const port = 8000;

const players = {};
const ships = {};
const field = {
  grid: readFileSync('./field.txt')
  .toString()
  .split(EOL)
  .map(row => row.split('').map(cellChar => {
    const shipId = cellChar === '.' ? null : cellChar;
    if (shipId) {
      if (!ships[shipId]) {
        ships[shipId] = {
          shipId,
          maxHp: 1,
          curHp: 1,
          killer: null
        };
      } else {
        ships[shipId].maxHp ++;
        ships[shipId].curHp ++;
      }
    }

    return {
      ship: ships[shipId],
      hit: null
    };
  }))
};
field.h = field.grid.length;
field.w = field.grid[0].length;

app.use(bodyParser.json());

app.use((error, req, res, next) => {
  if (error) {
    res.send(400).json({
        message: 'Invalid body'
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const { connection: { remoteAddress } } = req;
  req.player = players[remoteAddress];
  next();
})

app.get('/', (req, res) => {
  res.send(renderField(field.grid));
});

app.get('/info', (req, res) => {
  res.json({
    players,
    field: {
      h: field.h,
      w: field.w
    },
    ships: Object.values(ships).map(({ shipId, maxHp, curHp, killer }) => ({
      shipId,
      maxHp,
      alive: curHp > 0,
      killer
    }))
  });
});

app.post('/signup', ({ connection: { remoteAddress }, body: { name } }, res) => {
  if (!name) return res.status(400).json({
    message: 'Missing name parameter'
  });

  players[remoteAddress] = name;
  res.json({
    message: 'Signup completed'
  });
});

app.post('/', ({ body: { x, y }, player }, res) => {
  if (!player) {
    return res.status(403).json({
      message: 'Signup first'
    });
  }

  if (typeof x !== 'number' || typeof y !== 'number') {
    return res.status(400).json({
      message: 'Missing x or y in number format'
    });
  } else {
    if (y > field.h || y < 1 || x > field.w || x < 1) {
      return res.status(400).json({
        message: 'Out of bounds'
      });
    }
    
    const cell = field.grid[y - 1][x - 1];
    if (cell.hit) {
      return res.status(150).json({
        message: 'Already hit'
      });
    }

    cell.hit = player;
    const { ship } = cell;
    if (ship) {
      ship.curHp --;
      if (ship.curHp === 0) {
        ship.killer = player;
        return res.status(130).json({
          message: 'Killed'
        });
      } else {
        return res.status(120).json({
          message: 'Hit'
        });
      }
    
    } else {
      return res.status(110).json({
        message: `Attack at coords ${x} ${y}`
      });
    }
  }
});

app.all('*', (req, res) => {
  res.status(404).send('page not found');
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
});