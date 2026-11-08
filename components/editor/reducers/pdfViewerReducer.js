export const initialPdfViewerState = {
  currentPage: 1,
  totalPages: 0,
  zoom: 100,
  fitMode: "width",
};

export function pdfViewerReducer(state, action) {
  switch (action.type) {
    case "SET_TOTAL_PAGES":
      return {
        ...state,
        totalPages: action.payload,
        currentPage: Math.min(
          Math.max(state.currentPage, 1),
          Math.max(action.payload, 1),
        ),
      };

    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage:
          state.totalPages > 0
            ? Math.min(Math.max(action.payload, 1), state.totalPages)
            : Math.max(action.payload, 1),
      };

    case "NEXT_PAGE":
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, state.totalPages),
      };

    case "PREVIOUS_PAGE":
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };

    case "ZOOM_IN":
      return {
        ...state,
        zoom: Math.min(state.zoom + 10, 200),
        fitMode: "custom",
      };

    case "ZOOM_OUT":
      return {
        ...state,
        zoom: Math.max(state.zoom - 10, 50),
        fitMode: "custom",
      };

    case "SET_ZOOM":
      return {
        ...state,
        zoom: action.payload,
        fitMode: "custom",
      };

    case "SET_FIT_MODE":
      return {
        ...state,
        fitMode: action.payload,
      };

    case "RESET_VIEWER":
      return { ...initialPdfViewerState };

    default:
      return state;
  }
}
