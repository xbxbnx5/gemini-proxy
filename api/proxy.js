// api/proxy.js
export default async function handler(request, response) {
  // --- КЛЮЧ ВШИТ ПРЯМО СЮДА ---
  const GEMINI_API_KEY = "AIzaSyDW62m3ZGDBTyLWISfLbWPIMiFVCLOJi44"; // <-- ВСТАВЬТЕ СЮДА ВАШ КЛЮЧ GEMINI
  
  // 1. Адрес API Google. Теперь мы добавляем ключ прямо в URL, как в самом начале.
  const targetApiHost = `https://generativelanguage.googleapis.com`;
  const targetUrl = targetApiHost + request.url + `?key=${GEMINI_API_KEY}`;

  try {
    // 2. Отправляем запрос в Google, копируя только метод и тело. Заголовки нам больше не нужны.
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body,
    });

    // 3. Получаем ответ от Google и пересылаем его обратно
    const data = await apiResponse.json();
    response.status(apiResponse.status).json(data);
    
  } catch (error) {
    response.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
