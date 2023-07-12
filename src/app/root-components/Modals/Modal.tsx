import ReactModal from 'react-modal';
import { useTheme } from "next-themes";

interface ModalProps {
    children?: React.ReactNode,
    isOpen: boolean,
    onRequestClose: () => void,
}
  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  ReactModal.setAppElement('*');
  
  export default function Modal({ children, isOpen, onRequestClose}: ModalProps) {
  
     const { theme, } = useTheme()

    const modalStyle = {
        overlay: {
          zIndex: "900000",
          backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          top: '14.5rem',
          left: '47%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '0px',
          borderRadius: '.5rem',
          width:'16.5rem',
          backgroundColor: (theme === 'light') ? '#fff' : '#2B2C37',
          border: 'none'
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