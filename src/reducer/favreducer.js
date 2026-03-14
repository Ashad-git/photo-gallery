

export const favReducer = (state, action) => {
    switch(action.type) {
        case "TOGGLE_FAV":
            const exists = state.find((img) => img.id === action.payload.id)

            if(exists) {
                return state.filter((img) => img.id !== action.payload.id)
            } 
              return [...state, action.payload]
            
        case "SET_FAV":
            return action.payload

            default: 
                return state
    }
}