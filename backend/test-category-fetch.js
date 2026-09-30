const testFetchProducts = async () => {
  try {
    const urls = [
      'http://127.0.0.1:5000/api/products?category=accessories',
      'http://127.0.0.1:5000/api/products?category=accessories-and-touring',
      'http://127.0.0.1:5000/api/products?category=mobile-holder',
      'http://127.0.0.1:5000/api/products?category=Accessories%20%26%20Touring',
    ];

    for (const url of urls) {
      const res = await fetch(url);
      const data = await res.json();
      console.log(`\nURL: ${url}`);
      console.log(`Success: ${data.success}, Count: ${data.products?.length || data.data?.length || 0}`);
      if (data.products && data.products.length > 0) {
        console.log('Sample Product Name:', data.products[0].name);
        console.log('Sample Product Category:', data.products[0].category);
      }
    }
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
};

testFetchProducts();
