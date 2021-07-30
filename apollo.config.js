module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"], // 띄어쓰기 조심!
    tagName: "gql",
    service: {
      name: "max-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
