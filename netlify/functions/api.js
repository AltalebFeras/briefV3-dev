exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const apiUrl = `http://193.134.250.16/api${path}`;

  try {
    const response = await fetch(apiUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
