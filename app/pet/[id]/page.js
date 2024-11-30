import pets from "../../data/pets";
import Image from "next/image";

export default function PetDetail({ params }) {
  const petId = parseInt(params.id, 10);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    return <div>ペットが見つかりません。</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">{pet.name}</h1>
      <Image
        src={pet.photo}
        alt={`${pet.name}の写真`}
        width={300}
        height={300}
        className="rounded-lg"
      />
      <p className="text-lg mt-4">種類: {pet.species}</p>
      <p className="text-lg">年齢: {pet.age}歳</p>
      <p className="text-lg mt-4">{pet.description}</p>
    </div>
  );
}