type Props = {
  name:     string;
  address?: string;
};

export default function BusinessInfo({ name, address }: Props) {
  return (
    <div className="text-center mb-8">
   
      <h1 className=" font-bold text-lg! text-gray-900">{name}</h1>
      {address && (
        <p className=" text-gray-600 mt-1">{address}</p>
      )}
    </div>
  );
}