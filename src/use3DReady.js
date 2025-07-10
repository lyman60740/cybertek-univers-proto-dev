import { useEffect, useState } from "react";

export function use3DReady() {
  const [ready, setReady] = useState(() => localStorage.getItem('3d_ready') === '1');

  useEffect(() => {
    // Check régulièrement, car l'event storage ne se déclenche pas dans le même onglet
    const interval = setInterval(() => {
      if (localStorage.getItem('3d_ready') === '1') setReady(true);
    }, 200);

    // Reste sur la logique event storage pour cross-tab
    function checkStorage(e) {
      if (e.key === '3d_ready' && e.newValue === '1') setReady(true);
    }
    window.addEventListener('storage', checkStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkStorage);
    };
  }, []);

  return ready;
}
