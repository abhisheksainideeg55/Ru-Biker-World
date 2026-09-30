const testCreateProductAPI = async () => {
  try {
    console.log('[Test] Sending POST http://127.0.0.1:5000/api/admin/products via fetch...');
    const dummyBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const payload = {
      name: 'Test Mobile Vibration Damper 2026',
      category: 'Accessories & Touring',
      subcategory: 'Mobile Mounts & USB Fast Chargers',
      price: 399,
      originalPrice: 799,
      brand: 'RU BIKER world Genuine Parts',
      image: dummyBase64,
      images: [dummyBase64],
      description: 'Test product for vibration dampening',
    };

    const res = await fetch('http://127.0.0.1:5000/api/admin/products', {
      method: 'POST',
      headers: {
        'x-admin-dev-access': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('[Test API Status]:', res.status);
    console.log('[Test API Response]:', JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('[Test API Error]:', err.message);
    process.exit(1);
  }
};

testCreateProductAPI();
