module.exports = {
  database: {
    'url': 'mongodb://localhost:27017/rackaclefs'
  },
  app: {
    port: 5555
  },
  ldap: {
    server: {
      url: 'ldap://172.17.211.131:389',
      bindDn: 'cn=administrateur',
      bindCredentials: 'Pa$$w0rd',
      searchBase: 'dc=cpnv,dc=dev',
      searchFilter: '(userPrincipalName={{username}})',
      searchAttributes: ['displayName', 'mail']
    }
  }
}
