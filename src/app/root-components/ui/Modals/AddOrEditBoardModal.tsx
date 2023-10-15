'use client'

import { ModalBody, CRUDModal } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import { getAddBoardModalValue, closeAddBoardModal, getPageTitle, 
    getAddOrEditBoardModalVariantValue } from "@/components/redux/features/modalSlice";
import { useFetchDataFromDbQuery, useAddNewBoardToDbMutation } from "@/components/redux/services/apiSlice";
import React, { useState } from "react";
import iconCross from '../../../../../public/icon-cross.svg'
import Image from "next/image";
import Button from "../Button";
import { v4 as uuidv4 } from 'uuid'


let addBoardData = {
    name: '',
    columns: [
        {
            name: 'Todo',
            id: uuidv4(),        
        },
        {
            name: 'Doing',
            id: uuidv4(),
        },
    ]
}


export default function AddOrEditBoardModal() {

    let { data } = useFetchDataFromDbQuery();
    const [ boardData, setBoardData ] = useState(addBoardData)
    const modalVariant = useAppSelector(getAddOrEditBoardModalVariantValue) 
    const isVariantAdd = modalVariant === 'Add New Board'
    const currentBoardTitle = useAppSelector(getPageTitle);
    const [ addNewBoardToDb ] = useAddNewBoardToDbMutation()
    const dispatch = useAppDispatch()

    const isModalOpen = useAppSelector(getAddBoardModalValue)

    const closeModal = () => dispatch(closeAddBoardModal()) 

    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = {...boardData, name: e.target.value}
        setBoardData(newName)
    }

    const handleColumnChange = (id: string) => { 
        return function (e: React.ChangeEvent<HTMLInputElement>) {
            // handle change for create new board modal
            // if(isVariantAdd) {}
            const modifyColumns = boardData.columns.map((column: {id: string, name: string}) => {
              if(column.id === id) {
                return { ...column, name: e.target.value }
              }
               return column
            })
            const modifiedColumn = {...boardData, columns: modifyColumns }
            setBoardData(modifiedColumn)
        }
    }

    const handleAddNewBoard = () => {
            const newBoard = { name: '', id: uuidv4() };
            boardData.columns.push(newBoard);
            console.log(boardData)
            setBoardData({ ...boardData, columns: boardData.columns });  
    }

    const handleDeleteColumn = (activeId: string) => {
        const filteredColumns = boardData.columns.filter((column) => column.id !== activeId)
        setBoardData({ ...boardData, columns: filteredColumns });  
    }

    const handleAddNewBoardToDb = () => {
        const emptyStringChecker = boardData.columns.some(column => column.name === '') //check if any of the column names is empty
        if(boardData.name !== '' && !emptyStringChecker ){ //verify that the board name and none of the column names are empty
            if(data){
                let [ boards ] = data;
                console.log('first', boards)
                const addBoard = [...boards.boards, boardData]
                boards = addBoard 
                console.log('second', boards)
                addNewBoardToDb(boards)
            }
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
                         className="borderborder-medium-grey w-full p-2 rounded text-sm hover:border-main-purple cursor-pointer focus:outline-none focus:border-main-purple"
                         placeholder="e.g Web Design"
                         onChange={handleBoardNameChange}
                         value={(isVariantAdd ? boardData.name:  currentBoardTitle)}/>               
                        </div>
                    </div>

                    <div className="pt-6">
                        <label htmlFor="">
                            Board Column
                        </label>
                        {
                            boardData.columns.map((column: {name: string, id: string}) => {             
                            let { name, id } = column 
                            return (
                             <div key={id} className="pt-2 flex items-center space-x-2">
                             <input
                            className="border border-medium-grey focus:outline-none text-sm hover:border-main-purple cursor-pointer focus:border-main-purple w-full p-2 rounded"
                            placeholder="e.g Done"
                            onChange={(e) => handleColumnChange(id)(e)}
                            value={name}/>               
                           <div onClick={() => handleDeleteColumn(id)}>
                            <Image className='cursor-pointer' src={iconCross} alt='delete'/>
                          </div>
                          </div>
                            )})
                        }
                        <div className='pt-3'>
                        <Button onClick={handleAddNewBoard} intent='primary' text={isVariantAdd ? '+ Add New Board': '+ Add New Column'}/>
                        </div>
                    </div>
                    <div className="pt-6">
                     <Button onClick={handleAddNewBoardToDb} intent='secondary' text={isVariantAdd ? 'Create New Board': 'Save Changes'}/>
                    </div>
                </div>
            </ModalBody>         
        </CRUDModal>
    )
}