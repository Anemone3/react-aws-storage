function AddCollectionCard({ openModal }) {
  return (
    <div
      onClick={openModal}
      className="bg-primary text-secondary flex h-[256px] max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg font-semibold shadow-md md:text-2xl"
    >
      <span className="text-[56px] font-light">+</span>
      <h3>Add new Collection</h3>
    </div>
  );
}
export default AddCollectionCard;
