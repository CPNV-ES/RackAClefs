/**
 * Export Application configuration
 */
module.exports = {
  // Database Configuration for MongoDB
  database: {
    'url': 'mongodb://localhost:27017/rackaclefs'
  },
  // Application configuration for ExpressJS
  app: {
    port: 5555
  },
  // LDAP Configuration for LDAP Authentificaton
  ldap: {
    server: {
      url: 'ldap://172.17.212.121:389',
      bindDn: 'cn=administrateur',
      bindCredentials: 'Pa$$w0rd',
      searchBase: 'dc=cpnv,dc=dev',
      searchFilter: '(userPrincipalName={{username}})',
      searchAttributes: ['displayName', 'mail']
    }
  }
}
