import pets from "../data/pets";
import Image from "next/image";
import Link from "next/link";

export default function PetsList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pets.map((pet) => (
        <Link key={pet.id} href={`/pet/${pet.id}`}>
          <div className="p-4 border rounded-lg hover:shadow-lg cursor-pointer">
            <Image
              src={pet.photo}
              alt={`${pet.name}の写真`}
              width={300}
              height={300}
              className="rounded-lg"
            />
            <h2 className="text-xl font-bold mt-2">{pet.name}</h2>
            <p>種類: {pet.species}</p>
            <p>年齢: {pet.age}歳</p>
          </div>
        </Link>
      ))}
    </div>
  );
}