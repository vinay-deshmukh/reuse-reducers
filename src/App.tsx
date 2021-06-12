import "./styles.css";
import React from "react";
import MultiCheck from "./multicheckbox/MultiCheck";
import { ItemId, PageActions, PageSelectors } from "./redux/pageOneSlice";
import { useAppSelector, useAppDispatch } from "./redux/hooks";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <FruitsList />
    </div>
  );
}

function FruitsList() {
  const dispatch = useAppDispatch();
  const allItems = useAppSelector(PageSelectors.selectAllFruits);
  const currentlySelectedIds = useAppSelector(
    PageSelectors.selectFruitsCurrentlySelectedIds
  );
  const isItemChecked = React.useCallback(
    (id: ItemId) => {
      return -1 !== currentlySelectedIds.findIndex((i) => i === id);
    },
    [currentlySelectedIds]
  );
  const onChangeOne = React.useCallback(
    (id: ItemId) => {
      dispatch(PageActions.fruits.ToggleOne(id));
    },
    [dispatch]
  );
  return (
    <div
      style={{
        border: "2px solid"
      }}
    >
      <p>Fruits</p>

      <MultiCheck
        allItems={allItems}
        onChangeOne={onChangeOne}
        isItemChecked={isItemChecked}
      />
    </div>
  );
}
