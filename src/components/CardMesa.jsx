import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function cardMesa() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Abrir carta
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mi carta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Aquí va el contenido que quieras mostrar superpuesto 🚀
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default cardMesa;
