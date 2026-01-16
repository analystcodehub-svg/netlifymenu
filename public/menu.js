// Injects a shared nav menu into the top of the document and wires auth controls
import { signInWithGoogle, signOutUser, onAuthChange } from './firebase-client.js';

function createNav() {
  const nav = document.createElement('nav');
  nav.style.display = 'flex';
  nav.style.justifyContent = 'space-between';
  nav.style.alignItems = 'center';
  nav.style.marginBottom = '1rem';

  const left = document.createElement('div');
  left.innerHTML = '<a href="/">Home</a> <a href="/protected.html" style="margin-left:1rem">Protected</a>';

  const right = document.createElement('div');
  right.style.position = 'relative';
  right.innerHTML = `
    <button id="authToggle">Account ▾</button>
    <div id="authDropdown" style="position:absolute;right:0;top:36px;background:#fff;border:1px solid #ddd;padding:8px;display:none;border-radius:6px;min-width:160px">
      <div id="authInfo" style="margin-bottom:8px;display:none">
        <div id="navUserName" style="font-weight:600"></div>
        <img id="navUserPhoto" style="width:36px;height:36px;border-radius:50%;margin-top:6px" />
      </div>
      <button id="navSignIn">Sign in with Google</button>
      <button id="navSignOut" style="display:none;margin-top:6px">Sign out</button>
    </div>`;

  nav.appendChild(left);
  nav.appendChild(right);
  return nav;
}

function wireNavHandlers(root = document) {
  const authToggle = document.getElementById('authToggle');
  const authDropdown = document.getElementById('authDropdown');
  const navSignIn = document.getElementById('navSignIn');
  const navSignOut = document.getElementById('navSignOut');
  const authInfo = document.getElementById('authInfo');
  const navUserName = document.getElementById('navUserName');
  const navUserPhoto = document.getElementById('navUserPhoto');

  if (!authToggle) return; // nothing to wire

  authToggle.addEventListener('click', () => {
    authDropdown.style.display = authDropdown.style.display === 'block' ? 'none' : 'block';
  });

  navSignIn.addEventListener('click', async () => {
    try {
      await signInWithGoogle('/protected.html');
    } catch (e) {
      alert('Sign-in failed');
    }
  });

  navSignOut.addEventListener('click', async () => {
    await signOutUser();
    authDropdown.style.display = 'none';
    // If on protected page, redirect to home
    if (window.location.pathname.endsWith('/protected.html')) window.location.href = '/';
  });

  onAuthChange(user => {
    if (user) {
      navSignIn.style.display = 'none';
      navSignOut.style.display = 'block';
      authInfo.style.display = 'block';
      navUserName.textContent = user.displayName || user.email;
      navUserPhoto.src = user.photoURL || '';
    } else {
      navSignIn.style.display = 'block';
      navSignOut.style.display = 'none';
      authInfo.style.display = 'none';
      navUserName.textContent = '';
      navUserPhoto.src = '';
    }
  });
}

// Insert nav at top of body
document.addEventListener('DOMContentLoaded', () => {
  const nav = createNav();
  document.body.insertBefore(nav, document.body.firstChild);
  wireNavHandlers(document);
});
