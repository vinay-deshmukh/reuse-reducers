import {
  createAction,
  createReducer,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "../store";

import { fruits, vegetables, meats } from "./mockData";
const SLICE_NAME = "pageOne";
function prependSliceName(actionType) {
  return `${SLICE_NAME}/${actionType}`;
}

export interface SimpleItem {
  id: string;
  text: string;
}

interface State {
  // fruits: SimpleItem[];
  // vegetables: SimpleItem[];
  // meats: SimpleItem[];
  fruitsSub: SubSliceState;
  vegetablesSub: SubSliceState;
  unrelatedObj: Record<"a" | "b", number>;
}

function createSubSliceFromSimpleItemArr(arr: SimpleItem[]): SubSliceState {
  return {
    allItems: arr,
    searchStr: "",
    currentlySelectedId: arr.map(({ id }) => id)
  };
}

const initialState: State = {
  fruitsSub: createSubSliceFromSimpleItemArr([]),
  vegetablesSub: createSubSliceFromSimpleItemArr([]),
  // meats: meats,
  unrelatedObj: { a: 1, b: 3 }
};

export const loadData = createAction(prependSliceName("loadData"));

type FieldsForCheckbox = "fruits" | "vegetables" | "meats";

/**
 * This object contains the "code" for a subslice.
 *
 * The Values contains {actions, reducer}
 *
 * The actual "data" is store in `initialState`,
 * so that the slice can update the data
 * for e.g., after a fetch
 */
const subslices = {
  fruitsSlice: createSubSlice({
    actionNamePrefix: "fruitsSub",
    initialState: initialState.fruitsSub
  })
};

const slice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadData.type, (state) => {
      state.fruitsSub = createSubSliceFromSimpleItemArr(fruits);
      state.vegetablesSub = createSubSliceFromSimpleItemArr(vegetables);
    });

    builder.addMatcher(
      // run the other reducers regardles of whether
      // this slice's actions are fired or not
      () => true,
      (state, action) => {
        state.fruitsSub = subslices.fruitsSlice.reducer(
          state.fruitsSub,
          action
        );
      }
    );

    // for (const [key, value] of Object.entries(subslices)) {
    //   const reducer = value.reducer;
    //   const actions = value.actions;

    //   for (const oneAct of Object.values(actions)) {
    //     builder.addCase(oneAct, reducer);
    //   }
    // }
  }
});
// const slice = {
//   reducer: function (state: State = initialState, action) {
//     return state;
//   }

//createReducer(initialState,builder => 0)
// };

export const { reducer } = slice;
const selectSlice = (state: RootState) => state.pageOne;
export const PageSelectors = {
  selectAllFruits: (state: RootState) => selectSlice(state).fruitsSub.allItems,
  selectFruitsCurrentlySelectedIds: (state: RootState) =>
    selectSlice(state).fruitsSub.currentlySelectedId
};

export const PageActions = {
  fruits: subslices.fruitsSlice.actions
};

export type Item = {
  id: string;
  text: string;
};
export type ItemId = Item["id"];

interface SubSliceState {
  allItems: Item[];
  currentlySelectedId: ItemId[];
  searchStr: string;
}
interface SubSliceArgs {
  initialState: SubSliceState;
  actionNamePrefix: string;
}
function createSubSlice({ actionNamePrefix, initialState }: SubSliceArgs) {
  const actions = {
    ToggleOne: createAction(actionNamePrefix + "/toggleOne", function (
      id: string
    ) {
      return {
        payload: {
          id
        }
      };
    })
  };
  const reducer = createReducer(initialState, (builder) =>
    builder.addCase(
      actions.ToggleOne,
      (state, action: PayloadAction<{ id: string }>) => {
        const { id } = action.payload;
        const index = state.currentlySelectedId.findIndex((i) => i === id);
        if (index !== -1) {
          state.currentlySelectedId.splice(index, 1);
        } else {
          state.currentlySelectedId.push(id);
        }
      }
    )
  );

  return { actions, reducer };
}
