const CollectiosSelectedChange = ({ collections, selectedCollection, setSelectedCollection }) => {
  return (
    <div>
      {collections.map(collection => (
        <label key={collection.id} className="flex cursor-pointer items-center rounded p-2 hover:bg-gray-50">
          <input
            type="radio"
            name="collection"
            value={collection.id.toString()}
            checked={selectedCollection === collection.id}
            onChange={() => setSelectedCollection(collection.id)}
            className="h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-sm">{collection.name}</span>
        </label>
      ))}
    </div>
  );
};
export default CollectiosSelectedChange;
