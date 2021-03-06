import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { KeycloakService, NgxKeycloakModule } from '@procempa/ngx-keycloak';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxKeycloakModule.forRoot()
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initKeycloak, multi: true, deps: [KeycloakService] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initKeycloak(keycloak: KeycloakService) {
  const env = {
    url: environment.KEYCLOAK_URL,
    realm: environment.KEYCLOAK_REALM,
    clientId: environment.KEYCLOAK_CLIENT
  };

  keycloak.onReady.subscribe(a => console.log('ready', a))
  keycloak.onAuthRefresh.subscribe(t => console.log('refreshed token: ', t));
  keycloak.onAuthSuccess.subscribe(u => console.log('auth success: ', u))
  keycloak.minValidity = -1;

  keycloak.urlsToIgnore = ['my.url.com', 'another.url.com.uk'];
  return () => keycloak.init(env, { onLoad: 'login-required' });
}
