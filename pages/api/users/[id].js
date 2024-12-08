export default function handler(req, res) {
  // ダミーデータ
  const users = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      profileImage: "https://via.placeholder.com/150",
      groups: ["Group A", "Group B"], // グループ
      posts: ["Post 1 by Alice", "Post 2 by Alice"], // 投稿
      pets: [
        { name: "Buddy", species: "Dog", breed: "Golden Retriever", age: 3 },
        { name: "Mittens", species: "Cat", breed: "Siamese", age: 2 },
      ], // ペット情報
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      profileImage: "https://via.placeholder.com/150",
      groups: ["Group C"],
      posts: ["Post 1 by Bob"],
      pets: [{ name: "Rex", species: "Dog", breed: "Beagle", age: 4 }],
    },
    {
      id: "3",
      name: "Charlie",
      email: "charlie@example.com",
      profileImage: "https://via.placeholder.com/150",
      groups: ["Group A"],
      posts: ["Post 1 by Charlie", "Post 2 by Charlie", "Post 3 by Charlie"],
      pets: [],
    },
  ];

  const { id } = req.query; // URL パラメータから id を取得

  if (req.method === "GET") {
    const user = users.find((user) => user.id === id);

    if (user) {
      // メールアドレスを伏せ字にする
      const maskedEmail = user.email.replace(
        /(.{2}).+@/,
        (_, firstTwo) => `${firstTwo}***@`
      );

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: maskedEmail, // 伏せ字にしたメールアドレス
        profileImage: user.profileImage,
        groups: user.groups, // 所属グループ
        posts: user.posts, // 投稿情報
        pets: user.pets, // ペット情報
      });
    } else {
      res.status(404).json({ error: "User not found" }); // ユーザーが見つからない場合
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}