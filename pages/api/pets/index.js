// ダミーデータ
let pets = [
  { id: "1", name: "Max", species: "犬", breed: "ゴールデンレトリバー", age: 3, ownerId: "1" },
  { id: "2", name: "Bella", species: "猫", breed: "アメリカンショートヘア", age: 2, ownerId: "2" },
  { id: "3", name: "Charlie", species: "鳥", breed: "セキセイインコ", age: 1, ownerId: "1" },
  { id: "4", name: "Daisy", species: "ウサギ", breed: "ネザーランドドワーフ", age: 4, ownerId: "3" },
]; // ダミーデータ

export default function handler(req, res) {
  if (req.method === "GET") {
    // 全ペットを取得
    res.status(200).json(pets);
  } else if (req.method === "POST") {
    // 新しいペットを登録
    const { name, species, breed, age, ownerId } = req.body;

    // 必須フィールドのチェック
    if (!name || !species || !breed || age === undefined || !ownerId) {
      return res.status(400).json({ error: "すべてのフィールドを入力してください" });
    }

    // 所有者ごとのペット数をチェック
    const ownerPets = pets.filter((pet) => pet.ownerId === ownerId);
    if (ownerPets.length >= 10) {
      return res.status(400).json({ error: "ペットの登録数が上限（10匹）に達しました。" });
    }

    // 新しいペットデータの作成
    const newPet = {
      id: (pets.length + 1).toString(), // 新しいIDを生成
      name,
      species,
      breed,
      age,
      ownerId,
    };

    pets.push(newPet); // ダミーデータに追加
    res.status(201).json(newPet); // 作成されたペットデータを返す
  } else {
    // サポートされていないメソッドの処理
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}