const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(__dirname));

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Hiányzó adatok' });
  }
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Felhasználó már létezik' });
  }
  users.push({ username, password });
  saveUsers(users);
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Hiányzó adatok' });
  }
  const users = loadUsers();
  const ok = users.find(u => u.username === username && u.password === password);
  if (!ok) {
    return res.status(401).json({ error: 'Hibás adatok' });
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
