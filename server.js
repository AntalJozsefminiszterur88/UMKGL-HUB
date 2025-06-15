const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const usersFile = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(__dirname));

function loadUsers() {
  if (fs.existsSync(usersFile)) {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
  return {};
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end();
  const users = loadUsers();
  if (users[username]) return res.status(409).end();
  users[username] = { password };
  saveUsers(users);
  res.status(200).end();
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users[username] && users[username].password === password) {
    res.status(200).end();
  } else {
    res.status(401).end();
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
