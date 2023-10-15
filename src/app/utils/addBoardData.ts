import { v4 as uuidv4 } from 'uuid'

export const addBoardData = [{
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
}]