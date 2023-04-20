import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// localStorage.setItem("money", "25000");
// localStorage.setItem("watch_list1", "{}");
// localStorage.setItem("portfolio", "{}");
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
