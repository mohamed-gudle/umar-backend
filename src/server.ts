import App from '@/app';
import IndexRoute from '@/index/index.route';
import UsersRoute from '@/users/users.route';
import validateEnv from '@/utils/validateEnv';
import GithubRoute from '@/github_app/github.route';


validateEnv();


  const app = new App([new IndexRoute(), new UsersRoute(), new GithubRoute()]);

  app.listen();

