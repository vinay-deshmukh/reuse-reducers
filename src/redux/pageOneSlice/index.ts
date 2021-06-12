import {
  createAction,
  createNextState,
  createReducer,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
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
  }
});

// export const { reducer } = slice;
export const reducer = reduceReducers(
  initialState,
  slice.reducer,
  createNextState((state, action) => {
    state.fruitsSub = subslices.fruitsSlice.reducer(state.fruitsSub, action);
    // state.other Slice for multi select
  })
);
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
/**
 * This is essentially just a call to
 * `createSlice` from toolkit.
 * Only "new" thing is that this could be looked as
 * a partially applied "createSlice", and the partial
 * application could be complete with the sliceName.
 *
 */
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
