import ReactModal from 'react-modal';
import { useState } from 'react';

interface ModalProps {
    children?: React.ReactNode,
    isOpen: boolean,
    onRequestClose: () => void,
}
  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  ReactModal.setAppElement('*');
  
  export default function Modal({ children, isOpen, onRequestClose}: ModalProps) {
  

    const modalStyle = {
        overlay: {
          zIndex: "900000",
          backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      };
      
  
    return (

        <ReactModal
        onRequestClose={onRequestClose}
        isOpen={isOpen}
          style={modalStyle}>
          {children}
        </ReactModal>
    );
  }