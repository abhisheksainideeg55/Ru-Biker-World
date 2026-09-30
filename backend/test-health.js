const testHealth = async () => {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/health');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (e) {
    console.log('127.0.0.1 Error:', e.message);
  }
};
testHealth();
