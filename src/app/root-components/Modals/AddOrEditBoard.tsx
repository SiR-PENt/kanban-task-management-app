import { ModalBody, CRUDModal } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getAddBoardModalValue, closeAddBoardModal, getPageTitle, getAddOrEditBoardModalVariantValue } from "@/components/redux/features/modalSlice";
import React, {  useState } from "react";
import iconCross from '../../../../public/icon-cross.svg'
import Image from "next/image";
import Button from "./Button";

interface IColumn {
    name: string,
    id: string
}

interface IAddBoard {
   columns: IColumn[],
}

export default function AddBoard({ columns }: IAddBoard) {
    
    const modalVariant = useAppSelector(getAddOrEditBoardModalVariantValue) 
    const isVariantAdd = modalVariant === 'Add New Board'
    const [ boardName, setBoardName ] = useState<string>('');
    const [ boardColumns, setBoardColumns ] = useState<IColumn[]>(columns)
    const currentBoardTitle = useAppSelector(getPageTitle);

    const dispatch = useAppDispatch()

    const isModalOpen = useAppSelector(getAddBoardModalValue)

    const closeModal = () => dispatch(closeAddBoardModal()) 

    const handleChange = (id: string) => {
        return function (e: React.ChangeEvent<HTMLInputElement>) {
            const modifyActiveField: IColumn[] = boardColumns.map((column: {id: string, name: string}) => {
              if(column.id === id) {
                return { ...column, name: e.target.value }
              }
               return column
            }) 
            setBoardColumns(modifyActiveField)
        }
    }

    return (
        <CRUDModal isOpen={isModalOpen} onRequestClose={closeModal}>
            <ModalBody>
                <p>{modalVariant}</p>
                <div className='py-6'>
                    <div>
                        <label htmlFor="boardName">
                            Board Name
                        </label>
                        <div className="pt-2">
                        <input
                         id='boardName'
                         className="border border-medium-grey w-full p-2 rounded hover:border-main-purple cursor-pointer focus:outline-none focus:border-main-purple"
                         placeholder="e.g Web Design"
                         onChange={(e) => setBoardName(e.target.value)}
                         value={(isVariantAdd ? boardName:  currentBoardTitle)}
                         disabled={isVariantAdd ? false: true}/>               
                        </div>
                    </div>

                    <div className="pt-6">
                        <label htmlFor="">
                            Board Column
                        </label>
                        {
                            boardColumns.map((column: {name: string, id: string}) => {             
                            let { name, id } = column 
                            return (
                           <div key={id} className="pt-2 flex items-center space-x-2">
                           <input
                           className="border border-medium-grey focus:outline-none hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded"
                           placeholder="e.g Web Design"
                           onChange={(e) => handleChange(id)(e)}
                           value={name}
                           disabled={isVariantAdd ? false: true}/>               
                           <div>
                            <Image className='cursor-pointer' src={iconCross} alt='delete'/>
                          </div>
                          </div>
                                )
                            })
                        }
                        <div className='pt-3'>
                        <Button text='+ Add New Board'/>
                        </div>
                    </div>
                    <div className="pt-6">
                     <Button text='Create New Board'/>
                    </div>
                </div>
            </ModalBody>         
        </CRUDModal>
    )
}