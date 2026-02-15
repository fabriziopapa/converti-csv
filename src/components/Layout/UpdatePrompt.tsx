import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * UpdatePrompt - Mostra un toast quando è disponibile un aggiornamento dell'app
 *
 * Utilizza il Service Worker per rilevare nuove versioni e permette
 * all'utente di aggiornare immediatamente l'applicazione.
 */
export function UpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Controlla aggiornamenti ogni ora
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000); // 60 minuti
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={showUpdatePrompt}
        onClose={handleClose}
        bg="primary"
        className="text-white"
      >
        <Toast.Header closeButton={false}>
          <svg
            width="20"
            height="20"
            className="me-2 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          <strong className="me-auto">Aggiornamento Disponibile</strong>
        </Toast.Header>
        <Toast.Body className="d-flex flex-column gap-2">
          <p className="mb-2">
            È disponibile una nuova versione dell'applicazione!
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="light"
              size="sm"
              onClick={handleClose}
            >
              Dopo
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleUpdate}
            >
              Aggiorna Ora
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
