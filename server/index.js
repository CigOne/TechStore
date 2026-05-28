const express = require('express');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || 'change_me_secret';

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// ===== AUTH ROUTES =====
app.post('/api/auth/login', (req, res) => {
  console.log('LOGIN body:', req.body);
  const { username, password } = req.body;
  console.log('Extracted login:', { username, password });
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const bcrypt = require('bcryptjs');
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.post('/api/auth/register', (req, res) => {
  console.log('REGISTER body:', req.body);
  const { username, password, email } = req.body;
  console.log('Extracted:', { username, password, email });
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email || null, hash, 'user'],
    function(err) {
      console.log('DB insert error:', err);
      if (err) return res.status(400).json({ error: err.message || 'Username or email already taken' });
      const userId = this.lastID;
      db.get('SELECT id, username, role FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'Failed to create user' });
        req.session.userId = user.id;
        req.session.username = user.username;
        res.status(201).json({ success: true, user });
      });
    }
  );
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  db.get('SELECT id, username, role FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) return res.json({ user: null });
    res.json({ user });
  });
});

// ===== CART API =====
app.get('/api/cart', requireAuth, (req, res) => {
  const sql = `
    SELECT c.id, c.quantity, c.product_id,
           p.name, p.slug, p.price, p.image, p.stock, p.description,
           cat.name as category_name
    FROM cart c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE c.user_id = ?
  `;
  db.all(sql, [req.session.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/cart', requireAuth, (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });
  db.run(
    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity',
    [req.session.userId, product_id, quantity],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.patch('/api/cart/:id', requireAuth, (req, res) => {
  const { quantity } = req.body;
  db.run(
    'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, req.params.id, req.session.userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, updated: this.changes });
    }
  );
});

app.delete('/api/cart/:id', requireAuth, (req, res) => {
  db.run(
    'DELETE FROM cart WHERE id = ? AND user_id = ?',
    [req.params.id, req.session.userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deleted: this.changes });
    }
  );
});

app.delete('/api/cart', requireAuth, (req, res) => {
  db.run(
    'DELETE FROM cart WHERE user_id = ?',
    [req.session.userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ===== CATEGORIES CRUD =====
apiCrud(app, '/api/categories', 'categories', ['name', 'slug'], requireAuth);

// ===== PRODUCTS CRUD =====
function productsCrud(app, base, table, requireAuth) {
  // List
  app.get(base, (req, res) => {
    const q = req.query.q || '';
    const cat = req.query.category_id || '';
    let sql = `SELECT p.*, c.name as category_name FROM ${table} p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];
    if (q) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }
    if (cat) {
      sql += ` AND p.category_id = ?`;
      params.push(cat);
    }
    sql += ` ORDER BY p.created_at DESC`;
    db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Create
  app.post(base, requireAuth, (req, res) => {
    const { name, slug, description, price, image, stock, category_id } = req.body;
    db.run(
      `INSERT INTO ${table} (name, slug, description, price, image, stock, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description || '', price || 0, image || '', stock || 0, category_id || null],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT p.*, c.name as category_name FROM ${table} p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [this.lastID], (err, row) => {
          res.status(201).json(row);
        });
      }
    );
  });

  // Read
  app.get(`${base}/:id`, (req, res) => {
    db.get(`SELECT p.*, c.name as category_name FROM ${table} p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    });
  });

  // Update
  app.patch(`${base}/:id`, requireAuth, (req, res) => {
    const { name, slug, description, price, image, stock, category_id } = req.body;
    db.run(
      `UPDATE ${table} SET name = COALESCE(?, name), slug = COALESCE(?, slug), description = COALESCE(?, description), price = COALESCE(?, price), image = COALESCE(?, image), stock = COALESCE(?, stock), category_id = COALESCE(?, category_id) WHERE id = ?`,
      [name, slug, description, price, image, stock, category_id, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT p.*, c.name as category_name FROM ${table} p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [req.params.id], (err, row) => {
          res.json(row);
        });
      }
    );
  });

  // Delete
  app.delete(`${base}/:id`, requireAuth, (req, res) => {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deleted: this.changes });
    });
  });
}

// Generic CRUD helper
function apiCrud(app, base, table, fields, requireAuth) {
  app.get(base, (req, res) => {
    db.all(`SELECT * FROM ${table} ORDER BY id DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  app.post(base, requireAuth, (req, res) => {
    const cols = fields.join(', ');
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(f => req.body[f] || '');
    db.run(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`, values, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM ${table} WHERE id = ?`, [this.lastID], (err, row) => res.status(201).json(row));
    });
  });
  app.get(`${base}/:id`, (req, res) => {
    db.get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    });
  });
  app.patch(`${base}/:id`, requireAuth, (req, res) => {
    const sets = fields.filter(f => req.body[f] !== undefined).map(f => `${f} = ?`).join(', ');
    const values = fields.filter(f => req.body[f] !== undefined).map(f => req.body[f]);
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    db.run(`UPDATE ${table} SET ${sets} WHERE id = ?`, [...values, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id], (err, row) => res.json(row));
    });
  });
  app.delete(`${base}/:id`, requireAuth, (req, res) => {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deleted: this.changes });
    });
  });
}

