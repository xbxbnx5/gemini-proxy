// api/proxy.js
export default async function handler(request, response) {
  // 1. Адрес API Google
  const targetApiHost = 'https://generativelanguage.googleapis.com';
  
  // 2. Получаем путь и параметры из входящего запроса
  const targetUrl = targetApiHost + request.url;

  // 3. Создаем новые заголовки и ЯВНО копируем ключ
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  // --- ВОТ ИСПРАВЛЕНИЕ ---
  // Мы берем ключ из заголовка 'x-goog-api-key', который прислал Python
  const apiKey = request.headers.get('x-goog-api-key');
  if (apiKey) {
    headers.set('x-goog-api-key', apiKey);
  }

  try {
    // 4. Отправляем запрос в Google с новыми заголовками
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers, // Используем наши новые, правильные заголовки
      body: request.body,
    });

    // 5. Получаем ответ от Google и пересылаем его обратно
    const data = await apiResponse.json();
    response.status(apiResponse.status).json(data);
    
  } catch (error) {
    response.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
