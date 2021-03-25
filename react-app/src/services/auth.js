export const authenticate = async() => {
  const response = await fetch('/api/auth/',{
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  console.log('\n\n_*_*_*GET DATA', data, '\n\n');
  return data;
}



