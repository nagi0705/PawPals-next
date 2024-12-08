// pages/api/pets/[id].js

let pets = [
  { id: "1", name: "Maximus", species: "犬", breed: "ゴールデンレトリバー", age: 5, ownerId: "1" },
  { id: "2", name: "Bella", species: "猫", breed: "アメリカンショートヘア", age: 2, ownerId: "2" },
  { id: "3", name: "Charlie", species: "鳥", breed: "セキセイインコ", age: 1, ownerId: "1" },
  { id: "4", name: "Daisy", species: "ウサギ", breed: "ネザーランドドワーフ", age: 4, ownerId: "3" },
  { id: "5", name: "Luna", species: "犬", breed: "シバイヌ", age: 2, ownerId: "2" },
]; // ダミーデータ

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const pet = pets.find((p) => p.id === id);
    if (pet) {
      res.status(200).json(pet);
    } else {
      res.status(404).json({ error: "Pet not found" });
    }
  } else if (req.method === "PATCH") {
    const { name, species, breed, age } = req.body;

    const petIndex = pets.findIndex((p) => p.id === id);
    if (petIndex === -1) {
      res.status(404).json({ error: "Pet not found" });
    } else {
      const updatedPet = { ...pets[petIndex], name, species, breed, age };
      pets[petIndex] = updatedPet;
      res.status(200).json(updatedPet);
    }
  } else if (req.method === "DELETE") {
    const petIndex = pets.findIndex((p) => p.id === id);
    if (petIndex === -1) {
      res.status(404).json({ error: "Pet not found" });
    } else {
      pets.splice(petIndex, 1); // ペットを削除
      res.status(200).json({ message: "Pet deleted successfully" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}