productsCrud(app, '/api/products', 'products', requireAuth);

// ===== AI COMPARE (Ollama — completely free, local LLM) =====
app.post('/api/ai/compare', async (req, res) => {
  const { product_a_id, product_b_id } = req.body;
  if (!product_a_id || !product_b_id) {
    return res.status(400).json({ error: 'Both product IDs required' });
  }

  try {
    // Fetch both products with category info
    const productA = await new Promise((resolve, reject) => {
      db.get(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [product_a_id], (err, row) => {
        if (err || !row) reject(new Error('Product A not found'));
        else resolve(row);
      });
    });
    const productB = await new Promise((resolve, reject) => {
      db.get(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [product_b_id], (err, row) => {
        if (err || !row) reject(new Error('Product B not found'));
        else resolve(row);
      });
    });

    // Validate same category
    if (productA.category_id !== productB.category_id) {
      return res.status(400).json({ error: 'Products must be from the same category for meaningful comparison' });
    }

    // Build prompt
    const prompt = `Ты — эксперт по технике. Проведи детальное сравнение двух товаров из категории "${productA.category_name || 'техника'}".

**Товар А: ${productA.name}**
Цена: ${productA.price} ₽
Описание: ${productA.description || 'Нет описания'}

**Товар Б: ${productB.name}**
Цена: ${productB.price} ₽
Описание: ${productB.description || 'Нет описания'}

Сравни их по:
1. Цена/соотношение цена-качество
2. Основные характеристики (выведи из названия и описания)
3. Для кого подойдёт каждый товар
4. Преимущества и недостатки каждого
5. Общий вердикт — какой лучше выбрать и почему

Отвечай на русском языке. Структурируй ответ с заголовками. Будь объективным.`;

    // Try Ollama
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
    let aiText = '';

    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: { temperature: 0.7, num_predict: 1500 }
        }),
      });
      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        aiText = ollamaData.response;
      } else {
        throw new Error('Ollama not available');
      }
    } catch (ollamaErr) {
      // Fallback: structured mock comparison if Ollama is not running
      aiText = generateFallbackComparison(productA, productB);
    }

    res.json({
      product_a: { id: productA.id, name: productA.name, price: productA.price, image: productA.image },
      product_b: { id: productB.id, name: productB.name, price: productB.price, image: productB.image },
      comparison: aiText,
      source: aiText.includes('⚠️') ? 'fallback' : 'ollama',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function generateFallbackComparison(a, b) {
  const cheaper = a.price < b.price ? a.name : b.name;
  const priceDiff = Math.abs(a.price - b.price);
  return `⚠️ Локальная нейросеть (Ollama) не запущена. Вот базовое сравнение:

## Цена
- **${a.name}**: ${a.price} ₽
- **${b.name}**: ${b.price} ₽
- Разница: ${priceDiff} ₽
- Выгоднее: ${cheaper}

## Описание
**${a.name}**: ${a.description || '—'}

**${b.name}**: ${b.description || '—'}

## Рекомендация
Для точного сравнения запустите Ollama локально:
1. Установите: https://ollama.com
2. Скачайте модель: ollama pull qwen2.5:7b
3. Запустите: ollama run qwen2.5:7b`;
}

// ===== FILE UPLOAD =====
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Serve static client
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.0.104:${PORT}`);
  console.log(`  (Phone: open http://192.168.0.104:${PORT} in browser)`);
});
