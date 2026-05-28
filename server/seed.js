const db = require('./db');

const categories = [
  { name: 'Смартфоны', slug: 'smartfony' },
  { name: 'Ноутбуки', slug: 'noutbuki' },
  { name: 'Наушники', slug: 'naushniki' },
  { name: 'Часы', slug: 'chasy' },
  { name: 'Планшеты', slug: 'planshety' },
  { name: 'Камеры', slug: 'kamery' },
  { name: 'Игровые приставки', slug: 'igrovye-pristavki' },
  { name: 'Аксессуары', slug: 'aksessuary' },
];

const products = [
  // Смартфоны
  { name: 'Apple iPhone 15 Pro', slug: 'iphone-15-pro', description: 'Флагманский смартфон Apple с титановым корпусом и процессором A17 Pro.', price: 119900, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', stock: 15, category_slug: 'smartfony' },
  { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: 'Мощный Android-смартфон с S-Pen и камерой 200 Мп.', price: 134990, image: 'https://images.unsplash.com/photo-1610945265078-3858a0b5d8f4?w=500&q=80', stock: 8, category_slug: 'smartfony' },
  { name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', description: 'Смартфон Google с лучшей камерой для фото.', price: 89990, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=500&q=80', stock: 12, category_slug: 'smartfony' },
  { name: 'Xiaomi Redmi Note 13', slug: 'xiaomi-redmi-note-13', description: 'Доступный смартфон с AMOLED-экраном 120 Гц.', price: 24990, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', stock: 25, category_slug: 'smartfony' },
  { name: 'OnePlus 12', slug: 'oneplus-12', description: 'Флагман с зарядкой 100W и экраном 2K.', price: 79990, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=500&q=80', stock: 10, category_slug: 'smartfony' },
  { name: 'Nothing Phone 2', slug: 'nothing-phone-2', description: 'Уникальный дизайн с LED-глифами на задней панели.', price: 54990, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', stock: 7, category_slug: 'smartfony' },
  
  // Ноутбуки
  { name: 'MacBook Air M3', slug: 'macbook-air-m3', description: 'Лёгкий ноутбук Apple на процессоре M3.', price: 139900, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', stock: 7, category_slug: 'noutbuki' },
  { name: 'ASUS ROG Zephyrus G14', slug: 'asus-rog-zephyrus-g14', description: 'Игровой ноутбук с RTX 4070.', price: 169990, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', stock: 5, category_slug: 'noutbuki' },
  { name: 'Lenovo ThinkPad X1 Carbon', slug: 'lenovo-thinkpad-x1-carbon', description: 'Бизнес-ноутбук премиум-класса.', price: 185000, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80', stock: 4, category_slug: 'noutbuki' },
  { name: 'HP Spectre x360', slug: 'hp-spectre-x360', description: 'Трансформер с OLED-экраном и стилусом.', price: 129990, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', stock: 6, category_slug: 'noutbuki' },
  { name: 'Dell XPS 15', slug: 'dell-xps-15', description: 'Премиальный ноутбук с безрамочным экраном.', price: 159990, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80', stock: 8, category_slug: 'noutbuki' },
  
  // Наушники
  { name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'Беспроводные наушники с лучшим шумоподавлением.', price: 34990, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80', stock: 18, category_slug: 'naushniki' },
  { name: 'AirPods Pro 2', slug: 'airpods-pro-2', description: 'Наушники Apple с активным шумоподавлением.', price: 24990, image: 'https://images.unsplash.com/photo-1603351154351-5cfb3d04ef32?w=500&q=80', stock: 20, category_slug: 'naushniki' },
  { name: 'Sennheiser Momentum 4', slug: 'sennheiser-momentum-4', description: 'Аудиофильские наушники с 60 часами работы.', price: 39990, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80', stock: 9, category_slug: 'naushniki' },
  { name: 'JBL Tour One M2', slug: 'jbl-tour-one-m2', description: 'Наушники с адаптивным шумоподавлением.', price: 19990, image: 'https://images.unsplash.com/photo-1603351154351-5cfb3d04ef32?w=500&q=80', stock: 14, category_slug: 'naushniki' },
  
  // Часы
  { name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', description: 'Умные часы с мониторингом здоровья.', price: 27990, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80', stock: 10, category_slug: 'chasy' },
  { name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', description: 'Умные часы Apple с датчиком кислорода.', price: 41990, image: 'https://images.unsplash.com/photo-1434494878577-86c23d8a5e38?w=500&q=80', stock: 9, category_slug: 'chasy' },
  { name: 'Xiaomi Mi Smart Band 8', slug: 'xiaomi-mi-smart-band-8', description: 'Фитнес-браслет с AMOLED-экраном.', price: 4990, image: 'https://images.unsplash.com/photo-1557825835-b85cd466b5de?w=500&q=80', stock: 30, category_slug: 'chasy' },
  { name: 'Garmin Fenix 7', slug: 'garmin-fenix-7', description: 'Премиальные спортивные часы с GPS.', price: 69990, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80', stock: 5, category_slug: 'chasy' },
  
  // Планшеты
  { name: 'iPad Pro 12.9 M2', slug: 'ipad-pro-129-m2', description: 'Профессиональный планшет с чипом M2.', price: 109990, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', stock: 8, category_slug: 'planshety' },
  { name: 'Samsung Galaxy Tab S9 Ultra', slug: 'samsung-galaxy-tab-s9-ultra', description: '14.6 дюймовый планшет с AMOLED.', price: 99990, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', stock: 6, category_slug: 'planshety' },
  { name: 'Xiaomi Pad 6', slug: 'xiaomi-pad-6', description: 'Доступный планшет с экраном 144 Гц.', price: 29990, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', stock: 12, category_slug: 'planshety' },
  
  // Камеры
  { name: 'Sony A7 IV', slug: 'sony-a7-iv', description: 'Полнокадровая беззеркальная камера.', price: 189990, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', stock: 4, category_slug: 'kamery' },
  { name: 'Canon EOS R6', slug: 'canon-eos-r6', description: 'Профессиональная камера для видео.', price: 169990, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', stock: 5, category_slug: 'kamery' },
  { name: 'Fujifilm X-T5', slug: 'fujifilm-xt5', description: 'Камера с уникальными цветовыми профилями.', price: 139990, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', stock: 7, category_slug: 'kamery' },
  { name: 'GoPro Hero 12', slug: 'gopro-hero-12', description: 'Экшн-камера для экстремальных съёмок.', price: 44990, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', stock: 15, category_slug: 'kamery' },
  
  // Игровые приставки
  { name: 'PlayStation 5', slug: 'playstation-5', description: 'Игровая консоль нового поколения.', price: 54990, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', stock: 10, category_slug: 'igrovye-pristavki' },
  { name: 'Xbox Series X', slug: 'xbox-series-x', description: 'Самая мощная Xbox в истории.', price: 49990, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', stock: 8, category_slug: 'igrovye-pristavki' },
  { name: 'Nintendo Switch OLED', slug: 'nintendo-switch-oled', description: 'Портативная консоль с OLED-экраном.', price: 29990, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', stock: 20, category_slug: 'igrovye-pristavki' },
  { name: 'Steam Deck OLED', slug: 'steam-deck-oled', description: 'Портативный игровой ПК от Valve.', price: 59990, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', stock: 6, category_slug: 'igrovye-pristavki' },
  
  // Аксессуары
  { name: 'Anker PowerCore 26800', slug: 'anker-powercore-26800', description: 'Внешний аккумулятор на 26800 мАч.', price: 4990, image: 'https://images.unsplash.com/photo-1609592424303-65f5b5b5b5b5?w=500&q=80', stock: 50, category_slug: 'aksessuary' },
  { name: 'Logitech MX Master 3S', slug: 'logitech-mx-master-3s', description: 'Эргономичная мышь для профессионалов.', price: 9990, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', stock: 25, category_slug: 'aksessuary' },
  { name: 'Keychron K8 Pro', slug: 'keychron-k8-pro', description: 'Механическая клавиатура с Bluetooth.', price: 12990, image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80', stock: 18, category_slug: 'aksessuary' },
  { name: 'Belkin MagSafe 3-in-1', slug: 'belkin-magsafe-3in1', description: 'Зарядная станция для iPhone, Watch, AirPods.', price: 14990, image: 'https://images.unsplash.com/photo-1609592424303-65f5b5b5b5b5?w=500&q=80', stock: 22, category_slug: 'aksessuary' },
  { name: 'Samsung T7 Shield 1TB', slug: 'samsung-t7-shield-1tb', description: 'Портативный SSD с защитой от ударов.', price: 8990, image: 'https://images.unsplash.com/photo-1609592424303-65f5b5b5b5b5?w=500&q=80', stock: 35, category_slug: 'aksessuary' },
];

async function run() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Clear existing products and categories
        db.run('DELETE FROM products');
        db.run('DELETE FROM categories');

        for (const cat of categories) {
          await new Promise((res, rej) => {
            db.run(
              'INSERT INTO categories (name, slug) VALUES (?, ?)',
              [cat.name, cat.slug],
              (err) => (err ? rej(err) : res())
            );
          });
        }

        const catMap = {};
        for (const cat of categories) {
          const row = await new Promise((res, rej) => {
            db.get('SELECT id FROM categories WHERE slug = ?', [cat.slug], (err, row) => {
              err ? rej(err) : res(row);
            });
          });
          catMap[cat.slug] = row.id;
        }

        for (const p of products) {
          await new Promise((res, rej) => {
            db.run(
              'INSERT INTO products (name, slug, description, price, image, stock, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [p.name, p.slug, p.description, p.price, p.image, p.stock, catMap[p.category_slug]],
              (err) => (err ? rej(err) : res())
            );
          });
        }

        console.log('Database seeded successfully!');
        console.log(`Categories: ${categories.length}`);
        console.log(`Products: ${products.length}`);

        resolve();
      } catch (e) {
        console.error('Seed error:', e.message);
        reject(e);
      } finally {
        db.close();
      }
    });
  });
}

run();
