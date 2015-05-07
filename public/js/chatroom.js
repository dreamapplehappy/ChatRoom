var socket = io.connect('http://localhost');
socket.on('hello', function(data){
  console.log(data);
  alert(data.toString());
});