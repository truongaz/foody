function render() {
  document.getElementById('announce').style.display = 'none';
  document.getElementById('q').style.display = 'none';
}
setTimeout(render, (Date.now()+300000 - Date.now()));