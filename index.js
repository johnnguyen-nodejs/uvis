const http = require('http');
const WebSocket = require('ws');

// Tạo HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running\n');
});

// Tạo WebSocket server gắn với HTTP server
const wss = new WebSocket.Server({ server });

// Lắng nghe kết nối từ client
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Gửi tín hiệu test định kỳ mỗi 5 giây
  let t = 1643205476
    let close = 10 + Math.random()
    let markers = []
  const interval = setInterval(() => {
    t += 86400
    let newClose = 10 + Math.random()
    if(Math.round(Math.random()) == 1){
        markers.push({
            time: t,
            position: markers.length%2 == 0? 'aboveBar': 'belowBar',
            color: markers.length%2 == 0? '#f68410': '#f6341b',
            shape: markers.length%2 == 0? 'arrowUp': 'arrowDown',
            text: markers.length%2 == 0? 'Buy ' + newClose.toFixed(2): 'Sell ' + newClose.toFixed(2),
            size: 0.5
        })
    }
    ws.send(JSON.stringify({ 
        candle: { open: close, high: 12 + Math.random(), low: 8 + Math.random(), close: newClose, time: t},
        line1: { time: t, value: Math.floor(Math.random()*30 + 20) + Math.random()},
        line2: { time: t, value: Math.floor(Math.random()*30 + 20) + Math.random()},
        line3: { time: t, value: Math.floor(Math.random()*30 + 20) + Math.random()},
        line4: { time: t, value: Math.floor(Math.random()*30 + 20) + Math.random()},
        line5: { time: t, value: Math.floor(Math.random()*30 + 20) + Math.random()},
        markers
     }));
    close = newClose
  }, 1000);

  // Xử lý khi nhận được tin nhắn từ client
  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
  });

  // Xử lý khi kết nối bị đóng
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// Khởi chạy server trên cổng 8080
server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});