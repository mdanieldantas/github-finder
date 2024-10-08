// Importa os hooks useState e useEffect do React
import { useState, useEffect } from "react";
// Importa o hook useParams do react-router-dom para acessar os parâmetros da URL
import { useParams } from "react-router-dom";
// Importa o componente BackBtn
import BackBtn from "../components/BackBtn";
// Importa os estilos do arquivo CSS Repos.module.css
import classes from "./Repos.module.css";
// Importa o tipo RepoPros do arquivo de tipos
import { RepoProps } from "../types/repo";
// Importa o componente Loader
import Loader from "../components/Loader";

// Importa o componente Repo
import Repo from "../components/Repo";

// Define o componente funcional Repos
const Repos = () => {
  // Usa o hook useParams para obter o parâmetro 'username' da URL
  const { username } = useParams();

  // Define o estado 'repos' para armazenar os repositórios, inicializado como null
  const [repos, setRepos] = useState<RepoProps[] | [] | null>(null);

  // Define o estado 'isLoading' para controlar o estado de carregamento, inicializado como false
  const [isLoading, setIsLoading] = useState(false);

  // Usa o hook useEffect para carregar os repositórios quando o componente é montado ou quando 'username' muda
  useEffect(() => {
    // Define 'isLoading' como true para indicar que os dados estão sendo carregados
    setIsLoading(true);
    // Função assíncrona para carregar os repositórios do usuário
    const loadRepos = async (username: string) => {
      // Define 'isLoading' como true para indicar que os dados estão sendo carregados
      setIsLoading(true);
      // Faz uma requisição para a API do GitHub para obter os repositórios do usuário
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      // Converte a resposta para JSON
      const data = await res.json();
      // Define 'isLoading' como false para indicar que os dados foram carregados
      setIsLoading(false);
      // Ordena os repositórios pelo número de estrelas em ordem decrescente
      let orderedRepos = data.sort((a: RepoProps, b: RepoProps) => b.stargazers_count - a.stargazers_count);
      // Limita o número de repositórios a 5 por vez
      orderedRepos = orderedRepos.slice(0, 5);
      // Atualiza o estado 'repos' com os dados recebidos
      setRepos(orderedRepos);
    };

    // Se 'username' estiver definido, chama a função loadRepos
    if (username) {
      loadRepos(username);
    }
  }, [username]);

  // Se não houver repositórios e não estiver carregando, renderiza o componente Loader
  if (!repos && !isLoading) return <Loader />;

  // Retorna um elemento div que contém o botão de voltar e exibe o texto "Repos" seguido pelo valor de 'username'
  return (
    <div className={classes.repos}>
      {/* Renderiza o componente BackBtn */}
      <BackBtn />
      {/* Exibe o texto "Explore os repositórios do usuário" seguido pelo valor de 'username' */}
      <h2>Explore os repositórios do usuário: {username}</h2>
      {/* Se não houver repositórios, exibe uma mensagem */}
      {repos && repos.length === 0 && <p>Não há repositório.</p>}
      {/* Se houver repositórios, mapeia e exibe os nomes dos repositórios */}
      {repos && repos.length > 0 && (
        <div className={classes.repos_container}>
          {repos.map((repo: RepoProps) => (
            <Repo key={repo.name} {...repo} />
          ))}
        </div>
      )}
    </div>
  );
};

// Exporta o componente Repos como padrão
export default Repos;
