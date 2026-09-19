document.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>{
  try {sessionStorage.setItem('mindbridge-demo-role',button.dataset.role);location.assign('workspace.html');}
  catch {button.textContent='Enable browser session storage to run this demo.';}
}));
