// api/proxy.js
export default async function handler(request, response) {
  // 1. Адрес API Google
  const targetApiHost = 'https://generativelanguage.googleapis.com';
  
  // 2. Получаем путь и параметры из входящего запроса
  // request.url будет содержать что-то вроде /v1beta/models/...
  const targetUrl = targetApiHost + request.url;

  try {
    // 3. Отправляем запрос в Google, копируя все данные
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type'),
        'x-goog-api-key': request.headers.get('x-goog-api-key'),
      },
      body: request.body,
    });

    // 4. Получаем ответ от Google и пересылаем его обратно вашему боту
    const data = await apiResponse.json();
    response.status(apiResponse.status).json(data);
    
  } catch (error) {
    // В случае ошибки, возвращаем ее
    response.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
