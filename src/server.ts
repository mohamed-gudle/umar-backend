import App from '@/app';
import IndexRoute from '@/index/index.route';
import UsersRoute from '@/users/users.route';
import validateEnv from '@/utils/validateEnv';
import GithubRoute from '@/github_app/github.route';
import TrelloRoutes from './trello_app/trello.route';


validateEnv();


  const app = new App([new IndexRoute(), new UsersRoute(), new GithubRoute(), new TrelloRoutes()]);

  app.listen();

