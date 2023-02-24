const ngrok = require('ngrok');

(async function() {
  const url = await ngrok.connect({
    addr: 3000,
    authtoken: '2M5QKDHh74F208YcQBS6bWmpsYP_4BmC81qJ2YgLNcB9wDepR',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });

  console.log(`Ngrok URL: ${url}`);
})();