import { Item, ItemId } from "../redux/pageOneSlice";

interface Props {
  allItems: Item[];
  onChangeOne: (id: ItemId) => unknown;
  isItemChecked: (id: ItemId) => boolean;
}

export default function MultiCheck({
  allItems,
  onChangeOne,
  isItemChecked
}: Props) {
  return (
    <div>
      {allItems.map((item) => {
        return (
          <label key={item.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={isItemChecked(item.id)}
              onChange={() => onChangeOne(item.id)}
            />
            {item.text}
          </label>
        );
      })}
    </div>
  );
}
