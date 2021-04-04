import React from 'react';
import styles from './Modal.module.scss';

function Modal({title, children, onClose, ...props}) {

  return <>
      <div className={styles["modal-bg"]}>
      </div>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modal_body} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
}

export default Modal;