<template>
  <div class="min-h-screen bg-white pt-20">
    <!-- Hero -->
    <div class="bg-gray-50 py-16 mb-12">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h1 class="text-4xl font-bold text-black mb-4">О компании TechStore</h1>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
          TechStore — ваш надёжный партнёр в мире современной техники. Мы работаем с 2020 года и за это время помогли тысячам клиентов найти идеальные устройства для работы, учёбы и развлечений.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-5xl pb-16">
      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div class="text-3xl mb-3">🎯</div>
          <h3 class="text-lg font-semibold text-black mb-2">Наша миссия</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Сделать современную технику доступной каждому, предоставляя качественные устройства по справедливым ценам.</p>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div class="text-3xl mb-3">💡</div>
          <h3 class="text-lg font-semibold text-black mb-2">Почему мы</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Только проверенные бренды, официальная гарантия, быстрая доставка и профессиональная поддержка клиентов.</p>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div class="text-3xl mb-3">🚚</div>
          <h3 class="text-lg font-semibold text-black mb-2">Доставка</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Бесплатная доставка по всей России от 5000₽. Отправка в день заказа.</p>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div class="text-3xl mb-3">🔄</div>
          <h3 class="text-lg font-semibold text-black mb-2">Возврат</h3>
          <p class="text-gray-500 text-sm leading-relaxed">14 дней на возврат без объяснения причин. Гарантия до 2 лет на все товары.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="text-center p-6 border border-gray-200 rounded-xl">
          <p class="text-3xl font-bold mb-1">35+</p>
          <p class="text-sm text-gray-500">Товаров</p>
        </div>
        <div class="text-center p-6 border border-gray-200 rounded-xl">
          <p class="text-3xl font-bold mb-1">8</p>
          <p class="text-sm text-gray-500">Категорий</p>
        </div>
        <div class="text-center p-6 border border-gray-200 rounded-xl">
          <p class="text-3xl font-bold mb-1">5000+</p>
          <p class="text-sm text-gray-500">Клиентов</p>
        </div>
        <div class="text-center p-6 border border-gray-200 rounded-xl">
          <p class="text-3xl font-bold mb-1">99%</p>
          <p class="text-sm text-gray-500">Довольных</p>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="bg-black rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 class="text-2xl font-bold mb-2">Свяжитесь с нами</h2>
        <p class="text-gray-400 mb-8">Есть вопросы? Мы всегда на связи.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="mailto:info@techstore.ru" class="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
            📧 info@techstore.ru
          </a>
          <a href="tel:+78001234567" class="px-6 py-3 border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors">
            📞 +7 (800) 123-45-67
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
