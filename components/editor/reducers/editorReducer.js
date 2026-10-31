export const initialEditorState = {
  activeTool: "select",
  selectedObjectId: null,
  objects: [],
};

export function editorReducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_TOOL":
      return {
        ...state,
        activeTool: action.payload,
        selectedObjectId: null,
      };

    case "ADD_OBJECT":
      return {
        ...state,
        objects: [...state.objects, action.payload],
        selectedObjectId: action.payload.id,
      };

    case "SELECT_OBJECT":
      return {
        ...state,
        selectedObjectId: action.payload,
      };

    case "UPDATE_OBJECT":
      return {
        ...state,
        objects: state.objects.map((object) =>
          object.id === action.payload.id
            ? { ...object, ...action.payload.changes }
            : object,
        ),
      };

    case "DELETE_OBJECT":
      return {
        ...state,
        objects: state.objects.filter((object) => object.id !== action.payload),
        selectedObjectId:
          state.selectedObjectId === action.payload
            ? null
            : state.selectedObjectId,
      };

    case "RESET_EDITOR":
      return {
        ...initialEditorState,
      };

    default:
      return state;
  }
}
