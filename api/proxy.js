// api/proxy.js
export default async function handler(request, response) {
  // 1. Адрес API Google
  const targetApiHost = 'https://generativelanguage.googleapis.com';
  const targetUrl = targetApiHost + request.url;

  // 2. Создаем новые заголовки для Google
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // 3. ЯВНО ИЩЕМ И КОПИРУЕМ КЛЮЧ ИЗ ВХОДЯЩЕГО ЗАПРОСА
  const apiKey = request.headers.get('x-goog-api-key');

  // 4. ПРОВЕРЯЕМ, ЧТО КЛЮЧ ПРИШЕЛ
  if (!apiKey) {
    // Если Python не прислал ключ, возвращаем ошибку
    return response.status(401).json({ error: 'API key is missing in the proxy request.' });
  }
  
  // 5. ДОБАВЛЯЕМ КЛЮЧ В ЗАГОЛОВКИ ДЛЯ GOOGLE
  headers.set('x-goog-api-key', apiKey);

  try {
    // 6. Отправляем запрос в Google с правильными заголовками
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers, // Используем наши новые, правильные заголовки
      body: request.body,
    });

    // 7. Пересылаем ответ от Google обратно
    const data = await apiResponse.json();
    response.status(apiResponse.status).json(data);
    
  } catch (error) {
    response.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
