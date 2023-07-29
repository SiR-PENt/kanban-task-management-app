import Modal, { ModalBody} from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getAddBoardModalValue, closeAddBoardModal } from "@/components/redux/features/modalSlice";

export default function AddBoard() {

    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(getAddBoardModalValue)

    const closeModal = () => dispatch(closeAddBoardModal()) 

    return (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
            <ModalBody>
                <p>Add New Board</p>
            </ModalBody>         
        </Modal>
    )
}