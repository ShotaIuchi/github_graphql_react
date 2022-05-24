import React from "react";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

console.log(process.env.REACT_APP_GITHUB_TOKEN);

type Repository = {
  name: string;
  url: string;
  description: string;
};

const GET_REPOSITORY = gql`
  query {
    viewer {
      repositories(
        first: 3
        privacy: PUBLIC
        isFork: false
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          name
          url
          description
        }
      }
    }
  }
`;

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
      },
    });
  },
});

function App() {
  const [repositories, setRepositories] = React.useState<Repository[]>([]);

  const fetch = async () => {
    const { data } = await client.query({
      query: GET_REPOSITORY,
    });
    console.log(data);
    setRepositories(data.viewer.repositories.nodes);
  };

  React.useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="App">
      <div>
        {repositories.map((repository: Repository) => {
          return (
            <div style={style} key={repository.name}>
              <b>Repository: {repository.name}</b>
              <p>URL: {repository.url}</p>
              <p>Description: {repository.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const style = {
  margin: "8px auto",
  padding: "8px",
  border: "1px solid #000",
  width: "500px",
};

export default App;
