// pages/api/pets/search.js

let pets = [
  { id: "1", name: "Maximus", species: "犬", breed: "ゴールデンレトリバー", age: 5, ownerId: "1" },
  { id: "2", name: "Bella", species: "猫", breed: "アメリカンショートヘア", age: 2, ownerId: "2" },
  { id: "3", name: "Charlie", species: "鳥", breed: "セキセイインコ", age: 1, ownerId: "1" },
  { id: "4", name: "Daisy", species: "ウサギ", breed: "ネザーランドドワーフ", age: 4, ownerId: "3" },
  { id: "5", name: "Luna", species: "犬", breed: "シバイヌ", age: 2, ownerId: "2" },
]; // ダミーデータ

export default function handler(req, res) {
  if (req.method === "GET") {
    const { query } = req.query; // クエリパラメータから検索条件を取得
    console.log("Received query:", query); // クエリの内容をログに出力

    if (!query) {
      return res.status(400).json({ error: "検索条件を指定してください" });
    }

    const lowerCaseQuery = query.toLowerCase();

    // フィルタリング
    const filteredPets = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(lowerCaseQuery) ||
        pet.species.toLowerCase().includes(lowerCaseQuery) ||
        pet.breed.toLowerCase().includes(lowerCaseQuery)
    );

    console.log("Filtered pets:", filteredPets); // フィルタ結果をログに出力
    res.status(200).json(filteredPets);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}