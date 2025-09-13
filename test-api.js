const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    // Test GET request
    console.log('Testing GET /api/blog');
    const getResponse = await fetch('http://localhost:3000/api/blog');
    console.log('GET Status:', getResponse.status);
    
    // Test POST request
    console.log('\nTesting POST /api/blog');
    const postData = {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      content: 'Test content',
      date: '2025-09-12',
      tags: ['test'],
      imageUrl: '',
      linkUrl: ''
    };
    
    const postResponse = await fetch('http://localhost:3000/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    
    console.log('POST Status:', postResponse.status);
    const postResult = await postResponse.json();
    console.log('POST Result:', postResult);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();