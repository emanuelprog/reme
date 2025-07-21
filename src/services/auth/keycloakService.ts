import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://autenticacao-h.campogrande.ms.gov.br/auth',
  realm: 'campograndems',
  clientId: 'web_app',
});

export default keycloak;